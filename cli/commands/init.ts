import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import {
  CONFIG_FILENAME,
  DEFAULT_CSS_FILENAME,
  fetchLatestComponentsVersion,
  findConfigPath,
  PROJECT_NAME,
  saveConfig,
} from "../config.js";
import type { SoluidConfig } from "../config.js";
import { allComponentNames } from "../registry.js";

function prompt(question: string, defaultValue: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} (${defaultValue}) `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

interface InitOptions {
  interactive?: boolean;
}

export async function init(cwd: string, options: InitOptions = {}): Promise<void> {
  const interactive = options.interactive !== false;
  const configPath = findConfigPath(cwd);

  if (fs.existsSync(configPath)) {
    console.error(`${CONFIG_FILENAME} already exists. Delete it first to re-initialize.`);
    process.exit(1);
    return;
  }

  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath) && interactive) {
    const ok = await confirm("package.json not found. Continue anyway? (y/n) ");
    if (!ok) {
      console.log("Aborted.");
      return;
    }
  }

  console.log("Fetching latest components version...");
  let componentsVersion: string;
  try {
    componentsVersion = await fetchLatestComponentsVersion();
  } catch (e) {
    console.error(`Failed to fetch version: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
    return;
  }

  const componentDir = interactive
    ? await prompt("Component directory?", "src/components/ui")
    : "src/components/ui";
  const cssPath = interactive
    ? await prompt("CSS path?", `src/styles/${DEFAULT_CSS_FILENAME}`)
    : `src/styles/${DEFAULT_CSS_FILENAME}`;

  const allNames = allComponentNames();

  const config: SoluidConfig = {
    componentsVersion,
    componentDir,
    cssPath,
    components: allNames,
  };

  saveConfig(cwd, config);

  console.log(`\nCreated ${CONFIG_FILENAME} (components v${componentsVersion}, ${allNames.length} components)`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Run: npx ${PROJECT_NAME} install`);
  console.log("  2. Import CSS in your entry point:");
  console.log(`     import "./${cssPath.replace(/^src\//, "")}";`);
}
