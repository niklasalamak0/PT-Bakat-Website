import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { deleteRowInSection } from "../integrations/sync";

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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM pricing_packages WHERE id = ${req.id}`;

    try {
      await deleteRowInSection("pricing", req.id);
    } catch (err) {
      console.error("deleteRowInSection(pricing) failed:", err);
    }
    return { success: true };
  }
);
