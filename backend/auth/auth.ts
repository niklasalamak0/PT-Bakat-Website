import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const adminSecret = secret("AdminSecret");

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  role: string;
  email: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    // Simple token validation - in production, use proper JWT validation
    const validToken = adminSecret();
    if (token !== validToken) {
      throw APIError.unauthenticated("invalid token");
    }

    // For demo purposes, return admin user
    return {
      userID: "admin",
      role: "admin",
      email: "admin@baktikaryateknik.com",
    };
  }
);

export const gw = new Gateway({ authHandler: auth });
