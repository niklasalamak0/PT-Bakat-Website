import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface DeleteServiceRequest {
  id: number;
}

export interface DeleteServiceResponse {
  success: boolean;
}

// Deletes a service.
export const deleteService = api<DeleteServiceRequest, DeleteServiceResponse>(
  { expose: true, method: "DELETE", path: "/services/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM services WHERE id = ${req.id}`;
    return { success: true };
  }
);
