import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { updateRowInSection } from "../integrations/sync";

export interface UpdatePortfolioRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  clientName: string;
  completionDate: string;
  location: string;
  images?: string[]; // URLs array
  thumbnail?: string;
  alt?: string;
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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    const imagesJson = JSON.stringify(req.images ?? []);

    await companyDB.exec`
      UPDATE portfolios 
      SET title = ${req.title}, description = ${req.description}, 
          category = ${req.category}, image_url = ${req.imageUrl}, 
          client_name = ${req.clientName}, completion_date = ${req.completionDate}, 
          location = ${req.location}, images = ${imagesJson},
          thumbnail = ${req.thumbnail ?? null}, alt = ${req.alt ?? null},
          updated_at = NOW(), updated_by = ${auth.userID}
      WHERE id = ${req.id}
    `;

    try {
      await updateRowInSection("portfolios", req.id, {
        title: req.title,
        description: req.description,
        category: req.category,
        images: imagesJson,
        thumbnail: req.thumbnail ?? "",
        alt: req.alt ?? "",
        clientName: req.clientName,
        completionDate: req.completionDate,
        location: req.location,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("updateRowInSection(portfolios) failed:", err);
    }

    return { success: true };
  }
);
