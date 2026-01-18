import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  optimizeDeps: {
    include: [
      // i18n packages (non-React dependencies only)
      'i18next',
      'i18next-browser-languagedetector',
      'i18next-http-backend',
      'html-parse-stringify',
      'void-elements'
    ],
    // Exclude ALL packages that use React hooks to prevent duplicate React instances
    exclude: [
      'zustand',
      'react-i18next',
      'react-router-dom',
      'react-router',
      '@tanstack/react-query'
    ],
    force: true, // Force cache rebuild - remove after fix is confirmed
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'react-i18next',
      '@tanstack/react-query'
    ],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Only alias React core - NOT router packages
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));
