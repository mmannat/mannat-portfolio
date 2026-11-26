/** Production: set in `.env.production`. Local dev: `.env` → http://localhost:3001 */
export const API_BASE = String(
  import.meta.env.VITE_API_BASE || "http://localhost:3001"
).replace(/\/$/, "");
