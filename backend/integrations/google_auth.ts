import { google } from "googleapis";
import { googleServiceAccountJSON } from "./config";

// Create a Google Auth client using Service Account credentials.
export async function getGoogleAuthClient() {
  const jsonStr = googleServiceAccountJSON();
  if (!jsonStr) {
    throw new Error("GoogleServiceAccountJSON secret is not configured.");
  }
  let creds: any;
  try {
    creds = JSON.parse(jsonStr);
  } catch {
    throw new Error("GoogleServiceAccountJSON secret is not valid JSON.");
  }
  const scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
  ];
  const jwt = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes,
  });
  await jwt.authorize();
  return jwt;
}
