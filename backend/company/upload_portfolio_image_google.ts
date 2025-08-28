import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AllowedImageMimeType, MAX_IMAGE_SIZE_BYTES } from "../integrations/config";
import { uploadImageVariants, validateImage } from "../integrations/drive_service";

export interface UploadPortfolioImageRequest {
  fileName: string;
  fileData: string; // base64 encoded data URL or raw base64
  contentType: AllowedImageMimeType;
  alt?: string;
}

export interface UploadPortfolioImageResponse {
  success: boolean;
  imageUrls: string[];
  thumbnail: string;
  alt: string;
}

// Uploads an image to Google Drive (public) and returns URLs (orig + resized).
export const uploadPortfolioImage = api<UploadPortfolioImageRequest, UploadPortfolioImageResponse>(
  { expose: true, method: "POST", path: "/admin/portfolio/upload", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new APIError("permissionDenied", "Insufficient permissions");
    }

    try {
      const base64 = extractBase64(req.fileData);
      const buffer = Buffer.from(base64, "base64");
      validateImage(req.contentType, buffer.length, MAX_IMAGE_SIZE_BYTES);

      const result = await uploadImageVariants({
        fileName: req.fileName,
        contentType: req.contentType,
        buffer,
        makePublic: true,
      });

      const alt = req.alt ?? req.fileName;
      const imageUrls = result.allUrls;
      // Pick 320 or 640 as thumbnail if available
      const thumb = result.resized.find((r) => r.width === 320)?.url
        ?? result.resized.find((r) => r.width === 640)?.url
        ?? result.original.url;

      return {
        success: true,
        imageUrls,
        thumbnail: thumb,
        alt,
      };
    } catch (err: any) {
      console.error("uploadPortfolioImage error:", err);
      throw new APIError("invalidArgument", `Upload failed: ${err?.message ?? "unknown error"}`);
    }
  }
);

function extractBase64(data: string): string {
  // Accept data URL or raw base64
  const m = data.match(/^data:[a-zA-Z0-9/+.-]+;base64,(.*)$/);
  if (m) return m[1];
  return data;
}
