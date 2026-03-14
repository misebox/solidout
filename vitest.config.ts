import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["cli/__tests__/**/*.test.ts"],
  },
});
