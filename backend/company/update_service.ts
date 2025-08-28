import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { updateRowInSection } from "../integrations/sync";

export interface UpdateServiceRequest {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
}

export interface UpdateServiceResponse {
  success: boolean;
}

// Updates an existing service.
export const updateService = api<UpdateServiceRequest, UpdateServiceResponse>(
  { expose: true, method: "PUT", path: "/services/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    await companyDB.exec`
      UPDATE services 
      SET name = ${req.name}, description = ${req.description}, 
          category = ${req.category}, icon = ${req.icon}, features = ${req.features}
      WHERE id = ${req.id}
    `;

    try {
      await updateRowInSection("services", req.id, {
        name: req.name,
        description: req.description,
        category: req.category,
        icon: req.icon,
        features: JSON.stringify(req.features),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("updateRowInSection(services) failed:", err);
    }

    return { success: true };
  }
);
