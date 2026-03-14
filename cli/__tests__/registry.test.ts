import { describe, expect, test } from "vitest";
import { allComponentNames, collectNpmDeps, registry, resolveDependencies } from "../registry";

describe("registry", () => {
  test("all entries have required fields", () => {
    for (const [key, entry] of Object.entries(registry)) {
      expect(entry.name).toBe(key);
      expect(entry.files.length).toBeGreaterThan(0);
      expect(entry.description).toBeTruthy();
    }
  });

  test("core is always included in resolved dependencies", () => {
    const resolved = resolveDependencies(["Button"]);
    expect(resolved[0]).toBe("core");
  });

  test("resolves transitive dependencies", () => {
    const resolved = resolveDependencies(["TextField"]);
    expect(resolved).toContain("core");
    expect(resolved).toContain("FormField");
    expect(resolved).toContain("TextField");
  });

  test("deduplicates dependencies", () => {
    const resolved = resolveDependencies(["TextField", "TextArea"]);
    const counts = resolved.reduce((acc, name) => {
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    for (const count of Object.values(counts)) {
      expect(count).toBe(1);
    }
  });

  test("collects npm dependencies", () => {
    const deps = collectNpmDeps(["core"]);
    expect(deps).toContain("@solid-primitives/active-element");
  });

  test("allComponentNames excludes core", () => {
    const names = allComponentNames();
    expect(names).not.toContain("core");
    expect(names.length).toBeGreaterThan(0);
  });
});
