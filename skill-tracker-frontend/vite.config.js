import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
    allowedHosts: [
      "c774f6ce8094.ngrok-free.app", // 👈 add your ngrok host here
    ],
  },
  plugins: [tailwindcss()],
});
