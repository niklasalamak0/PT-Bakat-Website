import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface PricingPackage {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  features: string[];
  isPopular: boolean;
}

export interface GetPricingParams {
  category?: string;
}

export interface GetPricingResponse {
  packages: PricingPackage[];
}

// Retrieves pricing packages, optionally filtered by category.
export const getPricing = api<GetPricingParams, GetPricingResponse>(
  { expose: true, method: "GET", path: "/pricing" },
  async (params) => {
    let query = `
      SELECT 
        id, 
        name, 
        category, 
        price_range as "priceRange", 
        features, 
        is_popular as "isPopular" 
      FROM pricing_packages
    `;
    const queryParams: any[] = [];

    if (params.category) {
      query += ` WHERE category = $1`;
      queryParams.push(params.category);
    }

    query += ` ORDER BY id`;

    const packages = await companyDB.rawQueryAll<PricingPackage>(query, ...queryParams);
    return { packages };
  }
);
