import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const allowedRootHtml = new Set([
  "index.html",
  "viewer.html",
  "scene.html",
  "compose.html",
  "aztec-slide-rule.html",
  "quartet-reconciliation-demo.html",
]);

const allowedSrcEntries = new Set([
  "core",
  "polyform",
  "carriers",
  "semantic",
  "projection",
  "ui",
  "index.ts",
]);

const rootEntries = readdirSync(".");
const badRootHtml = rootEntries.filter((name) => name.endsWith(".html") && !allowedRootHtml.has(name));
if (badRootHtml.length > 0) {
  console.error("Unexpected root HTML files:", badRootHtml.join(", "));
  process.exit(1);
}

const srcEntries = readdirSync("src");
const badSrcEntries = srcEntries.filter((name) => !allowedSrcEntries.has(name));
if (badSrcEntries.length > 0) {
  console.error("Unexpected src entries:", badSrcEntries.join(", "));
  process.exit(1);
}

for (const requiredPath of [
  "docs/product/REPO-STRUCTURE.md",
  "docs/product/GETTING-STARTED.md",
  "docs/product/FEATURE-MAP.md",
  "docs/product/ACTIVE-SURFACES.md",
  "fixtures/pg",
  "legacy/demos-html",
  "vendor/blitzboard",
  "vendor/wlog-legacy-package",
]) {
  if (!existsSync(requiredPath)) {
    console.error("Missing required path:", requiredPath);
    process.exit(1);
  }
}

console.log("WOLOG repo structure check passed.");
