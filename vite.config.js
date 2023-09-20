import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    cssMinify: "lightningcss",
    cssTarget: "chrome61",
    minify: "terser",
    terserOptions: {
      keep_fnames: false,
      toplevel: true,
    },
  },
});
