// skill-tracker-frontend/src/utils/api.js
import axios from "axios";
import { auth } from "../firebase/firebaseClient";

const rawBackendUrl = import.meta.env?.VITE_BACKEND_URL ?? "";
const backendUrl =
  rawBackendUrl && String(rawBackendUrl).trim()
    ? String(rawBackendUrl).replace(/\/$/, "")
    : "";
const baseURL = backendUrl ? `${backendUrl}/api` : "/api";

const API = axios.create({
  baseURL,
  // use env variable for productions
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
