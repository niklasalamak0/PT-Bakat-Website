import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface Testimonial {
  id: number;
  clientName: string;
  company: string;
  rating: number;
  comment: string;
  projectType: string;
}

export interface GetTestimonialsResponse {
  testimonials: Testimonial[];
}

// Retrieves all testimonials.
export const getTestimonials = api<void, GetTestimonialsResponse>(
  { expose: true, method: "GET", path: "/testimonials" },
  async () => {
    const testimonials = await companyDB.queryAll<Testimonial>`
      SELECT 
        id, 
        client_name as "clientName", 
        company, 
        rating, 
        comment, 
        project_type as "projectType" 
      FROM testimonials 
      ORDER BY created_at DESC
    `;
    return { testimonials };
  }
);
