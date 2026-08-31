// config.js
export const serverUrl =
  import.meta.env.VITE_BACKEND_URL || "https://cabo-sport.onrender.com";

export const config = {
  baseUrl: serverUrl,
};
