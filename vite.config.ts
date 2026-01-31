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
      // Force single React instance - core
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      // All React-dependent packages must be pre-bundled together
      'react-i18next',
      'react-router-dom',
      'react-router',
      '@tanstack/react-query',
      'zustand',
      // i18n internals
      'i18next',
      'i18next-browser-languagedetector',
      'i18next-http-backend',
      'html-parse-stringify',
      'void-elements',
    ],
    force: true,
    esbuildOptions: {
      // Force consistent JSX handling
      jsx: 'automatic',
    },
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'react-i18next',
      'i18next',
      '@tanstack/react-query',
      'zustand',
    ],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force absolute paths for React to prevent duplicate instances
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-dom/client': path.resolve(__dirname, 'node_modules/react-dom/client'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime'),
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));
