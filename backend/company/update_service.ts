import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

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
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`
      UPDATE services 
      SET name = ${req.name}, description = ${req.description}, 
          category = ${req.category}, icon = ${req.icon}, features = ${req.features}
      WHERE id = ${req.id}
    `;

    return { success: true };
  }
);
