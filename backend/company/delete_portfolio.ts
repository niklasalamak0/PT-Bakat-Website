import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface DeletePortfolioRequest {
  id: number;
}

export interface DeletePortfolioResponse {
  success: boolean;
}

// Deletes a portfolio item.
export const deletePortfolio = api<DeletePortfolioRequest, DeletePortfolioResponse>(
  { expose: true, method: "DELETE", path: "/portfolios/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM portfolios WHERE id = ${req.id}`;
    return { success: true };
  }
);
