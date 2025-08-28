import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { deleteRowInSection } from "../integrations/sync";

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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM services WHERE id = ${req.id}`;

    try {
      await deleteRowInSection("services", req.id);
    } catch (err) {
      console.error("deleteRowInSection(services) failed:", err);
    }
    return { success: true };
  }
);
