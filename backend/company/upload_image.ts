import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { Bucket } from "encore.dev/storage/objects";

const portfolioBucket = new Bucket("portfolio-images", {
  public: true,
});

export interface UploadImageRequest {
  fileName: string;
  fileData: string; // base64 encoded image data
  contentType: string;
}

export interface UploadImageResponse {
  imageUrl: string;
  success: boolean;
}

// Uploads an image to object storage and returns the public URL.
export const uploadImage = api<UploadImageRequest, UploadImageResponse>(
  { expose: true, method: "POST", path: "/upload-image", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    // Convert base64 to buffer
    const base64Data = req.fileData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${req.fileName}`;

    // Upload to bucket
    await portfolioBucket.upload(fileName, buffer, {
      contentType: req.contentType,
    });

    // Get public URL
    const imageUrl = portfolioBucket.publicUrl(fileName);

    return {
      imageUrl,
      success: true,
    };
  }
);
