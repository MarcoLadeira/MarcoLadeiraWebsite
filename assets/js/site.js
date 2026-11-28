// Progressive enhancement for every page. The site is fully usable without this file.
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

/* ---------- Theme ---------- */
function effectiveTheme() {
  const t = root.dataset.theme;
  return t === "auto" ? (darkQuery.matches ? "dark" : "light") : t;
}
function syncThemeButton(btn) {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  btn.setAttribute("aria-label", `Switch to ${next} theme`);
  btn.title = `Switch to ${next} theme`;
}
function initTheme() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  syncThemeButton(btn);
  btn.addEventListener("click", () => {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch { /* storage unavailable */ }
      syncThemeButton(btn);
    };
    if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(apply);
    else apply();
  });
  darkQuery.addEventListener?.("change", () => syncThemeButton(btn));
}

/* ---------- Navigation ---------- */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const list = document.getElementById("nav-list");
  if (!toggle || !list) return;
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav__toggle-label").textContent = open ? "Close" : "Menu";
    if (open) list.setAttribute("data-open", "");
    else list.removeAttribute("data-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
    if (open) list.querySelector("a")?.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".nav")) setOpen(false);
  });
  // Close when keyboard focus leaves the menu.
  toggle.closest(".nav").addEventListener("focusout", (e) => {
    if (toggle.getAttribute("aria-expanded") === "true" && e.relatedTarget && !e.relatedTarget.closest(".nav")) setOpen(false);
  });
  window.matchMedia("(min-width: 961px)").addEventListener?.("change", (e) => e.matches && setOpen(false));
}

function initMasthead() {
  const head = document.querySelector("[data-masthead]");
  if (!head) return;
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;height:8px;width:1px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => head.toggleAttribute("data-scrolled", !e.isIntersecting)).observe(sentinel);
}

/* ---------- Reveals ---------- */
function initReveals() {
  const items = [...document.querySelectorAll("[data-reveal], [data-split]")];
  document.querySelectorAll("[data-split]").forEach((el) => {
    el.querySelectorAll(".line").forEach((line, i) => line.style.setProperty("--line", i));
  });
  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  // Stagger siblings that enter together.
  let batch = 0;
  let batchTimer;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.setProperty("--delay", `${Math.min(batch, 3) * 40}ms`);
        batch += 1;
        el.classList.add("is-in");
        io.unobserve(el);
      });
      clearTimeout(batchTimer);
      batchTimer = setTimeout(() => (batch = 0), 120);
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
  // Safety net: never leave content hidden (e.g. print, odd viewports, background tabs).
  window.addEventListener("beforeprint", () => items.forEach((el) => el.classList.add("is-in")));
  setTimeout(() => {
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
    });
  }, 1500);
}

/* ---------- Copy email ---------- */
function initCopy() {
  if (!navigator.clipboard) return;
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.hidden = false;
    const label = btn.querySelector(".copy__label");
    const status = btn.parentElement.querySelector("[data-copy-status]");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        label.textContent = "Copied";
        btn.setAttribute("data-copied", "");
        if (status) status.textContent = "Email address copied to clipboard";
      } catch {
        label.textContent = "Copy failed — select the address";
      }
      setTimeout(() => {
        label.textContent = "Copy address";
        btn.removeAttribute("data-copied");
        if (status) status.textContent = "";
      }, 2400);
    });
  });
}

function initClips() {
  document.querySelectorAll("[data-clip]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const frame = link.closest("[data-clip-frame]");
      if (!frame) return;
      event.preventDefault();

      const video = document.createElement("video");
      video.className = "clip";
      video.controls = true;
      video.playsInline = true;
      video.muted = true;
      video.width = Number(link.dataset.width);
      video.height = Number(link.dataset.height);
      video.setAttribute("aria-label", link.dataset.clipLabel);
      const webm = document.createElement("source");
      webm.src = link.dataset.clip;
      webm.type = "video/webm";
      const mp4 = document.createElement("source");
      mp4.src = link.href;
      mp4.type = "video/mp4";
      video.append(webm, mp4);
      frame.replaceChildren(video);
      video.focus();
      video.play().catch(() => {});
    });
  });
}

/* ---------- Case-study table of contents ---------- */
function initToc() {
  const links = [...document.querySelectorAll(".case__toc a")];
  if (!links.length) return;
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        map.get(e.target.id)?.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  map.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

// Each feature is independent: one failing (e.g. an old browser API) must not take the others,
// or the hidden-until-revealed content, down with it.
let failed = false;
for (const init of [initReveals, initTheme, initNav, initMasthead, initCopy, initClips, initToc]) {
  try {
    init();
  } catch (err) {
    failed = true;
    console.warn(`[site] ${init.name} failed`, err);
  }
}
if (failed) document.querySelectorAll("[data-reveal], [data-split]").forEach((el) => el.classList.add("is-in"));
root.setAttribute("data-ready", "");
