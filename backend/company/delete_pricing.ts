import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface DeletePricingRequest {
  id: number;
}

export interface DeletePricingResponse {
  success: boolean;
}

// Deletes a pricing package.
export const deletePricing = api<DeletePricingRequest, DeletePricingResponse>(
  { expose: true, method: "DELETE", path: "/pricing/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM pricing_packages WHERE id = ${req.id}`;
    return { success: true };
  }
);
