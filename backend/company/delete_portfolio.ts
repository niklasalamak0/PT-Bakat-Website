import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { companyDB } from "./db";
import { deleteRowInSection } from "../integrations/sync";
import { deleteDriveFilesByUrls } from "../integrations/drive_service";

export interface DeletePortfolioRequest {
  id: number;
}

export interface DeletePortfolioResponse {
  success: boolean;
}

// Deletes a portfolio item.
export const deletePortfolio = api<DeletePortfolioRequest, DeletePortfolioResponse>(
  { expose: true, method: "DELETE", path: "/portfolios/:id", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    // Fetch image URLs to cleanup from Drive.
    const row = await companyDB.queryRow<{ images: string | null }>`
      SELECT images FROM portfolios WHERE id = ${req.id}
    `;
    let urls: string[] = [];
    try {
      const arr = row?.images ? JSON.parse(row.images) : [];
      if (Array.isArray(arr)) urls = arr;
    } catch {
      // ignore
    }

    await companyDB.exec`DELETE FROM portfolios WHERE id = ${req.id}`;

    // Best-effort cleanup from Drive
    try {
      if (urls.length > 0) {
        await deleteDriveFilesByUrls(urls);
      }
    } catch (err) {
      console.error("deleteDriveFilesByUrls failed:", err);
    }

    // Best-effort: delete from Sheet
    try {
      await deleteRowInSection("portfolios", req.id);
    } catch (err) {
      console.error("deleteRowInSection(portfolios) failed:", err);
    }
    return { success: true };
  }
);
