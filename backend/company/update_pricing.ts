import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { updateRowInSection } from "../integrations/sync";

export interface UpdatePricingRequest {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  features: string[];
  isPopular: boolean;
}

export interface UpdatePricingResponse {
  success: boolean;
}

// Updates an existing pricing package.
export const updatePricing = api<UpdatePricingRequest, UpdatePricingResponse>(
  { expose: true, method: "PUT", path: "/pricing/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    await companyDB.exec`
      UPDATE pricing_packages 
      SET name = ${req.name}, category = ${req.category}, 
          price_range = ${req.priceRange}, features = ${req.features}, 
          is_popular = ${req.isPopular}
      WHERE id = ${req.id}
    `;

    try {
      await updateRowInSection("pricing", req.id, {
        name: req.name,
        category: req.category,
        priceRange: req.priceRange,
        features: JSON.stringify(req.features),
        isPopular: req.isPopular ? "true" : "false",
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("updateRowInSection(pricing) failed:", err);
    }

    return { success: true };
  }
);
