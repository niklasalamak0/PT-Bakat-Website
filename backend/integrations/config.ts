import { secret } from "encore.dev/config";

// Google Service Account credentials JSON.
// TODO: Set this to the FULL JSON string for your Google Cloud Service Account with Sheets & Drive scopes.
// Create a Service Account in Google Cloud Console, enable Sheets API & Drive API, then create a JSON key.
// Paste the FULL JSON content as the secret value.
export const googleServiceAccountJSON = secret("GoogleServiceAccountJSON");

// Google Drive folder ID for Portfolio images.
// TODO: Create a folder in Google Drive to host portfolio images. Set folder sharing to "Anyone with the link" can view.
// Put the folder ID here (the part after /folders/ in the Drive URL).
export const googleDrivePortfolioFolderId = secret("GoogleDrivePortfolioFolderId");

// Section mapping to Google Sheets: spreadsheetId and sheetName.
// ALSO configure the "idColumn" header (must exist in the first header row of the sheet).
// NOTE: The sheets MUST have a header row with the specified columns. For portfolios include:
// id, title, description, category, images, thumbnail, alt, clientName, completionDate, location, updatedAt, updatedBy
export type AdminSection = "services" | "portfolios" | "pricing" | "testimonials" | "contact";

export interface SheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  idColumn: string;
}

export const sheetsMapping: Record<AdminSection, SheetsConfig> = {
  services: {
    spreadsheetId: "", // TODO: set spreadsheet id
    sheetName: "services", // TODO: set sheet name
    idColumn: "id",
  },
  portfolios: {
    spreadsheetId: "", // TODO: set spreadsheet id
    sheetName: "portfolios",
    idColumn: "id",
  },
  pricing: {
    spreadsheetId: "", // TODO: set spreadsheet id
    sheetName: "pricing",
    idColumn: "id",
  },
  testimonials: {
    spreadsheetId: "", // TODO: set spreadsheet id
    sheetName: "testimonials",
    idColumn: "id",
  },
  contact: {
    spreadsheetId: "", // TODO: set spreadsheet id
    sheetName: "contact",
    idColumn: "id",
  },
};

// Max upload size (bytes) for images. Default: 10 MB.
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

// Allowed MIME types for portfolio images.
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// Use an explicit union type to avoid indexed access types (unsupported by Encore parser).
export type AllowedImageMimeType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

// Target resize widths
export const RESIZE_WIDTHS = [320, 640, 1280];
