// Front Matter CMS custom action: create the English translation of the open file.
//
// Hugo pairs translations by file name (post.md -> post.en.md, index.md -> index.en.md),
// which Front Matter's own i18n (folder based) does not support.
// The copy starts as a draft, without the Turkish-only aliases, and is opened in the editor.
//
// Front Matter calls: node create-translation.mjs <workspacePath> <filePath> <frontMatterJson>
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [, , , filePath] = process.argv;

// Front Matter reads a JSON line from stdout to open a file when the script is done.
const open = (path) => console.log(JSON.stringify({ fmAction: "open", fmPath: path }));

if (!filePath?.endsWith(".md")) {
  console.log("Bu işlem sadece Markdown dosyalarında çalışır.");
  process.exit(0);
}
if (filePath.endsWith(".en.md")) {
  console.log("Bu dosya zaten İngilizce.");
  process.exit(0);
}

const target = filePath.replace(/\.md$/, ".en.md");
if (existsSync(target)) {
  open(target);
  process.exit(0);
}

const source = readFileSync(filePath, "utf8");
const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
if (!match) {
  console.log("Front matter bulunamadı.");
  process.exit(0);
}

let [, frontMatter, body] = match;

// Aliases are the old Turkish URLs; the translation must not claim them too.
frontMatter = frontMatter.replace(/^aliases:.*\n(?:[ \t]+-.*\n?)*/m, "");

// Start as a draft until the text is translated.
if (/^draft:.*$/m.test(frontMatter)) {
  frontMatter = frontMatter.replace(/^draft:.*$/m, "draft: true");
} else {
  frontMatter += "\ndraft: true";
}

// Posts get their English URL from `slug`; leave a reminder after the title.
if (filePath.includes("/content/posts/") && !/^slug:/m.test(frontMatter)) {
  frontMatter = frontMatter.replace(/^(title:.*)$/m, '$1\n# slug: "english-url-of-the-post"');
}

const translated = `---\n${frontMatter.trimEnd()}\n---\n\n<!-- TODO: translate to English -->\n${body.replace(/^\n+/, "\n")}`;
writeFileSync(target, translated, "utf8");
open(target);
