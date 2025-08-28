import { api, APIError } from "encore.dev/api";
import { companyDB } from "./db";
import { updateRowInSection } from "../integrations/sync";

export interface UpdateContactStatusRequest {
  id: number;
  status: string;
}

export interface UpdateContactStatusResponse {
  success: boolean;
  message: string;
}

// Updates the status of a contact submission.
export const updateContactStatus = api<UpdateContactStatusRequest, UpdateContactStatusResponse>(
  { expose: true, method: "PUT", path: "/contact-submissions/:id/status" },
  async (req) => {
    const validStatuses = ['pending', 'contacted', 'completed'];
    
    if (!validStatuses.includes(req.status)) {
      throw APIError.invalidArgument("Status must be one of: pending, contacted, completed");
    }

    const result = await companyDB.queryRow`
      UPDATE contact_submissions 
      SET status = ${req.status}
      WHERE id = ${req.id}
      RETURNING id, name, email, phone, service_type as "serviceType", message, status, created_at as "createdAt"
    `;

    if (!result) {
      throw APIError.notFound("Contact submission not found");
    }

    // Best-effort: update in Sheet too.
    try {
      await updateRowInSection("contact", req.id, {
        status: req.status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("updateRowInSection(contact) failed:", err);
    }

    return {
      success: true,
      message: `Status updated to ${req.status}`
    };
  }
);
