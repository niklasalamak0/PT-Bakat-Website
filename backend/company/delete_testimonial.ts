import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

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
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`DELETE FROM testimonials WHERE id = ${req.id}`;
    return { success: true };
  }
);
