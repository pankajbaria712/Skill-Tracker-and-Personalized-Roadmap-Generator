// skill-tracker-frontend/src/utils/api.js
import axios from "axios";
import { auth } from "../firebase/firebaseClient";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "") + "/api",
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
