import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

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
      throw new Error("Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO pricing_packages (name, category, price_range, features, is_popular)
      VALUES (${req.name}, ${req.category}, ${req.priceRange}, ${req.features}, ${req.isPopular})
      RETURNING id
    `;

    return {
      id: result!.id,
      success: true,
    };
  }
);
