import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface UpdateTestimonialRequest {
  id: number;
  clientName: string;
  company: string;
  rating: number;
  comment: string;
  projectType: string;
}

export interface UpdateTestimonialResponse {
  success: boolean;
}

// Updates an existing testimonial.
export const updateTestimonial = api<UpdateTestimonialRequest, UpdateTestimonialResponse>(
  { expose: true, method: "PUT", path: "/testimonials/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    await companyDB.exec`
      UPDATE testimonials 
      SET client_name = ${req.clientName}, company = ${req.company}, 
          rating = ${req.rating}, comment = ${req.comment}, 
          project_type = ${req.projectType}
      WHERE id = ${req.id}
    `;

    return { success: true };
  }
);
