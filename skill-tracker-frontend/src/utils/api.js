// skill-tracker-frontend/src/utils/api.js
import axios from "axios";
import { auth } from "../firebase/firebaseClient";

// Prefer VITE_BACKEND_URL, but accept VITE_API_URL as a fallback for compatibility
const envBackendUrl =
  import.meta.env?.VITE_BACKEND_URL ?? import.meta.env?.VITE_API_URL ?? "";
const backendUrl =
  envBackendUrl && String(envBackendUrl).trim()
    ? String(envBackendUrl).replace(/\/$/, "")
    : "";

// If no explicit backend URL, and we're on Vite dev server, default to local backend
const isViteDev =
  typeof window !== "undefined" && window.location?.port === "5173";
const baseURL = backendUrl
  ? `${backendUrl}/api`
  : isViteDev
  ? "http://localhost:5000/api"
  : "/api";

const API = axios.create({
  baseURL,
});

API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
