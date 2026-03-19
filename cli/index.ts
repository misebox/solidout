#!/usr/bin/env node

import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { install } from "./commands/install.js";
import { list } from "./commands/list.js";
import { remove } from "./commands/remove.js";
import { update } from "./commands/update.js";
import { CONFIG_FILENAME, PROJECT_NAME } from "./config.js";

const args = process.argv.slice(2);
const command = args[0];
const rest = args.slice(1);
const cwd = process.cwd();

switch (command) {
  case "init":
    await init(cwd, { interactive: !args.includes("--no-interactive") });
    break;
  case "install":
    await install(cwd);
    break;
  case "add":
    if (rest.length === 0) {
      console.error(`Usage: npx ${PROJECT_NAME} add <component...>`);
      process.exit(1);
    }
    add(cwd, rest);
    break;
  case "remove":
    if (rest.length === 0) {
      console.error(`Usage: npx ${PROJECT_NAME} remove <component...>`);
      process.exit(1);
    }
    remove(cwd, rest);
    break;
  case "update":
    await update(cwd);
    break;
  case "list": {
    const filter = args.includes("--installed")
      ? ("installed" as const)
      : args.includes("--not-installed")
        ? ("not-installed" as const)
        : ("all" as const);
    list(cwd, filter);
    break;
  }
  default:
    console.log(`${PROJECT_NAME} - CLI that installs SolidJS UI components into your project`);
    console.log("");
    console.log("Commands:");
    console.log(`  init [--no-interactive]  Create ${CONFIG_FILENAME}`);
    console.log("  install                 Install components and CSS");
    console.log("  update                  Update to latest components version");
    console.log("  add <component...>      Add components to config");
    console.log("  remove <component...>   Remove components from config");
    console.log("  list [--installed]       List available components");
    console.log("       [--not-installed]");
    break;
}
