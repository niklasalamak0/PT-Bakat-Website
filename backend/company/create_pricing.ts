import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { appendRowToSection } from "../integrations/sync";

export interface CreatePricingRequest {
  name: string;
  category: string;
  priceRange: string;
  features: string[];
  isPopular: boolean;
}

export interface CreatePricingResponse {
  id: number;
  success: boolean;
}

// Creates a new pricing package.
export const createPricing = api<CreatePricingRequest, CreatePricingResponse>(
  { expose: true, method: "POST", path: "/pricing", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO pricing_packages (name, category, price_range, features, is_popular)
      VALUES (${req.name}, ${req.category}, ${req.priceRange}, ${req.features}, ${req.isPopular})
      RETURNING id
    `;

    const id = result!.id;

    try {
      await appendRowToSection("pricing", {
        id,
        name: req.name,
        category: req.category,
        priceRange: req.priceRange,
        features: JSON.stringify(req.features),
        isPopular: req.isPopular ? "true" : "false",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("appendRowToSection(pricing) failed:", err);
    }

    return {
      id,
      success: true,
    };
  }
);
