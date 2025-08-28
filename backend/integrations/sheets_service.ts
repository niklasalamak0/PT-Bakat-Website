import { google } from "googleapis";
import { getGoogleAuthClient } from "./google_auth";
import { AdminSection, sheetsMapping } from "./config";

export interface SheetRowObject {
  [key: string]: any;
}

export interface GetDataResult {
  headers: string[];
  rows: SheetRowObject[];
  version: Date; // Drive file modified time
}

// Convert array row to object by headers.
function rowToObj(headers: string[], row: any[]): SheetRowObject {
  const obj: SheetRowObject = {};
  for (let i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i] ?? "";
  }
  return obj;
}

// Convert object to array of values aligned with headers.
function objToRow(headers: string[], obj: SheetRowObject): any[] {
  return headers.map((h) => obj[h] ?? "");
}

export async function sheetsService(section: AdminSection) {
  const auth = await getGoogleAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  const cfg = sheetsMapping[section];
  if (!cfg.spreadsheetId || !cfg.sheetName) {
    throw new Error(`Sheets mapping not configured for section '${section}'.`);
  }

  async function getVersion(): Promise<Date> {
    const file = await drive.files.get({
      fileId: cfg.spreadsheetId,
      fields: "modifiedTime",
      supportsAllDrives: true,
    });
    const mt = file.data.modifiedTime;
    return mt ? new Date(mt) : new Date();
  }

  async function getData(): Promise<GetDataResult> {
    // Read header and data
    const headerResp = await sheets.spreadsheets.values.get({
      spreadsheetId: cfg.spreadsheetId,
      range: `${cfg.sheetName}!1:1`,
      majorDimension: "ROWS",
    });
    const headers = (headerResp.data.values?.[0] ?? []).map((v) => String(v));

    const dataResp = await sheets.spreadsheets.values.get({
      spreadsheetId: cfg.spreadsheetId,
      range: `${cfg.sheetName}!2:1000000`,
      majorDimension: "ROWS",
    });
    const values = dataResp.data.values ?? [];
    const rows = values.map((r) => rowToObj(headers, r));

    const version = await getVersion();
    return { headers, rows, version };
  }

  async function appendRow(obj: SheetRowObject): Promise<void> {
    const { headers } = await getData();
    const row = objToRow(headers, obj);
    await sheets.spreadsheets.values.append({
      spreadsheetId: cfg.spreadsheetId,
      range: cfg.sheetName,
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });
  }

  async function findRowIndexById(id: string | number): Promise<{ rowIndex: number; headers: string[] } | null> {
    const { headers, rows } = await getData();
    const idCol = cfg.idColumn;
    // Row 2 is index 2 (1-based in Sheets), loop over rows array (0-based) to find match
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (String(row[idCol]) === String(id)) {
        return { rowIndex: i + 2, headers };
      }
    }
    return null;
  }

  async function updateCell(id: string | number, updates: SheetRowObject): Promise<void> {
    const found = await findRowIndexById(id);
    if (!found) {
      throw new Error(`Row with ${cfg.idColumn}=${id} not found in sheet ${cfg.sheetName}.`);
    }
    const { rowIndex, headers } = found;
    const currentRange = `${cfg.sheetName}!${rowIndex}:${rowIndex}`;
    const rowResp = await sheets.spreadsheets.values.get({
      spreadsheetId: cfg.spreadsheetId,
      range: currentRange,
      majorDimension: "ROWS",
    });
    const current = rowResp.data.values?.[0] ?? [];
    const currentObj = rowToObj(headers, current);
    const merged = { ...currentObj, ...updates };
    const row = objToRow(headers, merged);
    await sheets.spreadsheets.values.update({
      spreadsheetId: cfg.spreadsheetId,
      range: currentRange,
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });
  }

  async function deleteRow(id: string | number): Promise<void> {
    const found = await findRowIndexById(id);
    if (!found) {
      // No-op if not found
      return;
    }
    const { rowIndex } = found;
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: cfg.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await getSheetIdByName(cfg.spreadsheetId, cfg.sheetName),
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
  }

  async function getSheetIdByName(spreadsheetId: string, sheetName: string): Promise<number> {
    const doc = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = doc.data.sheets?.find((s) => s.properties?.title === sheetName);
    if (!sheet?.properties?.sheetId) {
      throw new Error(`Sheet name ${sheetName} not found in spreadsheet ${spreadsheetId}.`);
    }
    return sheet.properties.sheetId;
  }

  return {
    getData,
    appendRow,
    updateCell,
    deleteRow,
    getVersion,
  };
}
