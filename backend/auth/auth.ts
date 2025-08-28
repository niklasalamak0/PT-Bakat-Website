import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const adminSecret = secret("AdminSecret");

interface AuthParams {
  authorization?: Header<"Authorization">; // diambil dari header HTTP
}

export interface AuthData {
  userID: string;
  role: string;
  email: string;
}

const auth = authHandler<AuthParams, AuthData>(async (data) => {
  // NOTE: Auth handler hanya dipanggil jika:
  // - request menyertakan Authorization header, atau
  // - endpoint diberi { auth: true }
  const raw = data.authorization ?? "";
  const token = raw.replace(/^Bearer\s+/i, "").trim();
  const validToken = adminSecret();

  if (!token) {
    // untuk endpoint { auth: true } ini akan menghasilkan 401 (benar)
    throw APIError.unauthenticated("missing token");
  }
  if (!validToken || token !== validToken) {
    throw APIError.unauthenticated("invalid token");
  }

  // tokennya valid → kembalikan data user (sesuaikan kalau perlu)
  return {
    userID: "admin",
    role: "admin",
    email: "admin@baktikaryateknik.com",
  };
});

// Gateway global; endpoint yang butuh proteksi tambahkan { auth: true }
export const gw = new Gateway({ authHandler: auth });
