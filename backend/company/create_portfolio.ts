import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface CreatePortfolioRequest {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  clientName: string;
  completionDate: string;
  location: string;
}

export interface CreatePortfolioResponse {
  id: number;
  success: boolean;
}

// Creates a new portfolio item.
export const createPortfolio = api<CreatePortfolioRequest, CreatePortfolioResponse>(
  { expose: true, method: "POST", path: "/portfolios", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO portfolios (title, description, category, image_url, client_name, completion_date, location)
      VALUES (${req.title}, ${req.description}, ${req.category}, ${req.imageUrl}, ${req.clientName}, ${req.completionDate}, ${req.location})
      RETURNING id
    `;

    return {
      id: result!.id,
      success: true,
    };
  }
);
