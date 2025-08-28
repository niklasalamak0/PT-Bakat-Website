import { sheetsService } from "./sheets_service";
import { AdminSection } from "./config";
import { companyDB } from "../company/db";
import { APIError } from "encore.dev/api";

// Migrations create this table to track sheet versions.
export async function updateSectionVersion(section: AdminSection, sheetModified: Date): Promise<void> {
  await companyDB.exec`
    INSERT INTO sheet_versions (section, sheet_modified, db_synced)
    VALUES (${section}, ${sheetModified}, NOW())
    ON CONFLICT (section)
    DO UPDATE SET sheet_modified = ${sheetModified}, db_synced = NOW()
  `;
}

// Sync portfolios from Google Sheet to DB when images/thumbnail/alt updated in the sheet.
// Compares updatedAt (sheet) with DB.updated_at; updates DB if sheet is newer.
export async function syncPortfoliosFromSheet(): Promise<{ updated: number }> {
  const sheets = await sheetsService("portfolios");
  const data = await sheets.getData();
  let updated = 0;

  for (const row of data.rows) {
    const id = Number(row["id"]);
    if (!id) continue;

    // Parse times
    const sheetUpdatedAt = row["updatedAt"] ? new Date(row["updatedAt"]) : null;

    const dbRow = await companyDB.queryRow<{
      id: number;
      updated_at: Date | null;
    }>`SELECT id, updated_at FROM portfolios WHERE id = ${id}`;

    if (!dbRow) continue;

    const dbUpdatedAt = dbRow.updated_at ? new Date(dbRow.updated_at) : null;

    // If sheetUpdatedAt > dbUpdatedAt then apply to DB.
    if (sheetUpdatedAt && (!dbUpdatedAt || sheetUpdatedAt.getTime() > dbUpdatedAt.getTime())) {
      const imagesStr = String(row["images"] ?? "[]");
      let imagesJson: string = "[]";
      try {
        const parsed = JSON.parse(imagesStr);
        if (Array.isArray(parsed)) {
          imagesJson = JSON.stringify(parsed);
        }
      } catch {
        // ignore malformed
      }
      const thumbnail = String(row["thumbnail"] ?? "");
      const alt = String(row["alt"] ?? "");
      await companyDB.exec`
        UPDATE portfolios
        SET images = ${imagesJson},
            thumbnail = ${thumbnail},
            alt = ${alt},
            updated_at = ${sheetUpdatedAt}
        WHERE id = ${id}
      `;
      updated++;
    }
  }

  // Update section version
  await updateSectionVersion("portfolios", data.version);
  return { updated };
}

// Generic helper: append row to sheet for a given section.
export async function appendRowToSection(section: AdminSection, row: Record<string, any>) {
  const sheets = await sheetsService(section);
  await sheets.appendRow(row);
  const v = await sheets.getVersion();
  await updateSectionVersion(section, v.version);
}

// Generic helper: update row in sheet by id
export async function updateRowInSection(section: AdminSection, id: number | string, updates: Record<string, any>) {
  const sheets = await sheetsService(section);
  await sheets.updateCell(id, updates);
  const v = await sheets.getVersion();
  await updateSectionVersion(section, v.version);
}

// Generic helper: delete row in sheet by id
export async function deleteRowInSection(section: AdminSection, id: number | string) {
  const sheets = await sheetsService(section);
  await sheets.deleteRow(id);
  const v = await sheets.getVersion();
  await updateSectionVersion(section, v.version);
}
