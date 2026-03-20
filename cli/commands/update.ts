import { CONFIG_FILENAME, fetchLatestComponentsVersion, loadConfig, PROJECT_NAME, saveConfig } from "../config.js";
import { install } from "./install.js";

interface UpdateOptions {
  interactive?: boolean;
}

export async function update(cwd: string, options: UpdateOptions = {}): Promise<void> {
  const config = loadConfig(cwd);
  if (config === null) {
    console.error(`${CONFIG_FILENAME} not found. Run: npx ${PROJECT_NAME} init`);
    process.exit(1);
    return;
  }

  const currentVersion = config.componentsVersion ?? "(not set)";
  console.log(`Current version: ${currentVersion}`);
  console.log("Checking for updates...");

  let latestVersion: string;
  try {
    latestVersion = await fetchLatestComponentsVersion();
  } catch (e) {
    console.error(`Failed to fetch version: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
    return;
  }

  if (currentVersion === latestVersion) {
    console.log(`Already up to date (${currentVersion}).`);
    return;
  }

  console.log(`Updating: ${currentVersion} -> ${latestVersion}`);
  config.componentsVersion = latestVersion;
  saveConfig(cwd, config);

  await install(cwd, { interactive: options.interactive });
}
