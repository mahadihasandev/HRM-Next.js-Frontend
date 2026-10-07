export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

export function getStoredAuthToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const auth: unknown = JSON.parse(
      localStorage.getItem("my-app-auth") || "{}",
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
