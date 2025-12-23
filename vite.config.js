import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Buscaminas-React/",
  server: {
    watch: {
      usePolling: true,
    },
  },
});
