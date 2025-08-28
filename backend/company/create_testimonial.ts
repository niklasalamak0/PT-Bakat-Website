import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { appendRowToSection } from "../integrations/sync";

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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    const result = await companyDB.queryRow<{ id: number }>`
      INSERT INTO testimonials (client_name, company, rating, comment, project_type)
      VALUES (${req.clientName}, ${req.company}, ${req.rating}, ${req.comment}, ${req.projectType})
      RETURNING id
    `;

    const id = result!.id;

    try {
      await appendRowToSection("testimonials", {
        id,
        clientName: req.clientName,
        company: req.company,
        rating: String(req.rating),
        comment: req.comment,
        projectType: req.projectType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("appendRowToSection(testimonials) failed:", err);
    }

    return {
      id,
      success: true,
    };
  }
);
