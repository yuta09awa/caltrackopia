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
      // Core i18n packages
      'i18next',
      'i18next-browser-languagedetector',
      'i18next-http-backend',
      'html-parse-stringify',
      'void-elements',
      // Include React-dependent packages to ensure single instance
      'react-i18next',
      'react-router-dom',
      'react-router',
      '@tanstack/react-query',
      'zustand'
    ],
    force: true,
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'react-i18next',
      '@tanstack/react-query',
      'zustand'
    ],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force single React instance for all packages
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));
