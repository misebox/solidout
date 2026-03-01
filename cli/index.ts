#!/usr/bin/env node

import { init } from "./commands/init.js";
import { install } from "./commands/install.js";
import { list } from "./commands/list.js";

const args = process.argv.slice(2);
const command = args[0];
const cwd = process.cwd();

switch (command) {
  case "init":
    await init(cwd);
    break;
  case "install":
    await install(cwd);
    break;
  case "list": {
    const filter = args.includes("--installed")
      ? "installed" as const
      : args.includes("--not-installed")
      ? "not-installed" as const
      : "all" as const;
    list(cwd, filter);
    break;
  }
  default:
    console.log("solidout - SolidJS Opinionated UI");
    console.log("");
    console.log("Commands:");
    console.log("  init                  Create solidout.config.json and CSS");
    console.log("  install               Install components based on solidout.config.json");
    console.log("  list [--installed]     List available components");
    console.log("       [--not-installed]");
    console.log("");
    console.log("Usage:");
    console.log("  npx solidout init");
    console.log("  npx solidout install");
    console.log("  npx solidout list");
    break;
}
