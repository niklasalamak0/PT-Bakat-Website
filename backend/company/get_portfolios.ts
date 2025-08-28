import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  clientName: string;
  completionDate: string;
  location: string;
  // New fields
  images?: string[]; // parsed from JSON column
  thumbnail?: string | null;
  alt?: string | null;
  updatedAt?: string | null;
}

export interface GetPortfoliosParams {
  category?: string;
  limit?: number;
}

export interface GetPortfoliosResponse {
  portfolios: Portfolio[];
}

// Retrieves portfolio projects, optionally filtered by category.
export const getPortfolios = api<GetPortfoliosParams, GetPortfoliosResponse>(
  { expose: true, method: "GET", path: "/portfolios" },
  async (params) => {
    let query = `
      SELECT 
        id, 
        title, 
        description, 
        category, 
        image_url as "imageUrl", 
        client_name as "clientName", 
        completion_date as "completionDate", 
        location,
        images,
        thumbnail,
        alt,
        updated_at as "updatedAt"
      FROM portfolios
    `;
    const queryParams: any[] = [];

    if (params.category) {
      query += ` WHERE category = $1`;
      queryParams.push(params.category);
    }

    query += ` ORDER BY completion_date DESC`;

    if (params.limit) {
      query += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(params.limit);
    }

    const rows = await companyDB.rawQueryAll<any>(query, ...queryParams);
    const portfolios: Portfolio[] = rows.map((r) => {
      let imgs: string[] | undefined;
      try {
        imgs = r.images ? JSON.parse(r.images) : undefined;
      } catch {
        imgs = undefined;
      }
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        imageUrl: r.imageUrl,
        clientName: r.clientName,
        completionDate: r.completionDate,
        location: r.location,
        images: imgs,
        thumbnail: r.thumbnail ?? null,
        alt: r.alt ?? null,
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
      };
    });
    return { portfolios };
  }
);
