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
        location 
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

    const portfolios = await companyDB.rawQueryAll<Portfolio>(query, ...queryParams);
    return { portfolios };
  }
);
