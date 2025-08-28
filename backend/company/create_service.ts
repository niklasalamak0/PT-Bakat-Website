import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { appendRowToSection } from "../integrations/sync";

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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO services (name, description, category, icon, features)
      VALUES (${req.name}, ${req.description}, ${req.category}, ${req.icon}, ${req.features})
      RETURNING id
    `;

    const id = result!.id;

    try {
      await appendRowToSection("services", {
        id,
        name: req.name,
        description: req.description,
        category: req.category,
        icon: req.icon,
        features: JSON.stringify(req.features),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("appendRowToSection(services) failed:", err);
    }

    return {
      id,
      success: true,
    };
  }
);
