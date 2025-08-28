import { api, APIError } from "encore.dev/api";
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

export const login = api<LoginRequest, LoginResponse>(
  {
    expose: true,
    method: "POST",
    path: "/auth/login",
    // penting: endpoint login TIDAK perlu auth
    auth: false,
  },
  async (req) => {
    // kredensial demo; di produksi pakai DB
    const validCredentials = [
      { username: "admin",   password: "admin123",   role: "admin" },
      { username: "manager", password: "manager123", role: "manager" },
    ];

    const user = validCredentials.find(
      (u) => u.username === req.username && u.password === req.password
    );
    if (!user) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    // ambil token dari Secret (wajib diset via `encore secret set`)
    const token = adminSecret();
    if (!token || token.trim() === "") {
      // beri error jelas agar dev tahu harus set secret
      throw APIError.internal(
        "AdminSecret is not configured. Run: encore secret set --type local AdminSecret"
      );
    }

    return {
      token,
      user: {
        id: user.username,
        username: user.username,
        role: user.role,
      },
    };
  }
);
