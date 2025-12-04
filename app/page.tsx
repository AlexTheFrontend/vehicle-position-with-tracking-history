"use client";

import { Toaster } from "react-hot-toast";
import { useAuth } from "@/application/hooks/useAuth";


export default function Home() {
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuth();


  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Authentication Error</p>
          <p className="text-gray-600">{authError}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Not authenticated</p>
      </div>
    );
  }

  return (
    <>
    <div className="relative w-screen h-screen">
      <Toaster position="top-center" />
      
      {/* Status Bar */}
      <div className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center space-x-4">
          Hello World
          
      </div>

    
    </div>
    </>
  );
}