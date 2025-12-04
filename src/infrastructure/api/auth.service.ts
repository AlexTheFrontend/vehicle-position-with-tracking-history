import type { LoginRequest, LoginResponse } from "@/domain/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-dev.carbn.nz";

class AuthService {
  private readonly baseUrl = API_BASE_URL;

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return response.json();
  }

  async loginWithHardcodedCredentials(): Promise<LoginResponse> {
    return this.login({
      email: "sasha@bfsnz.co.nz",
      password: "NewPass@1976",
    });
  }
}

export const authService = new AuthService();

