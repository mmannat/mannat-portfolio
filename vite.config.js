import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    base: isProd ? "/mannat-portfolio/" : "/",
    plugins: [react()],
  };
});