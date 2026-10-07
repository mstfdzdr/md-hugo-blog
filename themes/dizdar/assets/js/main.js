// Client-side behaviour for the dizdar theme. Bundled by Hugo (js.Build).

const i18n = JSON.parse(document.body.dataset.i18n || "{}");
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// --- Theme ---------------------------------------------------------------
// The initial class is set inline in <head>; this only handles the toggle and
// follows the OS setting while the user has not picked a theme.
function storedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

$$("[data-theme-toggle]").forEach((button) =>
  button.addEventListener("click", () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
  }),
);

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  const theme = storedTheme();
  if (!theme || theme === "auto") document.documentElement.classList.toggle("dark", event.matches);
});

// --- Mobile menu ---------------------------------------------------------
const menuToggle = $("[data-menu-toggle]");
const mobileMenu = $("#mobile-menu");
menuToggle?.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("hidden") === false;
  menuToggle.setAttribute("aria-expanded", String(open));
});

// --- Back to top -----------------------------------------------------------
const backToTop = $("[data-back-to-top]");
if (backToTop) {
  const update = () => {
    const visible = window.scrollY > 600;
    backToTop.classList.toggle("opacity-0", !visible);
    backToTop.classList.toggle("pointer-events-none", !visible);
  };
  window.addEventListener("scroll", update, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  update();
}

// --- Code blocks: language label, copy button, collapse long blocks ---------
function codeText(highlight) {
  // With line numbers in a table, the code is in the last cell.
  const code = $(".lntd:last-child code", highlight) || $("code", highlight);
  return code ? code.innerText.replace(/\n$/, "") : "";
}

function lineCount(highlight) {
  const code = $(".lntd:last-child code", highlight) || $("code", highlight);
  if (!code) return 0;
  return $$(".line", code).length || code.innerText.split("\n").length;
}

$$(".content .highlight").forEach((highlight) => {
  if (highlight.closest(".code-block")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "code-block";
  highlight.replaceWith(wrapper);

  const header = document.createElement("div");
  header.className = "code-block-header";
  const lang = $("code[data-lang]", highlight)?.dataset.lang || "";
  const label = document.createElement("span");
  label.textContent = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : "";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = i18n.copy || "Copy";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(codeText(highlight));
      copy.textContent = i18n.copied || "Copied";
      setTimeout(() => (copy.textContent = i18n.copy || "Copy"), 1500);
    } catch {
      /* clipboard blocked: leave the label unchanged */
    }
  });

  header.append(label, copy);
  wrapper.append(header, highlight);

  const maxLines = Number(highlight.closest("[data-max-lines]")?.dataset.maxLines || 0);
  if (maxLines > 0 && lineCount(highlight) > maxLines) {
    wrapper.classList.add("is-collapsed");
    const expand = document.createElement("button");
    expand.type = "button";
    expand.className = "code-block-expand";
    expand.textContent = i18n.expand || "Show all";
    expand.addEventListener("click", () => {
      const collapsed = wrapper.classList.toggle("is-collapsed");
      expand.textContent = collapsed ? i18n.expand || "Show all" : i18n.collapse || "Collapse";
    });
    wrapper.append(expand);
  }
});

// --- Table of contents: highlight the section being read --------------------
const toc = $("[data-toc]");
if (toc) {
  const links = $$("a[href^='#']", toc);
  const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const headings = $$(".content :is(h2,h3,h4,h5,h6)[id]").filter((h) => byId.has(h.id));
  const setActive = (id) => links.forEach((a) => a.classList.toggle("is-active", a === byId.get(id)));

  const onScroll = () => {
    let current = headings[0]?.id;
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top < 120) current = heading.id;
      else break;
    }
    if (current) setActive(current);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// --- Lightbox for content images and project screenshots -------------------
function openLightbox(items, index) {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = `
    <img alt="">
    <p class="lightbox-caption"></p>
    <button type="button" class="lightbox-close" aria-label="${i18n.close || "Close"}">✕</button>
    ${items.length > 1 ? `<button type="button" class="lightbox-prev" aria-label="${i18n.previous || "Previous"}">‹</button>
    <button type="button" class="lightbox-next" aria-label="${i18n.next || "Next"}">›</button>` : ""}`;
  const img = $("img", dialog);
  const caption = $(".lightbox-caption", dialog);

  const show = (i) => {
    index = (i + items.length) % items.length;
    img.src = items[index].src;
    img.alt = items[index].caption;
    caption.textContent = items[index].caption;
  };

  dialog.addEventListener("click", (event) => {
    if (event.target.closest(".lightbox-prev")) show(index - 1);
    else if (event.target.closest(".lightbox-next")) show(index + 1);
    else if (event.target !== img) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => dialog.remove());

  document.body.append(dialog);
  show(index);
  dialog.showModal();
}

$$(".content img").forEach((img) => {
  if (img.closest("a")) return;
  img.addEventListener("click", () => openLightbox([{ src: img.currentSrc || img.src, caption: img.alt }], 0));
});

$$("[data-gallery]").forEach((gallery) => {
  const links = $$("a", gallery);
  const items = links.map((a) => ({ src: a.href, caption: a.dataset.caption || "" }));
  links.forEach((a, i) =>
    a.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(items, i);
    }),
  );
});

// --- YouTube: load the player only when clicked -----------------------------
$$("[data-youtube]").forEach((button) =>
  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.youtube}?autoplay=1`;
    iframe.title = button.dataset.title || "YouTube";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.className = "absolute inset-0 size-full";
    button.replaceWith(iframe);
  }),
);

// --- Typing effect on the home subtitle -------------------------------------
const typeit = $("[data-typeit]");
if (typeit && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const text = typeit.textContent.trim();
  const output = document.createElement("span");
  const cursor = document.createElement("span");
  cursor.className = "typeit-cursor";
  cursor.textContent = "|";
  typeit.replaceChildren(output, cursor);
  let i = 0;
  const step = () => {
    output.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, 100);
  };
  step();
}

// --- 404 emoji ---------------------------------------------------------------
const emoji = $("[data-error-emoji]");
if (emoji) {
  const faces = ["\\(o_o)/", "(˚Δ˚)b", "(^-^*)", "(≥o≤)", "(^_^)b", "(·_·)", "(='X'=)", "(>_<)", "(;-;)"];
  emoji.textContent = faces[Math.floor(Math.random() * faces.length)];
}

// --- Search -------------------------------------------------------------------
const search = $("[data-search]");
if (search) {
  const input = $("[data-search-input]", search);
  const results = $("[data-search-results]", search);
  const empty = $("[data-search-empty]", search);
  const template = $("#search-result");
  const locale = document.documentElement.lang || undefined;
  const normalize = (s) => s.toLocaleLowerCase(locale);
  let index = null;

  const loadIndex = async () => {
    if (!index) {
      const response = await fetch(search.dataset.index);
      index = (await response.json()).map((item) => ({
        ...item,
        haystack: normalize([item.title, item.tags.join(" "), item.categories.join(" "), item.content].join(" ")),
      }));
    }
    return index;
  };

  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const highlight = (text, terms) => {
    let html = escapeHTML(text);
    for (const term of terms) {
      const pattern = new RegExp(`(${escapeHTML(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      html = html.replace(pattern, "<mark>$1</mark>");
    }
    return html;
  };
  const snippet = (content, term) => {
    const at = normalize(content).indexOf(term);
    const start = Math.max(0, at - 60);
    return (start > 0 ? "…" : "") + content.slice(start, start + 180) + "…";
  };

  const render = async () => {
    const query = normalize(input.value.trim());
    results.replaceChildren();
    empty.classList.add("hidden");
    if (query.length < 2) return;

    const terms = query.split(/\s+/);
    const matches = (await loadIndex())
      .filter((item) => terms.every((t) => item.haystack.includes(t)))
      .map((item) => ({ item, score: terms.filter((t) => normalize(item.title).includes(t)).length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (!matches.length) {
      empty.classList.remove("hidden");
      return;
    }
    for (const { item } of matches) {
      const node = template.content.cloneNode(true);
      const link = $("a", node);
      link.href = item.url;
      $("[data-title]", node).innerHTML = highlight(item.title, terms);
      $("[data-snippet]", node).innerHTML = `${escapeHTML(item.date)} · ${highlight(snippet(item.content, terms[0]), terms)}`;
      results.append(node);
    }
  };

  const open = () => {
    search.showModal();
    input.focus();
    input.select();
    loadIndex();
  };

  input.addEventListener("input", render);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") $("a", results)?.click();
  });
  $$("[data-search-open]").forEach((b) => b.addEventListener("click", open));
  $("[data-search-close]", search).addEventListener("click", () => search.close());
  search.addEventListener("click", (event) => {
    if (event.target === search) search.close();
  });
  document.addEventListener("keydown", (event) => {
    const typing = event.target.closest("input, textarea, [contenteditable]");
    if ((event.key === "/" && !typing) || (event.key === "k" && (event.metaKey || event.ctrlKey))) {
      event.preventDefault();
      open();
    }
  });
}
