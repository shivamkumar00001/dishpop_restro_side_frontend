import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ use the plugin you imported
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://dishpop-restro-side-backend.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
