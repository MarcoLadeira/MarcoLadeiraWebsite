(function () {
    "use strict";

    const doc = document.documentElement;
    const body = document.body;
    const page = body.dataset.page || "";
    const header = document.getElementById("site-header");
    const nav = document.querySelector(".site-nav");
    const navToggle = document.querySelector(".site-nav__toggle");
    const navList = document.getElementById("site-nav-list");
    const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
    const themeToggle = document.querySelector(".theme-toggle");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ─── Init ─── */

    initTheme();
    initYear();
    initNavigation();
    initReveal();
    initActiveNav();
    initArticleEnhancements();
    updateHeader();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeydown);

    // Reveal elements already in viewport on load
    if (document.readyState === "complete") {
        revealVisible();
    } else {
        window.addEventListener("load", revealVisible);
    }

    /* ─── Theme ─── */

    function initTheme() {
        const saved = localStorage.getItem("theme");
        if (saved) {
            doc.setAttribute("data-theme", saved);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            doc.setAttribute("data-theme", "dark");
        }

        syncThemeButton();

        if (!themeToggle) return;

        themeToggle.addEventListener("click", function () {
            const next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
            doc.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            syncThemeButton();
        });
    }

    function syncThemeButton() {
        if (!themeToggle) return;
        const isDark = doc.getAttribute("data-theme") === "dark";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute("aria-label", "Toggle theme");
        themeToggle.textContent = isDark ? "Dark" : "Light";
    }

    /* ─── Year ─── */

    function initYear() {
        document.querySelectorAll("[data-year]").forEach(function (node) {
            node.textContent = "\u00A9 " + new Date().getFullYear();
        });
    }

    /* ─── Navigation ─── */

    function initNavigation() {
        if (!navToggle || !navList) return;

        navToggle.addEventListener("click", function () {
            toggleMobileNav();
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                var href = link.getAttribute("href");
                if (!href) return;

                var targetUrl = new URL(href, window.location.href);
                var isSamePageAnchor = targetUrl.pathname === window.location.pathname && targetUrl.hash;

                if (isSamePageAnchor) {
                    var target = document.querySelector(targetUrl.hash);
                    if (target) {
                        event.preventDefault();
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                        if (target.tabIndex < 0) {
                            target.focus({ preventScroll: true });
                        }
                    }
                }

                closeMobileNav();
            });
        });

        document.addEventListener("click", function (event) {
            if (!body.classList.contains("nav-open")) return;
            var target = event.target;
            if (!(target instanceof Node)) return;
            if ((nav && nav.contains(target)) || navToggle.contains(target)) return;
            closeMobileNav();
        });
    }

    function toggleMobileNav(forceState) {
        if (!navToggle || !navList) return;
        var shouldOpen = typeof forceState === "boolean" ? forceState : !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", shouldOpen);
        navList.classList.toggle("is-open", shouldOpen);
        navToggle.classList.toggle("is-open", shouldOpen);
        navToggle.setAttribute("aria-expanded", String(shouldOpen));
    }

    function closeMobileNav() {
        toggleMobileNav(false);
    }

    /* ─── Reveal system ─── */

    function initReveal() {
        var nodes = Array.from(document.querySelectorAll(".reveal"));
        if (nodes.length === 0) return;

        // Skip animation for reduced motion
        if (prefersReducedMotion.matches || typeof IntersectionObserver === "undefined") {
            nodes.forEach(function (node) { node.classList.add("is-visible"); });
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        nodes.forEach(function (node) { observer.observe(node); });
    }

    function revealVisible() {
        var reveals = document.querySelectorAll(".reveal:not(.is-visible)");
        reveals.forEach(function (node) {
            var rect = node.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92) {
                node.classList.add("is-visible");
            }
        });
    }

    /* ─── Active nav ─── */

    function initActiveNav() {
        navLinks.forEach(function (link) {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
        });

        if (!page || page === "home") return;

        var activeLink = navLinks.find(function (link) { return link.dataset.nav === page; });
        if (!activeLink) return;

        activeLink.classList.add("is-active");
        activeLink.setAttribute("aria-current", "page");
    }

    /* ─── Article enhancements ─── */

    function initArticleEnhancements() {
        if (!body.hasAttribute("data-article")) return;

        var article = document.querySelector(".article-body");
        if (!article) return;

        // Reading time
        var textContent = article.textContent || "";
        var wordCount = textContent.trim().split(/\s+/).length;
        var readingMinutes = Math.max(1, Math.round(wordCount / 230));
        var heroMeta = document.querySelector(".page-hero__meta");
        if (heroMeta) {
            var readingSpan = document.createElement("p");
            readingSpan.textContent = readingMinutes + " min read";
            heroMeta.appendChild(readingSpan);
        }

        var headings = Array.from(article.querySelectorAll("h2"));
        var toc = document.querySelector("[data-toc]");
        var progressFill = createReadingProgress();

        // Generate IDs and TOC
        var normalizedHeadings = headings.map(function (heading) {
            if (!heading.id) {
                heading.id = slugify(heading.textContent || "section");
            }
            return heading;
        });

        if (toc && normalizedHeadings.length > 0) {
            toc.hidden = false;
            toc.innerHTML = normalizedHeadings
                .map(function (h) { return '<a href="#' + h.id + '">' + h.textContent + '</a>'; })
                .join("");

            var tocLinks = Array.from(toc.querySelectorAll("a"));

            tocLinks.forEach(function (link) {
                link.addEventListener("click", function (event) {
                    var targetId = link.getAttribute("href");
                    if (!targetId) return;
                    var target = document.querySelector(targetId);
                    if (!target) return;
                    event.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                });
            });

            // Active heading tracking
            var headingObserver = new IntersectionObserver(function (entries) {
                var visibleEntry = entries
                    .filter(function (e) { return e.isIntersecting; })
                    .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })[0];

                if (!visibleEntry) return;

                var targetId = visibleEntry.target.id;
                tocLinks.forEach(function (link) {
                    link.classList.toggle("is-active", link.getAttribute("href") === "#" + targetId);
                });
            }, {
                rootMargin: "-20% 0px -65% 0px",
                threshold: [0, 1]
            });

            normalizedHeadings.forEach(function (h) { headingObserver.observe(h); });
        } else if (toc) {
            toc.hidden = true;
        }

        // Reading progress — smooth interpolation
        var currentProgress = 0;
        var targetProgress = 0;
        var rafId = null;

        function calcProgress() {
            var articleTop = article.getBoundingClientRect().top + window.scrollY;
            var distance = Math.max(article.offsetHeight - window.innerHeight * 0.75, 1);
            var raw = (window.scrollY - articleTop + window.innerHeight * 0.2) / distance;
            targetProgress = Math.max(0, Math.min(1, raw));
        }

        function animateProgress() {
            var diff = targetProgress - currentProgress;
            if (Math.abs(diff) < 0.001) {
                currentProgress = targetProgress;
                if (progressFill) progressFill.style.width = (currentProgress * 100) + "%";
                rafId = null;
                return;
            }
            currentProgress += diff * 0.12;
            if (progressFill) progressFill.style.width = (currentProgress * 100) + "%";
            rafId = requestAnimationFrame(animateProgress);
        }

        function onProgressScroll() {
            calcProgress();
            if (!rafId) rafId = requestAnimationFrame(animateProgress);
        }

        calcProgress();
        currentProgress = targetProgress;
        if (progressFill) progressFill.style.width = (currentProgress * 100) + "%";

        window.addEventListener("scroll", onProgressScroll, { passive: true });
        window.addEventListener("resize", function () {
            calcProgress();
            currentProgress = targetProgress;
            if (progressFill) progressFill.style.width = (currentProgress * 100) + "%";
        });
    }

    function createReadingProgress() {
        if (!header) return null;

        var bar = document.createElement("div");
        bar.className = "reading-progress is-visible";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-label", "Reading progress");

        var fill = document.createElement("span");
        bar.appendChild(fill);
        header.appendChild(bar);

        return fill;
    }

    /* ─── Scroll handler ─── */

    var lastScrollY = 0;
    var ticking = false;

    function handleScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(function () {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    }

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("is-scrolled", lastScrollY > 8);
    }

    /* ─── Resize ─── */

    function handleResize() {
        if (window.innerWidth > 720) {
            closeMobileNav();
        }
        revealVisible();
    }

    /* ─── Keyboard ─── */

    function handleKeydown(event) {
        if (event.key === "Escape") {
            closeMobileNav();
        }
    }

    /* ─── Utility ─── */

    function slugify(value) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
})();
