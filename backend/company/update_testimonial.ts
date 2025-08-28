import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { updateRowInSection } from "../integrations/sync";

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
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    await companyDB.exec`
      UPDATE testimonials 
      SET client_name = ${req.clientName}, company = ${req.company}, 
          rating = ${req.rating}, comment = ${req.comment}, 
          project_type = ${req.projectType}
      WHERE id = ${req.id}
    `;

    try {
      await updateRowInSection("testimonials", req.id, {
        clientName: req.clientName,
        company: req.company,
        rating: String(req.rating),
        comment: req.comment,
        projectType: req.projectType,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.userID,
      });
    } catch (err) {
      console.error("updateRowInSection(testimonials) failed:", err);
    }

    return { success: true };
  }
);
