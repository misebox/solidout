import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { CONFIG_FILENAME, loadConfig, saveConfig } from "../config.js";
import type { SoluidConfig } from "../config.js";

describe("config", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "soluid-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test("loadConfig returns null when file does not exist", () => {
    expect(loadConfig(tmpDir)).toBeNull();
  });

  test("saveConfig and loadConfig roundtrip", () => {
    const config: SoluidConfig = {
      componentsVersion: "0.1.0",
      componentDir: "src/components/ui",
      cssPath: "src/soluid.css",
      components: ["Button", "TextField"],
    };

    saveConfig(tmpDir, config);

    const configPath = path.join(tmpDir, CONFIG_FILENAME);
    expect(fs.existsSync(configPath)).toBe(true);

    const loaded = loadConfig(tmpDir);
    expect(loaded).toEqual(config);
  });

  test("loadConfig handles missing componentsVersion", () => {
    const configPath = path.join(tmpDir, CONFIG_FILENAME);
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        componentDir: "src/components/ui",
        cssPath: "src/soluid.css",
        components: ["Button"],
      }) + "\n",
    );

    const loaded = loadConfig(tmpDir);
    expect(loaded).not.toBeNull();
    expect(loaded?.componentsVersion).toBeUndefined();
    expect(loaded?.components).toEqual(["Button"]);
  });

  test("saveConfig persists updated componentsVersion", () => {
    const config: SoluidConfig = {
      componentDir: "src/components/ui",
      cssPath: "src/soluid.css",
      components: ["Button"],
    };

    saveConfig(tmpDir, config);
    expect(loadConfig(tmpDir)?.componentsVersion).toBeUndefined();

    config.componentsVersion = "0.2.0";
    saveConfig(tmpDir, config);
    expect(loadConfig(tmpDir)?.componentsVersion).toBe("0.2.0");
  });
});
