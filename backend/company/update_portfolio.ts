import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface UpdatePortfolioRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  clientName: string;
  completionDate: string;
  location: string;
}

export interface UpdatePortfolioResponse {
  success: boolean;
}

// Updates an existing portfolio item.
export const updatePortfolio = api<UpdatePortfolioRequest, UpdatePortfolioResponse>(
  { expose: true, method: "PUT", path: "/portfolios/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`
      UPDATE portfolios 
      SET title = ${req.title}, description = ${req.description}, 
          category = ${req.category}, image_url = ${req.imageUrl}, 
          client_name = ${req.clientName}, completion_date = ${req.completionDate}, 
          location = ${req.location}
      WHERE id = ${req.id}
    `;

    return { success: true };
  }
);
