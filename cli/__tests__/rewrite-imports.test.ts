import { describe, expect, test } from "vitest";
import { rewriteImports } from "../rewrite-imports";

describe("rewriteImports", () => {
  test("keeps same-dir imports unchanged", () => {
    const input = `import { Button } from "./Button";`;
    const result = rewriteImports(input, "Button.tsx");
    expect(result).toBe(`import { Button } from "./Button";`);
  });

  test("rewrites core imports for top-level component", () => {
    const input = `import type { Size } from "./core/types";`;
    const result = rewriteImports(input, "Button.tsx");
    expect(result).toBe(`import type { Size } from "./core/types";`);
  });

  test("rewrites parent-dir imports for core files", () => {
    const input = `import { something } from "../Button";`;
    const result = rewriteImports(input, "core/utils.ts");
    expect(result).toBe(`import { something } from "../Button";`);
  });

  test("handles export from statements", () => {
    const input = `export { Button } from "./Button";`;
    const result = rewriteImports(input, "index.ts");
    expect(result).toBe(`export { Button } from "./Button";`);
  });
});
