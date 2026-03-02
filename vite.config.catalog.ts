import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  base: "/soluid/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
