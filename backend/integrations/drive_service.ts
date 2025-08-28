import { google } from "googleapis";
import { getGoogleAuthClient } from "./google_auth";
import { createHash } from "crypto";
import sharp from "sharp";
import { googleDrivePortfolioFolderId, RESIZE_WIDTHS, AllowedImageMimeType, ALLOWED_IMAGE_MIME_TYPES } from "./config";

export interface UploadedVariant {
  name: string;
  fileId: string;
  url: string;
  width?: number;
}

export interface UploadResult {
  original: UploadedVariant;
  resized: UploadedVariant[];
  allUrls: string[];
}

export interface UploadImageOptions {
  fileName: string;
  contentType: AllowedImageMimeType;
  buffer: Buffer;
  folderId?: string;
  makePublic?: boolean;
}

// Validate MIME type and size
export function validateImage(contentType: string, sizeBytes: number, maxSize: number) {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(contentType as AllowedImageMimeType)) {
    throw new Error(`Unsupported image type: ${contentType}. Allowed: ${ALLOWED_IMAGE_MIME_TYPES.join(", ")}`);
  }
  if (sizeBytes <= 0 || sizeBytes > maxSize) {
    throw new Error(`Image too large. Max ${Math.round(maxSize / 1024 / 1024)} MB`);
  }
}

function publicDriveUrl(fileId: string): string {
  // The uc URL serves file content directly
  return `https://drive.google.com/uc?id=${fileId}`;
}

function sanitizeName(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_");
}

async function ensurePublicPermission(drive: any, fileId: string) {
  // Create "anyone with link" permission
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });
}

export async function uploadImageVariants(opts: UploadImageOptions): Promise<UploadResult> {
  const auth = await getGoogleAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const folderId = opts.folderId || googleDrivePortfolioFolderId();
  if (!folderId) {
    throw new Error("GoogleDrivePortfolioFolderId secret is not configured.");
  }

  // Compute hash for deduplication
  const hash = createHash("sha256").update(opts.buffer).digest("hex");
  const baseName = sanitizeName(opts.fileName);
  const ts = Date.now();

  // Helper to search for existing file by name
  async function findByName(name: string): Promise<string | null> {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and name = '${name}' and trashed = false`,
      fields: "files(id, name)",
      spaces: "drive",
    });
    const f = res.data.files?.[0];
    return f?.id ?? null;
  }

  async function uploadOne(name: string, buffer: Buffer, contentType: string): Promise<UploadedVariant> {
    const existing = await findByName(name);
    let fileId: string;
    if (existing) {
      fileId = existing;
    } else {
      const createRes = await drive.files.create({
        requestBody: {
          name,
          parents: [folderId],
        },
        media: {
          mimeType: contentType,
          body: Buffer.isBuffer(buffer) ? bufferToStream(buffer) : buffer,
        },
        fields: "id",
      });
      fileId = createRes.data.id!;
      await ensurePublicPermission(drive, fileId);
    }
    return { name, fileId, url: publicDriveUrl(fileId) };
  }

  // Upload original
  const origName = `${hash}_${ts}_${baseName}`;
  const original = await uploadOne(origName, opts.buffer, opts.contentType);

  // Upload resized
  const resized: UploadedVariant[] = [];
  for (const width of RESIZE_WIDTHS) {
    const resizedBuffer = await sharp(opts.buffer).resize({ width, withoutEnlargement: true }).toBuffer();
    const ext = extFromMime(opts.contentType) || "jpg";
    const resizedName = `${hash}_${width}.${ext}`;
    const v = await uploadOne(resizedName, resizedBuffer, opts.contentType);
    v.width = width;
    resized.push(v);
  }

  const allUrls = [original.url, ...resized.map((r) => r.url)];
  return { original, resized, allUrls };
}

export async function deleteDriveFilesByUrls(urls: string[]): Promise<void> {
  const auth = await getGoogleAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const fileIds: string[] = [];
  for (const url of urls) {
    const id = extractDriveFileId(url);
    if (id) fileIds.push(id);
  }
  for (const id of fileIds) {
    try {
      await drive.files.delete({ fileId: id });
    } catch {
      // ignore
    }
  }
}

function extFromMime(m: string): string | null {
  if (m.endsWith("/jpeg")) return "jpg";
  if (m.endsWith("/png")) return "png";
  if (m.endsWith("/webp")) return "webp";
  if (m.endsWith("/gif")) return "gif";
  return null;
}

function bufferToStream(buffer: Buffer) {
  const { Readable } = require("stream");
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export function extractDriveFileId(url: string): string | null {
  // Expect uc?id=FILE_ID
  try {
    const u = new URL(url);
    const id = u.searchParams.get("id");
    return id;
  } catch {
    return null;
  }
}
