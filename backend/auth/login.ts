import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const adminSecret = secret("AdminSecret");

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

// Admin login endpoint.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // Simple hardcoded credentials - in production, use proper user management
    const validCredentials = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "manager", password: "manager123", role: "manager" },
    ];

    const user = validCredentials.find(
      u => u.username === req.username && u.password === req.password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      token: adminSecret(),
      user: {
        id: user.username,
        username: user.username,
        role: user.role,
      },
    };
  }
);
