import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";

export interface CreateTestimonialRequest {
  clientName: string;
  company: string;
  rating: number;
  comment: string;
  projectType: string;
}

export interface CreateTestimonialResponse {
  id: number;
  success: boolean;
}

// Creates a new testimonial.
export const createTestimonial = api<CreateTestimonialRequest, CreateTestimonialResponse>(
  { expose: true, method: "POST", path: "/testimonials", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO testimonials (client_name, company, rating, comment, project_type)
      VALUES (${req.clientName}, ${req.company}, ${req.rating}, ${req.comment}, ${req.projectType})
      RETURNING id
    `;

    return {
      id: result!.id,
      success: true,
    };
  }
);
