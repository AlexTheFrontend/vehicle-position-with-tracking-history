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

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.loginWithHardcodedCredentials();
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }

        set({
          token,
          userId: user.id,
          email: user.email,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    set({
      token: null,
      userId: null,
      email: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    set({ token, isAuthenticated: true });
  },
}));

// Initialize from localStorage on client side
if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  
  if (storedToken && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.setState({
        token: storedToken,
        userId: user.id,
        email: user.email,
        isAuthenticated: true,
      });
    } catch {
      // Invalid stored data, clear it
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }
}

