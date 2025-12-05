import type { LoginRequest, LoginResponse } from "@/domain/types";
import { API_BASE_URL, DEFAULT_AUTH_CREDENTIALS } from "./config";

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log("[AUTH SERVICE] 📤 Sending login request to API:", {
    url: `${API_BASE_URL}/api/v1/auth/login`,
    email: credentials.email,
  });

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  console.log("[AUTH SERVICE] 📥 API response status:", response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("[AUTH SERVICE] ✅ Login API call successful");
  console.log("[AUTH SERVICE] 📦 Full response data:", JSON.stringify(data, null, 2));
  return data;
};

const loginWithHardcodedCredentials = async (): Promise<LoginResponse> => {
  console.log("[AUTH SERVICE] 🔑 Using hardcoded credentials for login");
  return login(DEFAULT_AUTH_CREDENTIALS);
};

export const authService = {
  login,
  loginWithHardcodedCredentials,
};

