import { create } from "zustand";
import { authService } from "@/infrastructure/api/auth.service";

interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

// Helper to get initial state from localStorage
const getInitialAuthState = () => {
  console.log("[AUTH] 🔧 Initializing auth store...");
  
  if (typeof window === "undefined") {
    console.log("[AUTH] ⚠️  Running on server (SSR), no token available");
    return {
      token: null,
      userId: null,
      email: null,
      isAuthenticated: false,
    };
  }

  try {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser);
      console.log("[AUTH] ✅ Token found in localStorage, restoring session:", {
        userId: user.id,
        email: user.email,
      });
      return {
        token: storedToken,
        userId: user.id,
        email: user.email,
        isAuthenticated: true,
      };
    } else {
      console.log("[AUTH] ❌ No token found in localStorage");
    }
  } catch (error) {
    console.log("[AUTH] ⚠️  Invalid data in localStorage, clearing:", error);
    // Invalid stored data, clear it
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  console.log("[AUTH] 🔓 Starting unauthenticated");
  return {
    token: null,
    userId: null,
    email: null,
    isAuthenticated: false,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuthState(),
  isLoading: false,
  error: null,

  login: async () => {
    console.log("[AUTH] 🔐 Starting login attempt with hardcoded credentials...");
    set({ isLoading: true, error: null });
    try {
      const response = await authService.loginWithHardcodedCredentials();
      console.log("[AUTH] 📡 Received response from API:", {
        status: response.status,
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user,
        tokenType: response.data?.token_type,
        expiresIn: response.data?.expires_in,
      });
      
      if (response.status === "success" && response.data?.token && response.data?.user) {
        const { token, user } = response.data;
        
        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          console.log("[AUTH] 💾 Token saved to localStorage");
        }

        set({
          token,
          userId: user.id,
          email: user.email,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log("[AUTH] ✅ Login successful! User:", {
          userId: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        });
      } else {
        throw new Error(`Login failed: status=${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      console.error("[AUTH] ❌ Login failed:", errorMessage);
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    console.log("[AUTH] 🚪 Logging out...");
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      console.log("[AUTH] 🗑️  Token removed from localStorage");
    }
    set({
      token: null,
      userId: null,
      email: null,
      isAuthenticated: false,
      error: null,
    });
    console.log("[AUTH] ✅ Logout complete");
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    set({ token, isAuthenticated: true });
  },
}));
