import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const START = "* Generated Catalog";
const ACTIVE_START = "** Active Tree";
const APPS_START = "** Active Apps";
const LEGACY_START = "** Legacy";
const VENDOR_START = "** Vendor";

function listTree(path) {
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => `${entry.isDirectory() ? "- " : "- "}\`${path}/${entry.name}\``)
    .join("\n");
}

const generated = [
  START,
  "",
  ACTIVE_START,
  listTree("src"),
  "",
  APPS_START,
  listTree("apps"),
  "",
  LEGACY_START,
  listTree("legacy"),
  "",
  VENDOR_START,
  listTree("vendor"),
  "",
].join("\n");

const file = "index.org";
const source = readFileSync(file, "utf8");
const next = source.includes(START)
  ? source.replace(new RegExp(`${START}[\\s\\S]*$`), generated)
  : `${source.trim()}\n\n${generated}\n`;

writeFileSync(file, `${next}`);
console.log("Updated generated catalog section in index.org");
