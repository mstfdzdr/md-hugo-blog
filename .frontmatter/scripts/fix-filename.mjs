// Front Matter CMS post script: clean up the file name of newly created content.
//
// Front Matter lower-cases titles with JavaScript's toLowerCase(), which turns the
// Turkish "İ" into "i" + U+0307 (combining dot). That invisible character ends up in
// the file name ("i̇lk-deneme.md"). This script removes it and renames the file, or the
// folder for page bundles (index.md / _index.md), then opens the renamed file.
//
// Front Matter calls: node fix-filename.mjs <workspacePath> <filePath> <frontMatterJson>
import { existsSync, renameSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const [, , , filePath] = process.argv;
if (!filePath) process.exit(0);

const clean = (name) => name.normalize("NFC").replace(/̇/g, "");
const isBundle = /^_?index(\.[a-z]{2})?\.md$/.test(basename(filePath));

const from = isBundle ? dirname(filePath) : filePath;
const to = join(dirname(from), clean(basename(from)));

if (to !== from && !existsSync(to)) {
  renameSync(from, to);
  const opened = isBundle ? join(to, basename(filePath)) : to;
  console.log(JSON.stringify({ fmAction: "open", fmPath: opened }));
}
