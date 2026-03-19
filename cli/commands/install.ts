import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { Parser, type ReadEntry } from "tar";
import { CONFIG_FILENAME, loadConfig, PROJECT_NAME, RELEASE_URL } from "../config.js";
import { collectNpmDeps, registry, resolveDependencies } from "../registry.js";
import { rewriteImports } from "../rewrite-imports.js";

const ARCHIVE_PREFIX = "soluid/";

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

function detectInstallCommand(cwd: string): { lockfile: string | null; command: string[] } {
  const lockfiles: Record<string, string[]> = {
    "bun.lockb": ["bun", "add"],
    "bun.lock": ["bun", "add"],
    "pnpm-lock.yaml": ["pnpm", "add"],
    "yarn.lock": ["yarn", "add"],
    "package-lock.json": ["npm", "install"],
  };
  for (const [lockfile, command] of Object.entries(lockfiles)) {
    if (fs.existsSync(path.join(cwd, lockfile))) return { lockfile, command };
  }
  return { lockfile: null, command: ["npm", "install"] };
}

function checkRateLimit(res: Response): void {
  const remaining = res.headers.get("X-RateLimit-Remaining");
  if (remaining !== null && parseInt(remaining, 10) <= 5) {
    console.warn(`Warning: GitHub API rate limit low (${remaining} remaining)`);
  }
}

async function fetchAndExtract(version: string): Promise<Map<string, string>> {
  const url = `${RELEASE_URL}/components-v${version}/components.tar.gz`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch components: ${res.status} ${res.statusText}\n  URL: ${url}`);
  }

  checkRateLimit(res);

  const body = res.body;
  if (!body) throw new Error("Empty response body");

  const files = new Map<string, string>();
  const nodeStream = Readable.fromWeb(body as import("node:stream/web").ReadableStream);
  const gunzip = createGunzip();
  const parser = new Parser({
    onReadEntry(entry: ReadEntry) {
      if (entry.type === "File") {
        const chunks: Buffer[] = [];
        entry.on("data", (chunk: Buffer) => chunks.push(chunk));
        entry.on("end", () => {
          let filePath = entry.path;
          if (filePath.startsWith("./")) filePath = filePath.slice(2);
          files.set(filePath, Buffer.concat(chunks).toString("utf-8"));
        });
      } else {
        entry.resume();
      }
    },
  });

  await pipeline(nodeStream, gunzip, parser);

  return files;
}

/** Strip the "soluid/" prefix from an archive path for local placement. */
function stripPrefix(archivePath: string): string {
  if (archivePath.startsWith(ARCHIVE_PREFIX)) {
    return archivePath.slice(ARCHIVE_PREFIX.length);
  }
  return archivePath;
}

export async function install(cwd: string): Promise<void> {
  const config = loadConfig(cwd);
  if (config === null) {
    console.error(`${CONFIG_FILENAME} not found. Run: npx ${PROJECT_NAME} init\n`);
    process.exit(1);
    return;
  }

  if (config.components.length === 0) {
    console.error("No components specified in config.");
    process.exit(1);
    return;
  }

  const invalid = config.components.filter((name) => !registry[name]);
  if (invalid.length > 0) {
    console.error(`Unknown components: ${invalid.join(", ")}`);
    process.exit(1);
    return;
  }

  const resolved = resolveDependencies(["core", ...config.components]);
  const npmDeps = collectNpmDeps(resolved);

  console.log(`Installing ${resolved.length} items (including dependencies):`);

  const version = config.componentsVersion;
  let archive: Map<string, string>;
  try {
    archive = await fetchAndExtract(version);
  } catch (e) {
    console.error(`Failed to fetch components: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
    return;
  }

  const targetRoot = path.resolve(cwd, config.componentDir);

  let addedCount = 0;
  let updatedCount = 0;
  const cssChunks: string[] = [];
  const installedModules: string[] = [];

  for (const name of resolved) {
    const entry = registry[name];
    if (!entry) continue;

    let status: "added" | "updated" | "unchanged" = "unchanged";

    for (const file of entry.files) {
      const content = archive.get(file);
      if (content === undefined) {
        console.warn(`  SKIP (not in archive): ${file}`);
        continue;
      }

      const localPath = stripPrefix(file);

      // CSS files: accumulate for concatenation instead of writing individually
      if (file.endsWith(".css")) {
        cssChunks.push(`/* ${localPath} */\n${content}`);
        continue;
      }

      // TS/TSX files: strip prefix and write to componentDir
      const destPath = path.join(targetRoot, localPath);
      const destDir = path.dirname(destPath);

      let output = content;
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        output = rewriteImports(content, localPath);
        installedModules.push(localPath);
      }

      // Check if file already exists with same content
      const isNew = !fs.existsSync(destPath);
      if (!isNew) {
        const existing = fs.readFileSync(destPath, "utf-8");
        if (existing === output) continue;
      }

      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destPath, output, "utf-8");

      if (isNew) {
        status = "added";
        addedCount++;
      } else if (status !== "added") {
        status = "updated";
        updatedCount++;
      }
    }

    if (status === "added") {
      console.log(`  + ${name}`);
    } else if (status === "updated") {
      console.log(`  ~ ${name}`);
    }
  }

  // Generate barrel index.ts (core first, then components)
  const coreModules = installedModules.filter((p) => p.startsWith("core/"));
  const componentModules = installedModules.filter((p) => !p.startsWith("core/"));
  const indexLines = [
    "// Auto-generated by soluid CLI",
    ...[...coreModules, ...componentModules].map((p) => `export * from "./${p.replace(/\.tsx?$/, "")}"`),
    "",
  ];
  fs.writeFileSync(path.join(targetRoot, "index.ts"), indexLines.join("\n"), "utf-8");

  // Write concatenated CSS to cssPath
  if (cssChunks.length > 0) {
    const cssDestPath = path.resolve(cwd, config.cssPath);
    const cssContent = cssChunks.join("\n\n") + "\n";
    const cssUnchanged = fs.existsSync(cssDestPath) && fs.readFileSync(cssDestPath, "utf-8") === cssContent;
    if (!cssUnchanged) {
      const cssDestDir = path.dirname(cssDestPath);
      fs.mkdirSync(cssDestDir, { recursive: true });
      fs.writeFileSync(cssDestPath, cssContent, "utf-8");
      console.log(`\nCSS written to ${config.cssPath}`);
    }
  }

  if (addedCount === 0 && updatedCount === 0) {
    console.log("\nAll components are up to date.");
  } else {
    const parts: string[] = [];
    if (addedCount > 0) parts.push(`${addedCount} added`);
    if (updatedCount > 0) parts.push(`${updatedCount} updated`);
    console.log(`\n${parts.join(", ")} in ${config.componentDir}/`);
  }

  if (npmDeps.length > 0) {
    // Filter out packages already in package.json
    const pkgJsonPath = path.join(cwd, "package.json");
    let installedPkgs: Set<string> = new Set();
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
      const allDeps = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
      };
      installedPkgs = new Set(Object.keys(allDeps));
    }
    const missingDeps = npmDeps.filter((d) => !installedPkgs.has(d));

    if (missingDeps.length > 0) {
      const { lockfile, command } = detectInstallCommand(cwd);
      if (lockfile) {
        console.log(`\nFound ${lockfile}`);
      }
      const cmd = [...command, ...missingDeps].join(" ");
      console.log(`Required packages: ${missingDeps.join(", ")}`);
      const ok = await confirm(`Run \`${cmd}\`? [y/N] `);
      if (ok) {
        execSync(cmd, { stdio: "inherit", cwd });
      } else {
        console.log(`  ${cmd}`);
      }
    }
  }

  console.log("\nDone. Components are now in your project — edit freely.");
}
