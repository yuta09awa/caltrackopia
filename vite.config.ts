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
      // i18n packages and their CJS dependencies
      'i18next',
      'react-i18next',
      'i18next-browser-languagedetector',
      'i18next-http-backend',
      'html-parse-stringify',
      'void-elements'
    ],
    exclude: ['zustand'],
    force: true, // Force cache rebuild to apply new aliases
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force all React imports to use the same instance from node_modules
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      'react-router': path.resolve(__dirname, 'node_modules/react-router'),
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));
