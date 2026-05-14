import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  base: "/mannat-portfolio/",
  server: {
    port: 5173,
    strictPort: true,
    host: "127.0.0.1",
    headers: {
      "Cache-Control": "no-store",
    },
  },
});