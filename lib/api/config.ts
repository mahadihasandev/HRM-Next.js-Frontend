import { readAuthSession } from "./authStorage";
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://hrm-php-backend-indol.vercel.app/api/v1"
).replace(/\/$/, "");

export function getStoredAuthToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const auth: unknown = JSON.parse(
      readAuthSession() || "{}",
    );
    return auth &&
      typeof auth === "object" &&
      "token" in auth &&
      typeof auth.token === "string"
      ? auth.token
      : "";
  } catch {
    return "";
  }
}
