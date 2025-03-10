import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: ".",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/aktools": {
        target: "https://aktools.550w.xyz/api/public", // 第三方 API 基础 URL
        changeOrigin: true, // 必须设置为 true
        rewrite: (path) => path.replace(/^\/aktools/, ""), // 可选：重写路径
        secure: false, // 如果是 https 且有证书问题，设为 false
      },
    },
  },
});
