import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { appendRowToSection } from "../integrations/sync";

export interface CreatePortfolioRequest {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  clientName: string;
  completionDate: string;
  location: string;
  // New optional fields for Sheets sync
  images?: string[]; // URLs array
  thumbnail?: string;
  alt?: string;
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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    const imagesJson = JSON.stringify(req.images ?? []);
    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO portfolios (title, description, category, image_url, client_name, completion_date, location, images, thumbnail, alt, updated_at, updated_by)
      VALUES (${req.title}, ${req.description}, ${req.category}, ${req.imageUrl}, ${req.clientName}, ${req.completionDate}, ${req.location}, ${imagesJson}, ${req.thumbnail ?? null}, ${req.alt ?? null}, NOW(), ${auth.userID})
      RETURNING id
    `;

    const id = result!.id;

    // Try to append to Google Sheet for portfolios (best effort).
    try {
      await appendRowToSection("portfolios", {
        id,
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
      // Do not fail the request, but log it.
      console.error("appendRowToSection(portfolios) failed:", err);
    }

    return {
      id,
      success: true,
    };
  }
);
