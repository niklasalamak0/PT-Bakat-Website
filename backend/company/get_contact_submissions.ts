import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface GetContactSubmissionsParams {
  status?: string;
  limit?: number;
}

export interface GetContactSubmissionsResponse {
  submissions: ContactSubmission[];
  total: number;
}

// Retrieves contact form submissions for admin viewing.
export const getContactSubmissions = api<GetContactSubmissionsParams, GetContactSubmissionsResponse>(
  { expose: true, method: "GET", path: "/contact-submissions" },
  async (params) => {
    let query = `
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        service_type as "serviceType", 
        message, 
        status, 
        created_at as "createdAt"
      FROM contact_submissions
    `;
    const queryParams: any[] = [];

    if (params.status) {
      query += ` WHERE status = $1`;
      queryParams.push(params.status);
    }

    query += ` ORDER BY created_at DESC`;

    if (params.limit) {
      query += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(params.limit);
    }

    const submissions = await companyDB.rawQueryAll<ContactSubmission>(query, ...queryParams);
    
    // Get total count
    const totalResult = await companyDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM contact_submissions
    `;
    const total = totalResult?.count || 0;

    return { submissions, total };
  }
);
