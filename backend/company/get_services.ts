import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
}

export interface GetServicesParams {
  category?: string;
}

export interface GetServicesResponse {
  services: Service[];
}

// Retrieves all services, optionally filtered by category.
export const getServices = api<GetServicesParams, GetServicesResponse>(
  { expose: true, method: "GET", path: "/services" },
  async (params) => {
    let query = `SELECT id, name, description, category, icon, features FROM services`;
    const queryParams: any[] = [];

    if (params.category) {
      query += ` WHERE category = $1`;
      queryParams.push(params.category);
    }

    query += ` ORDER BY id`;

    const services = await companyDB.rawQueryAll<Service>(query, ...queryParams);
    return { services };
  }
);
