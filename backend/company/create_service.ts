import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
}

export interface CreateServiceResponse {
  id: number;
  success: boolean;
}

// Creates a new service.
export const createService = api<CreateServiceRequest, CreateServiceResponse>(
  { expose: true, method: "POST", path: "/services", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO services (name, description, category, icon, features)
      VALUES (${req.name}, ${req.description}, ${req.category}, ${req.icon}, ${req.features})
      RETURNING id
    `;

    return {
      id: result!.id,
      success: true,
    };
  }
);
