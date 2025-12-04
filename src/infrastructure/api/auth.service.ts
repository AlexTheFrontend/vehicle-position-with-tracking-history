import type { LoginRequest, LoginResponse } from "@/domain/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-dev.carbn.nz";

class AuthService {
  private readonly baseUrl = API_BASE_URL;

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log("[AUTH SERVICE] 📤 Sending login request to API:", {
      url: `${this.baseUrl}/api/v1/auth/login`,
      email: credentials.email,
    });

    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
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
    return data;
  }

  async loginWithHardcodedCredentials(): Promise<LoginResponse> {
    console.log("[AUTH SERVICE] 🔑 Using hardcoded credentials for login");
    return this.login({
      email: "sasha@bfsnz.co.nz",
      password: "NewPass@1976",
    });
  }
}

export const authService = new AuthService();

