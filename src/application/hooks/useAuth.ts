import { useEffect, useRef } from "react";
import { useAuthStore } from "@/application/stores/auth.store";

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

export const useAuth = () => {
  const { login, logout, isAuthenticated, isLoading, error, token } = useAuthStore();
  const loginAttempted = useRef(false);
  const hydratedRef = useRef(false);

  // Restore from localStorage after hydration (client-only)
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    console.log("[AUTH HOOK] 🔧 Hydration: Checking localStorage...");

    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        console.log("[AUTH HOOK] ✅ Restoring session from localStorage:", {
          userId: user.id,
          email: user.email,
        });

        // Restore auth state
        useAuthStore.setState({
          token: storedToken,
          userId: user.id,
          email: user.email,
          isAuthenticated: true,
        });
      } else {
        console.log("[AUTH HOOK] ❌ No stored session found");
      }
    } catch (error) {
      console.log("[AUTH HOOK] ⚠️  Invalid localStorage data, clearing:", error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  // Auto-login if not authenticated
  useEffect(() => {
    console.log("[AUTH HOOK] 🔄 useAuth effect running:", {
      isAuthenticated,
      isLoading,
      loginAttempted: loginAttempted.current,
      hasToken: !!token,
    });

    // Only attempt login once on mount if not authenticated
    if (!isAuthenticated && !isLoading && !loginAttempted.current) {
      console.log("[AUTH HOOK] 🚀 Triggering auto-login...");
      loginAttempted.current = true;
      login().catch((err: Error) => {
        console.error("[AUTH HOOK] ❌ Auto-login failed:", err);
      });
    } else if (isAuthenticated) {
      console.log("[AUTH HOOK] ✅ Already authenticated, skipping login");
    } else if (loginAttempted.current) {
      console.log("[AUTH HOOK] ⏭️  Login already attempted, skipping");
    }
  }, [isAuthenticated, isLoading, login, token]);

  return {
    isAuthenticated,
    isLoading,
    error,
    token,
    login,
    logout,
  };
};

