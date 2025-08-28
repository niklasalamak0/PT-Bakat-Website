import { api } from "encore.dev/api";
import { companyDB } from "./db";
import { appendRowToSection } from "../integrations/sync";

export interface SubmitContactRequest {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
}

export interface SubmitContactResponse {
  success: boolean;
  message: string;
}

// Submits a contact form and saves to DB and Google Sheets (Service Account).
export const submitContact = api<SubmitContactRequest, SubmitContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    // Save to database
    const row = await companyDB.queryRow<{ id: number }>`
      INSERT INTO contact_submissions (name, email, phone, service_type, message)
      VALUES (${req.name}, ${req.email}, ${req.phone}, ${req.serviceType}, ${req.message})
      RETURNING id
    `;

    // Save to Google Sheets (best-effort)
    try {
      await appendRowToSection("contact", {
        id: row!.id,
        name: req.name,
        email: req.email,
        phone: req.phone,
        serviceType: req.serviceType,
        message: req.message,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("appendRowToSection(contact) failed:", err);
      // Don't fail the request if Google Sheets fails
    }

    return {
      success: true,
      message: "Terima kasih! Pesan Anda telah diterima. Tim kami akan menghubungi Anda segera."
    };
  }
);
