import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    command === "serve" ? expressPlugin() : null, // ✅ ONLY run in dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      // ✅ Import ONLY during dev, not build
      const { createServer } = await import("./server/index.ts");

      const app = createServer();
      server.middlewares.use(app);
    },
  };
}