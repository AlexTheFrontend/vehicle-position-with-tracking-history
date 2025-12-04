import { useEffect, useRef } from "react";
import { useAuthStore } from "@/application/stores/auth.store";

export const useAuth = () => {
  const { login, logout, isAuthenticated, isLoading, error, token } = useAuthStore();
  const loginAttempted = useRef(false);

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

