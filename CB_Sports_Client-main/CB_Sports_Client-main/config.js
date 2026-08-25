// config.js
export const serverUrl =
  import.meta.env.VITE_BACKEND_URL || "https://hl-sports-server.onrender.com";

export const config = {
  baseUrl: serverUrl,
};
