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
      // React core - ensure single bundled version
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      '@tanstack/react-query',
      // i18n packages and their CJS dependencies
      'i18next',
      'react-i18next',
      'i18next-browser-languagedetector',
      'i18next-http-backend',
      'html-parse-stringify',
      'void-elements'
    ],
    exclude: ['zustand'],
    force: true,
  },
  resolve: {
    // Ensure single instance of React and React Router to fix useContext errors
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
}));
