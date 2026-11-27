// Progressive enhancement for every page. The site is fully usable without this file.
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
root.setAttribute("data-ready", "");

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
  darkQuery.addEventListener("change", () => syncThemeButton(btn));
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
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setOpen(false));
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
        el.style.setProperty("--delay", `${Math.min(batch, 6) * 70}ms`);
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

/* ---------- Homepage schematic ---------- */
function initSchematic() {
  const s = document.querySelector("[data-schematic]");
  if (!s) return;
  const traces = [...s.querySelectorAll(".trace, .signal")];
  traces.filter((t) => t.classList.contains("trace")).forEach((t, i) => t.style.setProperty("--i", i));

  const activate = (id) => {
    if (!id) {
      s.removeAttribute("data-active");
      s.querySelectorAll(".is-on").forEach((el) => el.classList.remove("is-on"));
      return;
    }
    s.setAttribute("data-active", id);
    const caps = new Set();
    traces.forEach((t) => {
      const on = t.dataset.station === id;
      t.classList.toggle("is-on", on);
      if (on) caps.add(t.dataset.cap);
    });
    s.querySelectorAll(".cap").forEach((c) => c.classList.toggle("is-on", caps.has(c.dataset.cap)));
    s.querySelectorAll(".node").forEach((n) => n.classList.toggle("is-on", n.dataset.station === id));
  };
  s.querySelectorAll(".station").forEach((st) => {
    const id = st.dataset.station;
    st.addEventListener("pointerenter", () => activate(id));
    st.addEventListener("pointerleave", () => activate(null));
    st.addEventListener("focusin", () => activate(id));
    st.addEventListener("focusout", () => activate(null));
  });

  if (reduceMotion.matches) return;
  requestAnimationFrame(() => {
    s.classList.add("is-drawn");
    setTimeout(() => s.classList.add("is-live"), 1400);
  });
  // Pause the ambient signal when off screen or the tab is hidden.
  const io = new IntersectionObserver(([e]) => s.classList.toggle("is-paused", !e.isIntersecting));
  io.observe(s);
  document.addEventListener("visibilitychange", () => s.classList.toggle("is-paused", document.hidden));
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

/* ---------- Videos: play only when visible, never with reduced motion ---------- */
function initVideos() {
  const vids = document.querySelectorAll("video[data-autoplay-when-visible]");
  if (!vids.length || reduceMotion.matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      }),
    { threshold: 0.5 }
  );
  vids.forEach((v) => io.observe(v));
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

initTheme();
initNav();
initMasthead();
initReveals();
initSchematic();
initCopy();
initVideos();
initToc();
