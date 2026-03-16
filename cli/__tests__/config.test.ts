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
      cssPath: "src/styles/soluid.css",
      components: ["Button", "TextField"],
    };

    saveConfig(tmpDir, config);

    const configPath = path.join(tmpDir, CONFIG_FILENAME);
    expect(fs.existsSync(configPath)).toBe(true);

    const loaded = loadConfig(tmpDir);
    expect(loaded).toEqual(config);
  });
});
