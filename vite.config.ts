import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./server/index"; // Added /index to be explicit

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: "0.0.0.0", // Changed from :: to ensure compatibility
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    emptyOutDir: true,
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      // Create the app instance once
      const app = await createServer();
      
      server.middlewares.use((req, res, next) => {
        // Use the app to handle the request
        app(req, res, next);
      });
    },
  };
}