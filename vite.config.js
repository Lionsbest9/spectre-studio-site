import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// BASE_PATH is set by the GitHub Pages workflow (e.g. /portfolio/).
// With a custom domain, leave it unset so the site is served from "/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        work: resolve(import.meta.dirname, "work.html"),
        services: resolve(import.meta.dirname, "services.html"),
        about: resolve(import.meta.dirname, "about.html"),
      },
    },
  },
});
