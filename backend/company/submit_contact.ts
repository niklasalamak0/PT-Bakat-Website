import { api } from "encore.dev/api";
import { companyDB } from "./db";
import { secret } from "encore.dev/config";

const googleApiKey = secret("GoogleApiKey");

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

// Submits a contact form and saves to Google Sheets.
export const submitContact = api<SubmitContactRequest, SubmitContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    // Save to database
    await companyDB.exec`
      INSERT INTO contact_submissions (name, email, phone, service_type, message)
      VALUES (${req.name}, ${req.email}, ${req.phone}, ${req.serviceType}, ${req.message})
    `;

    // Save to Google Sheets
    try {
      const spreadsheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"; // Replace with your spreadsheet ID
      const range = "Sheet1!A:F";
      
      const values = [[
        new Date().toISOString(),
        req.name,
        req.email,
        req.phone,
        req.serviceType,
        req.message
      ]];

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&key=${googleApiKey()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: values,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to save to Google Sheets:", await response.text());
      }
    } catch (error) {
      console.error("Error saving to Google Sheets:", error);
      // Don't fail the request if Google Sheets fails
    }

    return {
      success: true,
      message: "Terima kasih! Pesan Anda telah diterima. Tim kami akan menghubungi Anda segera."
    };
  }
);
