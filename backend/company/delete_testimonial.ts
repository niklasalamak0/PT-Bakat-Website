import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { deleteRowInSection } from "../integrations/sync";

export interface DeleteTestimonialRequest {
  id: number;
}

export interface DeleteTestimonialResponse {
  success: boolean;
}

// Deletes a testimonial.
export const deleteTestimonial = api<DeleteTestimonialRequest, DeleteTestimonialResponse>(
  { expose: true, method: "DELETE", path: "/testimonials/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM testimonials WHERE id = ${req.id}`;

    try {
      await deleteRowInSection("testimonials", req.id);
    } catch (err) {
      console.error("deleteRowInSection(testimonials) failed:", err);
    }
    return { success: true };
  }
);
