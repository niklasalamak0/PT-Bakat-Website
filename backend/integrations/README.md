# Google Sheets + Drive Integration

This service integrates the existing backend with Google Sheets API v4 and Google Drive (using Service Account credentials) to provide:

- Two-way sync for five admin sections (services, portfolios, pricing, testimonials, contact).
- A sheetsService(section) with: `getData`, `appendRow`, `updateCell`, `deleteRow`.
- A versioning mechanism based on Google Drive's `modifiedTime` so the app can refresh when the sheet changes.
- An upload endpoint for Portfolio images that resizes to 320/640/1280, uploads to Google Drive with public sharing, deduplicates using SHA-256 hash, and returns public URLs.
- When Portfolio CRUD happens in the admin dashboard, the backend writes/updates those columns to the sheet.
- When columns `images`, `thumbnail`, `alt` change directly in the sheet, a sync method updates the internal DB.
- Orphan cleanup when deleting portfolios.

## Setup

1. Enable APIs in Google Cloud: "Google Sheets API" and "Google Drive API".
2. Create a Service Account, generate a JSON key.
3. In Leap Infrastructure secrets:
   - `GoogleServiceAccountJSON` = FULL JSON string for the Service Account.
   - `GoogleDrivePortfolioFolderId` = Folder ID for portfolio images. Configure folder to "Anyone with link".
4. Share each spreadsheet with the Service Account email (Editor).
5. Update `backend/integrations/config.ts` `sheetsMapping` with `{ spreadsheetId, sheetName, idColumn }` for each section.
6. Ensure each sheet has a header row. For portfolios include:
   ```
   id, title, description, category, images, thumbnail, alt, clientName, completionDate, location, updatedAt, updatedBy
   ```

## Using sheetsService(section)

```
import { sheetsService } from "../integrations/sheets_service";
const ss = await sheetsService("portfolios");
const { headers, rows, version } = await ss.getData();
await ss.appendRow({ id: "123", title: "New", ... });
await ss.updateCell("123", { title: "Updated", updatedAt: new Date().toISOString() });
await ss.deleteRow("123");
```

## Versioning

We use Drive file `modifiedTime` for the spreadsheet. On each append/update/delete we record the new version in `sheet_versions(section, sheet_modified, db_synced)`. The app can use this to determine when to refresh.

## Adding a new spreadsheet mapping

- Edit `backend/integrations/config.ts` and add/update the `sheetsMapping` entry.
- Ensure the sheet has a header row with required columns (including `id`).
- Share the spreadsheet with the Service Account email.
- Re-deploy.

## Syncing changes from Sheets

- Call `syncPortfoliosFromSheet()` to pull `images`, `thumbnail`, `alt` to DB when changed on the sheet. This uses `updatedAt` in the sheet to detect changes.
- Add similar sync routines for other sections as needed.

## Uploading images

- Call the endpoint `/admin/portfolio/upload` (see backend/company/upload_portfolio_image_google.ts) with base64 data (or use the existing base64-based uploader in the Admin Dashboard).
- The service validates MIME and size, generates multiple sizes, uploads to Drive with "anyone with link" permission, and returns URLs.
- Sheets `images` column should be a JSON array of URLs like `["https://.../orig.jpg","https://.../1280.jpg"]`.

## Deduplication and cleanup

- Deduplication uses SHA-256 hash of the original file. Filenames incorporate the hash.
- On delete, the service parses the Drive file IDs from the URLs and removes them.
