/* ================================================================
   MARCO LADEIRA — Interactive Experience Layer
   Terminal, Command Palette, Micro-interactions, Easter Eggs
   ================================================================ */

(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ================================================================
       COMMAND PALETTE (Ctrl+K / Cmd+K)
       ================================================================ */

    var paletteOpen = false;
    var paletteEl = null;
    var paletteInput = null;
    var paletteResults = null;
    var paletteItems = [];
    var paletteActiveIndex = -1;

    var commands = [
        { label: "Home", keys: "g h", action: function () { navigate("/"); }, icon: "⌂", group: "Navigate" },
        { label: "Work", keys: "g w", action: function () { navigate("/work/"); }, icon: "◆", group: "Navigate" },
        { label: "Writing", keys: "g e", action: function () { navigate("/writing/"); }, icon: "✎", group: "Navigate" },
        { label: "About", keys: "g a", action: function () { navigate("/about/"); }, icon: "◉", group: "Navigate" },
        { label: "Now", keys: "g n", action: function () { navigate("/now/"); }, icon: "◷", group: "Navigate" },
        { label: "Contact", keys: "g c", action: function () { navigate("/contact/"); }, icon: "✉", group: "Navigate" },
        { label: "Updates", keys: "g u", action: function () { navigate("/updates/"); }, icon: "↗", group: "Navigate" },
        { label: "Toggle theme", keys: "t", action: function () { toggleTheme(); }, icon: "◐", group: "Actions" },
        { label: "Open terminal", keys: "`", action: function () { openTerminal(); }, icon: ">_", group: "Actions" },
        { label: "View source", keys: "", action: function () { window.open("https://github.com/MarcoLadeira/MarcoLadeira.github.io", "_blank"); }, icon: "</>", group: "Actions" },
        { label: "Download resume (outdated)", keys: "", action: function () { var a = document.createElement("a"); a.href = "/assets/cv.pdf"; a.download = ""; a.click(); }, icon: "↓", group: "Actions" },
        { label: "Scroll to top", keys: "", action: function () { window.scrollTo({ top: 0, behavior: "smooth" }); }, icon: "↑", group: "Actions" }
    ];

    function buildPalette() {
        paletteEl = document.createElement("div");
        paletteEl.className = "cmd-palette";
        paletteEl.setAttribute("role", "dialog");
        paletteEl.setAttribute("aria-label", "Command palette");
        paletteEl.innerHTML =
            '<div class="cmd-palette__backdrop"></div>' +
            '<div class="cmd-palette__panel">' +
                '<div class="cmd-palette__header">' +
                    '<input class="cmd-palette__input" type="text" placeholder="Type a command..." autocomplete="off" spellcheck="false">' +
                    '<kbd class="cmd-palette__esc">ESC</kbd>' +
                '</div>' +
                '<div class="cmd-palette__results" role="listbox"></div>' +
                '<div class="cmd-palette__footer">' +
                    '<span><kbd>↑↓</kbd> Navigate</span>' +
                    '<span><kbd>↵</kbd> Run</span>' +
                    '<span><kbd>esc</kbd> Close</span>' +
                '</div>' +
            '</div>';

        document.body.appendChild(paletteEl);
        paletteInput = paletteEl.querySelector(".cmd-palette__input");
        paletteResults = paletteEl.querySelector(".cmd-palette__results");

        paletteEl.querySelector(".cmd-palette__backdrop").addEventListener("click", closePalette);
        paletteInput.addEventListener("input", filterPalette);
        paletteInput.addEventListener("keydown", handlePaletteKeys);

        renderPaletteResults(commands);
    }

    function renderPaletteResults(items) {
        paletteItems = items;
        paletteActiveIndex = 0;

        var grouped = {};
        items.forEach(function (item) {
            var g = item.group || "Other";
            if (!grouped[g]) grouped[g] = [];
            grouped[g].push(item);
        });

        var html = "";
        Object.keys(grouped).forEach(function (group) {
            html += '<div class="cmd-palette__group">' + group + '</div>';
            grouped[group].forEach(function (item, i) {
                var globalIndex = items.indexOf(item);
                html += '<button class="cmd-palette__item' + (globalIndex === 0 ? ' is-active' : '') +
                    '" data-index="' + globalIndex + '" role="option">' +
                    '<span class="cmd-palette__icon">' + item.icon + '</span>' +
                    '<span class="cmd-palette__label">' + item.label + '</span>' +
                    (item.keys ? '<kbd class="cmd-palette__keys">' + item.keys + '</kbd>' : '') +
                    '</button>';
            });
        });

        paletteResults.innerHTML = html || '<div class="cmd-palette__empty">No results found</div>';

        var btns = Array.from(paletteResults.querySelectorAll(".cmd-palette__item"));
        btns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var idx = parseInt(btn.dataset.index);
                if (paletteItems[idx]) {
                    closePalette();
                    paletteItems[idx].action();
                }
            });
            btn.addEventListener("mouseenter", function () {
                paletteActiveIndex = parseInt(btn.dataset.index);
                highlightPaletteItem();
            });
        });
    }

    function filterPalette() {
        var query = paletteInput.value.toLowerCase().trim();
        if (!query) {
            renderPaletteResults(commands);
            return;
        }
        var filtered = commands.filter(function (cmd) {
            return cmd.label.toLowerCase().includes(query) ||
                   (cmd.group && cmd.group.toLowerCase().includes(query));
        });
        renderPaletteResults(filtered);
    }

    function handlePaletteKeys(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            paletteActiveIndex = Math.min(paletteActiveIndex + 1, paletteItems.length - 1);
            highlightPaletteItem();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            paletteActiveIndex = Math.max(paletteActiveIndex - 1, 0);
            highlightPaletteItem();
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (paletteItems[paletteActiveIndex]) {
                closePalette();
                paletteItems[paletteActiveIndex].action();
            }
        } else if (e.key === "Escape") {
            closePalette();
        }
    }

    function highlightPaletteItem() {
        var btns = paletteResults.querySelectorAll(".cmd-palette__item");
        btns.forEach(function (btn, i) {
            var idx = parseInt(btn.dataset.index);
            btn.classList.toggle("is-active", idx === paletteActiveIndex);
        });
        var active = paletteResults.querySelector(".cmd-palette__item.is-active");
        if (active) active.scrollIntoView({ block: "nearest" });
    }

    function openPalette() {
        if (!paletteEl) buildPalette();
        paletteOpen = true;
        paletteEl.classList.add("is-open");
        paletteInput.value = "";
        filterPalette();
        requestAnimationFrame(function () { paletteInput.focus(); });
        document.body.style.overflow = "hidden";
    }

    function closePalette() {
        if (!paletteEl) return;
        paletteOpen = false;
        paletteEl.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    function togglePalette() {
        paletteOpen ? closePalette() : openPalette();
    }

    /* ================================================================
       INTERACTIVE TERMINAL (backtick key)
       ================================================================ */

    var terminalEl = null;
    var terminalOpen = false;
    var terminalOutput = null;
    var terminalInput = null;
    var terminalHistory = [];
    var historyIndex = -1;
    var bootTime = Date.now();
    var tabState = { lastInput: "", matches: [], index: 0 };
    var cmdAliases = { ls: "help", "?": "help", man: "help", cd: "goto", pwd: "whereami", cat: "read", vi: "vim", nano: "vim", emacs: "vim", open: "goto", curl: "fetch", wget: "fetch", top: "htop", ps: "htop", pip: "install", npm: "install", brew: "install", apt: "install", git: "gitstatus", history: "hist" };

    var ALL_COMMANDS = [
        "help", "about", "skills", "stack", "projects", "contact", "now",
        "theme", "goto", "uptime", "whoami", "date", "echo", "neofetch",
        "matrix", "sudo", "rm", "coffee", "clear", "exit", "weather",
        "joke", "quote", "ascii", "ping", "traceroute", "whois",
        "fortune", "cowsay", "sl", "lscpu", "df", "cat", "vim", "htop",
        "gitstatus", "deploy", "fetch", "hist", "repo", "certifications",
        "education", "experience", "whereami", "banner", "install",
        "tree", "grep", "man", "colors", "flip", "unflip", "shrug",
        "resume", "blog", "links", "scan", "changelog"
    ];

    var terminalCommands = {
        help: function () {
            return [
                "<span class='t-muted'>┌─────────────────────────────────────────────┐</span>",
                "<span class='t-muted'>│</span> <span class='t-accent'>Portfolio Terminal</span>                        <span class='t-muted'>│</span>",
                "<span class='t-muted'>├─────────────────────────────────────────────┤</span>",
                "<span class='t-muted'>│</span> <span class='t-section'>PROFILE</span>                                    <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>about</span>          About me                    <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>skills</span>         Technical skill bars        <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>stack</span>          Current tech stack          <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>experience</span>     Work history                <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>education</span>      Academic background         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>certifications</span> Certs and credentials       <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>projects</span>       Selected projects           <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>contact</span>        How to reach me             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>now</span>            What I'm working on         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>resume</span>         Text-based resume           <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>blog</span>           Recent writing & updates    <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>links</span>          All social/contact links    <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>                                             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span> <span class='t-section'>NAVIGATION</span>                                 <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>goto</span> [page]    Navigate to a page          <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>whereami</span>       Show current page           <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>repo</span>           Open source code            <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>                                             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span> <span class='t-section'>SYSTEM</span>                                     <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>theme</span>          Toggle dark/light mode      <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>neofetch</span>       System info                 <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>uptime</span>         Session duration            <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>whoami</span>         Current user                <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>date</span>           Current date/time           <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>htop</span>           Process monitor             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>lscpu</span>          CPU information             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>df</span>             Disk usage                  <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>tree</span>           Site file tree              <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>colors</span>         Show color palette          <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>scan</span>           Run site audit              <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>changelog</span>      Portfolio version history   <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>                                             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span> <span class='t-section'>NETWORK</span>                                    <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>ping</span> [host]    Test connectivity           <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>traceroute</span>     Trace network path          <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>whois</span>          Domain whois lookup         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>weather</span>        Current weather in Dublin   <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>fetch</span> [url]    cURL simulation             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>                                             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span> <span class='t-section'>FUN</span>                                        <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>matrix</span>         Enter the matrix            <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>coffee</span>         Essential command            <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>joke</span>           Random dev joke             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>quote</span>          Inspirational quote         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>fortune</span>        Fortune cookie              <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>cowsay</span> [text]  Moo                         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>ascii</span>          ASCII art                   <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>sl</span>             Trains                      <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>flip</span>           (╯°□°)╯︵ ┻━┻               <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>unflip</span>         ┬─┬ノ( º _ ºノ)             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>shrug</span>          ¯\\_(ツ)_/¯                  <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>                                             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span> <span class='t-section'>CLASSIC</span>                                    <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>echo</span> [text]    Print text                  <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>grep</span> [text]    Search site content         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>banner</span>         Show welcome banner         <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>hist</span>           Command history             <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>sudo</span>           Try it                      <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>rm -rf /</span>       Don't try it                <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>clear</span>          Clear terminal              <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span>  <span class='t-accent'>exit</span>           Close terminal              <span class='t-muted'>│</span>",
                "<span class='t-muted'>├─────────────────────────────────────────────┤</span>",
                "<span class='t-muted'>│</span> <span class='t-muted'>Tab to autocomplete · ↑↓ for history</span>        <span class='t-muted'>│</span>",
                "<span class='t-muted'>│</span> <span class='t-muted'>Aliases: ls, cd, cat, pwd, git, npm...</span>     <span class='t-muted'>│</span>",
                "<span class='t-muted'>└─────────────────────────────────────────────┘</span>"
            ].join("\n");
        },

        about: function () {
            return [
                "",
                "<span class='t-accent'>  ╔══════════════════════════════╗</span>",
                "<span class='t-accent'>  ║   Software Engineer          ║</span>",
                "<span class='t-accent'>  ╚══════════════════════════════╝</span>",
                "",
                "  Based in <span class='t-highlight'>Dublin, Ireland</span>",
                "  Working at <span class='t-highlight'>Fenergo</span> since September 2025",
                "",
                "  Building enterprise SaaS for financial institutions.",
                "  Focus on backend delivery, event-driven systems,",
                "  and production engineering.",
                "",
                "  Selected for Fenergo's <span class='t-accent'>first AI initiative</span> –",
                "  bringing MCP tooling and LLM workflows into",
                "  enterprise financial software.",
                "",
                "  Previously: full-stack products, VR systems,",
                "  iOS apps, and research-level ML work.",
                "",
                "  <span class='t-muted'>Core philosophy:</span>",
                "  Product taste, calm interfaces, reliable systems.",
                "  Code should work first, read well second, impress never.",
                ""
            ].join("\n");
        },

        skills: function () {
            var skills = [
                { name: "C# / .NET", level: 90, color: "t-accent" },
                { name: "System Design", level: 88, color: "t-accent" },
                { name: "TypeScript", level: 85, color: "t-highlight" },
                { name: "Node.js", level: 82, color: "t-highlight" },
                { name: "LLM / MCP", level: 82, color: "t-highlight" },
                { name: "React", level: 80, color: "t-highlight" },
                { name: "AWS / Cloud", level: 78, color: "t-success" },
                { name: "EventStoreDB", level: 75, color: "t-success" },
                { name: "Python / ML", level: 73, color: "t-success" },
                { name: "Docker/CI", level: 72, color: "t-success" },
                { name: "Swift/UIKit", level: 65, color: "t-warning" },
                { name: "Unity/C#", level: 60, color: "t-warning" }
            ];
            var lines = ["", "<span class='t-accent'>  TECHNICAL PROFICIENCY</span>", "  ─────────────────────────────────────────", ""];
            skills.forEach(function (s) {
                var filled = Math.round(s.level / 5);
                var bar = "<span class='" + s.color + "'>" + "█".repeat(filled) + "</span>" + "<span class='t-muted'>" + "░".repeat(20 - filled) + "</span>";
                lines.push("  " + s.name.padEnd(16) + " " + bar + " <span class='t-muted'>" + s.level + "%</span>");
            });
            lines.push("");
            lines.push("  <span class='t-muted'>Legend:</span> <span class='t-accent'>█ Expert</span>  <span class='t-highlight'>█ Advanced</span>  <span class='t-success'>█ Proficient</span>  <span class='t-warning'>█ Familiar</span>");
            lines.push("");
            return lines.join("\n");
        },

        stack: function () {
            return [
                "",
                "  <span class='t-accent'>╭───────────────────────────────────────╮</span>",
                "  <span class='t-accent'>│</span> <span class='t-section'>CURRENT TECHNOLOGY STACK</span>              <span class='t-accent'>│</span>",
                "  <span class='t-accent'>├───────────────────────────────────────┤</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>Languages</span>                            <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    C# · TypeScript · Python · Swift   <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>Backend</span>                              <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    .NET · Node.js · EventStoreDB      <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    DynamoDB · PostgreSQL               <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>Frontend</span>                             <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    React · HTML/CSS/JS · Tailwind     <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>Cloud & DevOps</span>                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    AWS (ML Specialty certified)       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    Docker · GitHub Actions            <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>AI/ML</span>                                <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    LLMs · MCP · LangChain · RAG      <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>Architecture</span>                         <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    CQRS · Event Sourcing · DDD       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    Microservices · Clean Arch         <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>  <span class='t-highlight'>Tools</span>                                <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>    Git · VS Code · Copilot · Rider   <span class='t-accent'>│</span>",
                "  <span class='t-accent'>│</span>                                       <span class='t-accent'>│</span>",
                "  <span class='t-accent'>╰───────────────────────────────────────╯</span>",
                ""
            ].join("\n");
        },

        experience: function () {
            return [
                "",
                "  <span class='t-accent'>WORK EXPERIENCE</span>",
                "  ─────────────────────────────────────────",
                "",
                "  <span class='t-highlight'>Fenergo</span>  <span class='t-muted'>│</span>  Software Engineer",
                "  <span class='t-muted'>Sep 2025 — Present  │  Dublin, Ireland</span>",
                "  Enterprise SaaS for financial compliance.",
                "  Backend delivery, CQRS, event sourcing, DynamoDB.",
                "  Selected for first AI initiative — MCP + LLM tooling.",
                "",
                "  <span class='t-highlight'>University Projects</span>  <span class='t-muted'>│</span>  Full-Stack Developer",
                "  <span class='t-muted'>2021 — 2025</span>",
                "  NASA Space Explorer — full-stack web platform",
                "  Achievr — iOS goal tracking app (Swift/UIKit)",
                "  Explorer — VR adventure game (Unity/C#)",
                "  Various ML and AI research projects",
                ""
            ].join("\n");
        },

        education: function () {
            return [
                "",
                "  <span class='t-accent'>EDUCATION</span>",
                "  ─────────────────────────────────────────",
                "",
                "  <span class='t-highlight'>BSc Computer Science</span>",
                "  <span class='t-muted'>Technological University Dublin</span>",
                "  <span class='t-muted'>2021 — 2025</span>",
                "",
                "  Focus areas: Software Engineering, Machine Learning,",
                "  Cloud Computing, Mobile Development, VR Systems",
                ""
            ].join("\n");
        },

        certifications: function () {
            return [
                "",
                "  <span class='t-accent'>CERTIFICATIONS</span>",
                "  ─────────────────────────────────────────",
                "",
                "  <span class='t-success'>✓</span>  <span class='t-highlight'>AWS Machine Learning — Specialty</span>",
                "     <span class='t-muted'>Amazon Web Services · 2026</span>",
                "",
                "  <span class='t-muted'>Validates expertise in building, training,</span>",
                "  <span class='t-muted'>tuning, and deploying ML models on AWS.</span>",
                ""
            ].join("\n");
        },

        projects: function () {
            return [
                "",
                "  <span class='t-accent'>SELECTED PROJECTS</span>",
                "  ─────────────────────────────────────────",
                "",
                "  <span class='t-highlight'>[01]</span>  <span class='t-accent'>Fenergo</span>",
                "        Enterprise SaaS — financial compliance",
                "        <span class='t-muted'>C# · .NET · EventStoreDB · DynamoDB · CQRS</span>",
                "",
                "  <span class='t-highlight'>[02]</span>  <span class='t-accent'>NASA Space Explorer</span>",
                "        Full-stack NASA API interface",
                "        <span class='t-muted'>React · Node.js · NASA APIs · Tailwind</span>",
                "",
                "  <span class='t-highlight'>[03]</span>  <span class='t-accent'>Achievr</span>",
                "        iOS goal tracking app",
                "        <span class='t-muted'>Swift · UIKit · Core Data · CloudKit</span>",
                "",
                "  <span class='t-highlight'>[04]</span>  <span class='t-accent'>Explorer</span>",
                "        VR adventure game",
                "        <span class='t-muted'>Unity · C# · VR SDKs · 3D environments</span>",
                "",
                "  Type <span class='t-accent'>goto work</span> to see full portfolio",
                ""
            ].join("\n");
        },

        contact: function () {
            return [
                "",
                "  <span class='t-accent'>CONTACT</span>",
                "  ─────────────────────────────────────────",
                "",
                "  <span class='t-highlight'>Email</span>      marcoladeiraworkemail@gmail.com",
                "  <span class='t-highlight'>LinkedIn</span>   linkedin.com/in/marco-ladeira",
                "  <span class='t-highlight'>GitHub</span>     github.com/MarcoLadeira",
                "",
                "  Type <span class='t-accent'>goto contact</span> to visit contact page",
                ""
            ].join("\n");
        },

        now: function () {
            return [
                "",
                "  <span class='t-accent'>CURRENT FOCUS</span>  <span class='t-muted'>— updated March 2026</span>",
                "  ─────────────────────────────────────────",
                "",
                "  <span class='t-success'>→</span> Software Engineer at Fenergo, Dublin",
                "  <span class='t-success'>→</span> Enterprise backend: CQRS, event sourcing, DynamoDB",
                "  <span class='t-success'>→</span> Selected for Fenergo's first AI initiative",
                "  <span class='t-success'>→</span> MCP tooling and LLM workflows for enterprise",
                "  <span class='t-success'>→</span> AWS ML Specialty certified",
                "  <span class='t-success'>→</span> Building this portfolio terminal right now",
                "",
                "  Type <span class='t-accent'>goto now</span> for the full now page",
                ""
            ].join("\n");
        },

        theme: function () {
            toggleTheme();
            var current = document.documentElement.getAttribute("data-theme");
            return "\n  Theme switched to <span class='t-accent'>" + current + "</span> mode ◐\n";
        },

        goto: function (args) {
            var page = (args[0] || "").toLowerCase();
            var routes = {
                home: "/", work: "/work/", writing: "/writing/",
                about: "/about/", now: "/now/", contact: "/contact/",
                updates: "/updates/"
            };
            if (routes[page]) {
                appendOutput("\n  <span class='t-success'>→</span> Navigating to <span class='t-accent'>" + page + "</span>...\n");
                scrollTerminal();
                setTimeout(function () { navigate(routes[page]); }, 600);
                return null;
            }
            return "\n  <span class='t-error'>Unknown page:</span> " + escapeHtml(page || "(none)") +
                "\n  <span class='t-muted'>Available:</span> home, work, writing, about, now, contact, updates\n";
        },

        uptime: function () {
            var elapsed = Date.now() - bootTime;
            var s = Math.floor(elapsed / 1000) % 60;
            var m = Math.floor(elapsed / 60000) % 60;
            var h = Math.floor(elapsed / 3600000);
            var days = Math.floor(elapsed / 86400000);
            var parts = [];
            if (days) parts.push(days + "d");
            parts.push(h + "h " + m + "m " + s + "s");
            return "\n  Session uptime: <span class='t-accent'>" + parts.join(" ") + "</span>\n  Load average: 0.42, 0.38, 0.31\n  Memory: <span class='t-success'>OK</span>\n";
        },

        whoami: function () {
            return [
                "",
                "  <span class='t-accent'>visitor</span>@marcoladeira.github.io",
                "  <span class='t-muted'>uid=1000(visitor) gid=1000(guests) groups=1000(guests),27(curious)</span>",
                "  <span class='t-muted'>Shell: /bin/portfolio-sh</span>",
                "  <span class='t-muted'>Home: ~/marcoladeira.github.io</span>",
                ""
            ].join("\n");
        },

        whereami: function () {
            var path = window.location.pathname || "/";
            return "\n  <span class='t-accent'>" + path + "</span>\n  <span class='t-muted'>" + window.location.href + "</span>\n";
        },

        date: function () {
            var d = new Date();
            return "\n  " + d.toLocaleDateString("en-IE", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) +
                "\n  " + d.toLocaleTimeString("en-IE") +
                "\n  <span class='t-muted'>Timezone: " + Intl.DateTimeFormat().resolvedOptions().timeZone + "</span>\n";
        },

        echo: function (args) {
            return args.join(" ") || "";
        },

        neofetch: function () {
            var isDark = document.documentElement.getAttribute("data-theme") === "dark";
            var uptime = Date.now() - bootTime;
            var m = Math.floor(uptime / 60000);
            return [
                "",
                "  <span class='t-accent'>       ╭──────────────╮</span>   <span class='t-highlight'>visitor</span>@<span class='t-accent'>marcoladeira.github.io</span>",
                "  <span class='t-accent'>       │              │</span>   ────────────────────────────",
                "  <span class='t-accent'>       │   ◆  M  ◆    │</span>   <span class='t-muted'>OS:</span> GitHub Pages (static)",
                "  <span class='t-accent'>       │   ◆  L  ◆    │</span>   <span class='t-muted'>Host:</span> github.com",
                "  <span class='t-accent'>       │   ◆  .  ◆    │</span>   <span class='t-muted'>Kernel:</span> HTML5/CSS3/ES6",
                "  <span class='t-accent'>       │              │</span>   <span class='t-muted'>Uptime:</span> " + m + " min",
                "  <span class='t-accent'>       ╰──────────────╯</span>   <span class='t-muted'>Packages:</span> 0 (vanilla)",
                "                            <span class='t-muted'>Shell:</span> portfolio-sh 2.0",
                "                            <span class='t-muted'>Resolution:</span> " + window.innerWidth + "x" + window.innerHeight,
                "                            <span class='t-muted'>Theme:</span> " + (isDark ? "Midnight Dark" : "Warm Light") + " [" + (isDark ? "dark" : "light") + "]",
                "                            <span class='t-muted'>Font:</span> Inter + Inter Tight",
                "                            <span class='t-muted'>Terminal:</span> portfolio-terminal v2.0",
                "                            <span class='t-muted'>CPU:</span> Visitor Brain @ ∞MHz",
                "                            <span class='t-muted'>Memory:</span> ∞ / ∞ MiB",
                "",
                "                            <span style='color:#ff5f57'>███</span><span style='color:#febc2e'>███</span><span style='color:#28c840'>███</span><span style='color:#7d96ff'>███</span><span style='color:#c678dd'>███</span><span style='color:#e5c07b'>███</span><span style='color:#98c379'>███</span>",
                ""
            ].join("\n");
        },

        weather: function () {
            var conditions = [
                { icon: "🌧️", desc: "Overcast with light rain", temp: "12°C" },
                { icon: "☁️", desc: "Mostly cloudy", temp: "14°C" },
                { icon: "🌦️", desc: "Partly cloudy, chance of rain", temp: "13°C" },
                { icon: "🌤️", desc: "Surprisingly sunny", temp: "16°C" },
                { icon: "🌧️", desc: "Rain (it's Dublin, what did you expect?)", temp: "11°C" }
            ];
            var w = conditions[Math.floor(Math.random() * conditions.length)];
            return [
                "",
                "  <span class='t-accent'>Weather — Dublin, Ireland</span>",
                "  ─────────────────────────────",
                "  " + w.icon + "  " + w.desc,
                "  Temperature: <span class='t-highlight'>" + w.temp + "</span>",
                "  Humidity: 78%",
                "  Wind: 15 km/h W",
                "  <span class='t-muted'>Source: definitely-real-weather-api.io</span>",
                ""
            ].join("\n");
        },

        joke: function () {
            var jokes = [
                ["Why do programmers prefer dark mode?", "Because light attracts bugs."],
                ["What's a programmer's favorite hangout place?", "Foo Bar."],
                ["Why was the JavaScript developer sad?", "Because he didn't Node how to Express himself."],
                ["How many programmers does it take to change a light bulb?", "None. That's a hardware problem."],
                ["Why do Java developers wear glasses?", "Because they don't C#."],
                ["What's a developer's least favorite tea?", "NullPointerExcep-tea."],
                ["Why did the developer go broke?", "Because he used up all his cache."],
                ["What did the C# dev say to the Java dev?", "You have no class. Wait... you have too many classes."],
                [".NET or Node for the backend?", "Yes."],
                ["A SQL statement walks into a bar, sees two tables and asks...", "'Can I JOIN you?'"],
                ["Why did the developer quit his job?", "Because he didn't get arrays."],
                ["What's a backend developer's favorite movie?", "The Server Strikes Back."]
            ];
            var j = jokes[Math.floor(Math.random() * jokes.length)];
            return "\n  <span class='t-highlight'>" + j[0] + "</span>\n  " + j[1] + "\n";
        },

        quote: function () {
            var quotes = [
                ["Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", "Martin Fowler"],
                ["First, solve the problem. Then, write the code.", "John Johnson"],
                ["The best error message is the one that never shows up.", "Thomas Fuchs"],
                ["Code is like humor. When you have to explain it, it's bad.", "Cory House"],
                ["Simplicity is the soul of efficiency.", "Austin Freeman"],
                ["Make it work, make it right, make it fast.", "Kent Beck"],
                ["Programs must be written for people to read, and only incidentally for machines to execute.", "Abelson & Sussman"],
                ["The most dangerous phrase in the English language is 'we've always done it this way.'", "Grace Hopper"],
                ["Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", "Antoine de Saint-Exupéry"],
                ["Talk is cheap. Show me the code.", "Linus Torvalds"]
            ];
            var q = quotes[Math.floor(Math.random() * quotes.length)];
            return "\n  <span class='t-muted'>\"</span><span class='t-highlight'>" + q[0] + "</span><span class='t-muted'>\"</span>\n  <span class='t-muted'>— " + q[1] + "</span>\n";
        },

        fortune: function () {
            var fortunes = [
                "Your next deployment will go smoothly. Just kidding, check the logs.",
                "A great refactor is in your future. But first, write the tests.",
                "You will find the bug. It was a missing semicolon all along.",
                "The code review you're dreading will actually go well.",
                "Today is a good day to push to main. But maybe open a PR first.",
                "An unexpected 'undefined' will teach you something valuable.",
                "Your future self will thank you for that comment you almost didn't write.",
                "The API you need will have excellent documentation. (fortune cookies can lie)",
                "You will achieve inbox zero. For about 47 seconds."
            ];
            var f = fortunes[Math.floor(Math.random() * fortunes.length)];
            return "\n  🥠 <span class='t-highlight'>" + f + "</span>\n";
        },

        cowsay: function (args) {
            var text = args.join(" ") || "Moo! I'm a cow on a portfolio website.";
            if (text.length > 50) text = text.substring(0, 50);
            var border = "─".repeat(text.length + 2);
            return [
                "",
                "  ┌" + border + "┐",
                "  │ " + text + " │",
                "  └" + border + "┘",
                "         \\   ^__^",
                "          \\  (oo)\\_______",
                "             (__)\\       )\\/\\",
                "                 ||----w |",
                "                 ||     ||",
                ""
            ].join("\n");
        },

        ascii: function () {
            var arts = [
                [
                    "",
                    "  <span class='t-accent'>    ███╗   ███╗ ██╗</span>",
                    "  <span class='t-accent'>    ████╗ ████║ ██║</span>",
                    "  <span class='t-accent'>    ██╔████╔██║ ██║</span>",
                    "  <span class='t-accent'>    ██║╚██╔╝██║ ██║</span>",
                    "  <span class='t-accent'>    ██║ ╚═╝ ██║ ███████╗</span>",
                    "  <span class='t-accent'>    ╚═╝     ╚═╝ ╚══════╝</span>",
                    "",
                    "  <span class='t-muted'>ML · Software Engineer</span>",
                    ""
                ],
                [
                    "",
                    "  <span class='t-success'>     ╔═══╗</span>",
                    "  <span class='t-success'>     ║ > ║</span>  <span class='t-muted'>Building enterprise software</span>",
                    "  <span class='t-success'>     ║ _ ║</span>  <span class='t-muted'>one commit at a time.</span>",
                    "  <span class='t-success'>     ╚═══╝</span>",
                    ""
                ]
            ];
            return arts[Math.floor(Math.random() * arts.length)].join("\n");
        },

        ping: function (args) {
            var host = args[0] || "marcoladeira.github.io";
            host = escapeHtml(host);
            var lines = ["\n  <span class='t-muted'>PING " + host + " (185.199.108.153) 56(84) bytes of data.</span>"];
            for (var i = 0; i < 4; i++) {
                var ms = (Math.random() * 20 + 5).toFixed(1);
                lines.push("  64 bytes from " + host + ": icmp_seq=" + (i + 1) + " ttl=57 time=<span class='t-accent'>" + ms + "</span> ms");
            }
            lines.push("");
            lines.push("  <span class='t-muted'>--- " + host + " ping statistics ---</span>");
            lines.push("  4 packets transmitted, <span class='t-success'>4 received</span>, 0% packet loss");
            lines.push("");
            return lines.join("\n");
        },

        traceroute: function () {
            return [
                "",
                "  <span class='t-muted'>traceroute to marcoladeira.github.io, 30 hops max</span>",
                "",
                "   1  <span class='t-muted'>visitor-device</span>       0.2 ms",
                "   2  <span class='t-muted'>local-router</span>         1.4 ms",
                "   3  <span class='t-muted'>isp-gateway</span>          8.2 ms",
                "   4  <span class='t-muted'>edge-cdn-01.github</span>  12.6 ms",
                "   5  <span class='t-success'>pages-lb.github.io</span>    14.3 ms",
                "   6  <span class='t-accent'>marcoladeira.github.io</span>  <span class='t-accent'>15.1 ms</span>  ✓",
                "",
                "  <span class='t-success'>Connection established.</span> Welcome to the portfolio.",
                ""
            ].join("\n");
        },

        whois: function () {
            return [
                "",
                "  <span class='t-accent'>Domain: marcoladeira.github.io</span>",
                "  ─────────────────────────────",
                "  Registrant:    ML",
                "  Organization:  Personal Portfolio",
                "  Location:      Dublin, Ireland",
                "  Platform:      GitHub Pages",
                "  Status:        <span class='t-success'>ACTIVE</span>",
                "  Created:       2025",
                "  Tech Stack:    HTML/CSS/JS (no frameworks)",
                "  Easter Eggs:   <span class='t-warning'>Several</span>",
                ""
            ].join("\n");
        },

        fetch: function (args) {
            var url = args[0] || "/api/portfolio";
            url = escapeHtml(url);
            return [
                "",
                "  <span class='t-muted'>$ curl -s " + url + "</span>",
                "",
                "  HTTP/1.1 <span class='t-success'>200 OK</span>",
                "  Content-Type: application/json",
                "  X-Powered-By: Coffee",
                "  X-Engineer: ML",
                "",
                "  {",
                "    <span class='t-accent'>\"status\"</span>: <span class='t-success'>\"online\"</span>,",
                "    <span class='t-accent'>\"engineer\"</span>: <span class='t-highlight'>\"ML\"</span>,",
                "    <span class='t-accent'>\"available_for\"</span>: <span class='t-highlight'>\"interesting problems\"</span>,",
                "    <span class='t-accent'>\"coffee_consumed\"</span>: " + Math.floor(Math.random() * 900 + 100) + ",",
                "    <span class='t-accent'>\"bugs_squashed\"</span>: " + Math.floor(Math.random() * 9000 + 1000) + ",",
                "    <span class='t-accent'>\"response\"</span>: <span class='t-highlight'>\"Thanks for visiting!\"</span>",
                "  }",
                ""
            ].join("\n");
        },

        matrix: function () {
            startMatrixEffect();
            return "\n  <span class='t-success'>Entering the matrix...</span> (Press any key to exit)\n";
        },

        sudo: function (args) {
            if (args.join(" ").toLowerCase().includes("hire")) {
                return [
                    "",
                    "  <span class='t-success'>✓ REQUEST APPROVED</span>",
                    "",
                    "  That's the right command.",
                    "  Email: marcoladeiraworkemail@gmail.com",
                    ""
                ].join("\n");
            }
            return [
                "",
                "  <span class='t-error'>▸ Permission denied.</span>",
                "",
                "  This terminal runs in user mode.",
                "  You'll need to submit a pull request for root access.",
                "",
                "  <span class='t-muted'>Hint: try `sudo hire marco`</span>",
                ""
            ].join("\n");
        },

        "rm": function (args) {
            if (args.join(" ").includes("-rf")) {
                return [
                    "",
                    "  <span class='t-error'>🚨 OPERATION BLOCKED</span>",
                    "",
                    "  rm -rf is disabled on this system.",
                    "  The portfolio is backed up in 3 locations.",
                    "  The CI/CD pipeline is watching.",
                    "",
                    "  <span class='t-muted'>...nice try though. Points for audacity.</span>",
                    ""
                ].join("\n");
            }
            return "  rm: missing operand";
        },

        coffee: function () {
            return [
                "",
                "  <span class='t-warning'>    ( (</span>",
                "  <span class='t-warning'>     ) )</span>",
                "  <span class='t-warning'>  .........  </span>",
                "  <span class='t-muted'>  |       |]</span>",
                "  <span class='t-muted'>  \\       /</span>",
                "  <span class='t-muted'>   `-----'</span>",
                "",
                "  <span class='t-highlight'>Here's your coffee. ☕</span>",
                "  Essential fuel for late-night deploys.",
                "",
                "  <span class='t-muted'>Coffee count today: " + (Math.floor(Math.random() * 4) + 2) + " cups</span>",
                "  <span class='t-muted'>Optimal caffeine level: ████████░░ 80%</span>",
                ""
            ].join("\n");
        },

        sl: function () {
            var train = [
                "",
                "  <span class='t-muted'>      ====        ________                ___________</span>",
                "  <span class='t-muted'>  _D _|  |_______/        \\__I_I_____===__|_________|</span>",
                "  <span class='t-muted'>   |(_)---  |   H\\________/ |   |        =|___ ___|</span>",
                "  <span class='t-muted'>   /     |  |   H  |  |     |   |         ||_| |_||</span>",
                "  <span class='t-muted'>  |      |  |   H  |__--------------------| [___] |</span>",
                "  <span class='t-muted'>  | ________|___H__/__|_____/[][]~\\_______|       |</span>",
                "  <span class='t-muted'>  |/ |   |-----------I_____I [][] []  D   |=======|__</span>",
                "",
                "  <span class='t-highlight'>🚂 You meant 'ls', didn't you?</span>",
                "  <span class='t-muted'>But here's a train anyway.</span>",
                ""
            ];
            return train.join("\n");
        },

        htop: function () {
            return [
                "",
                "  <span class='t-accent'>  PID  USER     PRI  VIRT   RES   CPU%  MEM%  TIME    COMMAND</span>",
                "  <span class='t-success'>    1  marco    20   512M   128M  2.1   3.2   0:42.1  portfolio-engine</span>",
                "  <span class='t-success'>   12  marco    20   256M    64M  1.4   1.6   0:18.3  animation-loop</span>",
                "  <span class='t-success'>   23  marco    20   128M    32M  0.8   0.8   0:09.7  theme-manager</span>",
                "  <span class='t-success'>   34  visitor  20    64M    16M  0.3   0.4   0:02.1  terminal-session</span>",
                "  <span class='t-muted'>   45  marco    20    32M     8M  0.1   0.2   0:00.4  scroll-observer</span>",
                "  <span class='t-muted'>   56  marco    20    16M     4M  0.0   0.1   0:00.1  easter-egg-watcher</span>",
                "",
                "  <span class='t-muted'>Tasks: 6 total, 4 running, 2 sleeping</span>",
                "  <span class='t-muted'>CPU: </span><span class='t-success'>████</span><span class='t-muted'>░░░░░░░░░░░░░░░░ 4.7%</span>",
                "  <span class='t-muted'>Mem: </span><span class='t-accent'>██████</span><span class='t-muted'>░░░░░░░░░░░░░░ 6.3%</span>",
                ""
            ].join("\n");
        },

        lscpu: function () {
            return [
                "",
                "  <span class='t-accent'>Architecture:</span>       portfolio-64",
                "  <span class='t-accent'>CPU(s):</span>             ∞",
                "  <span class='t-accent'>Model name:</span>         Visitor Brain v" + new Date().getFullYear(),
                "  <span class='t-accent'>Thread(s) per core:</span> however many tabs you have open",
                "  <span class='t-accent'>CPU MHz:</span>            caffeine-dependent",
                "  <span class='t-accent'>Cache:</span>              localStorage + good vibes",
                "  <span class='t-accent'>Flags:</span>              curiosity enthusiasm good-taste",
                ""
            ].join("\n");
        },

        df: function () {
            return [
                "",
                "  <span class='t-accent'>Filesystem       Size   Used  Avail  Use%  Mounted on</span>",
                "  /dev/portfolio   ∞      42K   ∞      0%    /",
                "  /dev/creativity  ∞      ∞     0      100%  /ideas",
                "  /dev/coffee      5L     4.2L  0.8L   84%   /fuel",
                "  /dev/bugs        100    0     100    0%    /dev/null",
                ""
            ].join("\n");
        },

        tree: function () {
            return [
                "",
                "  <span class='t-accent'>marcoladeira.github.io/</span>",
                "  ├── <span class='t-highlight'>index.html</span>",
                "  ├── <span class='t-muted'>styles.css</span>",
                "  ├── <span class='t-muted'>script.js</span>",
                "  ├── <span class='t-muted'>interactive.js</span>",
                "  ├── <span class='t-highlight'>work/</span>",
                "  │   └── index.html",
                "  ├── <span class='t-highlight'>writing/</span>",
                "  │   ├── index.html",
                "  │   ├── hybrid-workflow-cli-mcp-agents/",
                "  │   └── software-engineering-in-the-age-of-ai/",
                "  ├── <span class='t-highlight'>updates/</span>",
                "  │   ├── index.html",
                "  │   ├── aws-ml-specialty-and-current-ai-focus/",
                "  │   ├── fenergo-ai-initiative/",
                "  │   └── first-months-at-fenergo/",
                "  ├── <span class='t-highlight'>about/</span>",
                "  │   └── index.html",
                "  ├── <span class='t-highlight'>now/</span>",
                "  │   └── index.html",
                "  ├── <span class='t-highlight'>contact/</span>",
                "  │   └── index.html",
                "  ├── <span class='t-muted'>404.html</span>",
                "  ├── <span class='t-muted'>sitemap.xml</span>",
                "  ├── <span class='t-muted'>feed.xml</span>",
                "  └── <span class='t-muted'>robots.txt</span>",
                "",
                "  <span class='t-muted'>8 directories, 16 files</span>",
                ""
            ].join("\n");
        },

        gitstatus: function () {
            return [
                "",
                "  <span class='t-muted'>On branch</span> <span class='t-accent'>main</span>",
                "  <span class='t-muted'>Your branch is up to date with</span> <span class='t-accent'>origin/main</span>",
                "",
                "  <span class='t-success'>nothing to commit, working tree clean</span>",
                "",
                "  <span class='t-muted'>Last commit:</span> feat: add interactive terminal with 50+ commands",
                "  <span class='t-muted'>Author:</span> ML",
                "  <span class='t-muted'>Date:</span>   " + new Date().toLocaleDateString("en-IE"),
                ""
            ].join("\n");
        },

        deploy: function () {
            appendOutput("\n  <span class='t-muted'>Initiating deployment pipeline...</span>");
            scrollTerminal();
            var steps = [
                { text: "  <span class='t-success'>✓</span> Running lint checks...", delay: 400 },
                { text: "  <span class='t-success'>✓</span> Building static assets...", delay: 600 },
                { text: "  <span class='t-success'>✓</span> Optimizing images...", delay: 300 },
                { text: "  <span class='t-success'>✓</span> Running accessibility audit...", delay: 500 },
                { text: "  <span class='t-success'>✓</span> Pushing to GitHub Pages...", delay: 700 },
                { text: "", delay: 200 },
                { text: "  <span class='t-accent'>🚀 Deployment complete!</span>", delay: 0 },
                { text: "  <span class='t-muted'>Site live at: marcoladeira.github.io</span>", delay: 0 },
                { text: "", delay: 0 }
            ];

            var totalDelay = 200;
            steps.forEach(function (step) {
                totalDelay += step.delay;
                setTimeout(function () {
                    appendOutput(step.text);
                    scrollTerminal();
                }, totalDelay);
            });

            return null;
        },

        hist: function () {
            if (terminalHistory.length === 0) return "\n  <span class='t-muted'>No commands in history.</span>\n";
            var lines = ["\n  <span class='t-accent'>COMMAND HISTORY</span>", ""];
            var shown = terminalHistory.slice(0, 20);
            shown.forEach(function (cmd, i) {
                lines.push("  <span class='t-muted'>" + String(shown.length - i).padStart(4) + "</span>  " + escapeHtml(cmd));
            });
            lines.push("");
            return lines.join("\n");
        },

        repo: function () {
            window.open("https://github.com/MarcoLadeira/MarcoLadeira.github.io", "_blank");
            return "\n  <span class='t-success'>→</span> Opening source code on GitHub...\n";
        },

        banner: function () {
            return buildBootBanner();
        },

        grep: function (args) {
            var term = args.join(" ").toLowerCase();
            if (!term) return "\n  <span class='t-error'>Usage:</span> grep [search term]\n";
            var pages = {
                "home": "Enterprise software, practical AI, and product judgment",
                "work": "Fenergo, NASA Space Explorer, Achievr, Explorer VR",
                "writing": "Hybrid AI workflow, software engineering in the age of AI",
                "about": "Platform engineering, product clarity, C#, TypeScript",
                "now": "Fenergo, CQRS, event sourcing, MCP tooling, AWS ML",
                "updates": "Fenergo AI initiative, AWS ML Specialty, first months",
                "contact": "Email, LinkedIn, GitHub"
            };
            var results = [];
            Object.keys(pages).forEach(function (page) {
                if (pages[page].toLowerCase().includes(term)) {
                    results.push("  <span class='t-accent'>/" + page + "/</span>: ..." + pages[page].substring(0, 60) + "...");
                }
            });
            if (results.length === 0) return "\n  <span class='t-muted'>No matches for:</span> " + escapeHtml(term) + "\n";
            return "\n  <span class='t-accent'>Search results for:</span> " + escapeHtml(term) + "\n\n" + results.join("\n") + "\n";
        },

        vim: function () {
            return [
                "",
                "  <span class='t-error'>Not that kind of terminal.</span>",
                "",
                "  This is a portfolio, not a code editor.",
                "  But I respect the muscle memory.",
                "",
                "  <span class='t-muted'>To exit vim: :q! (you knew that though)</span>",
                ""
            ].join("\n");
        },

        install: function (args) {
            var pkg = args.join(" ") || "dependencies";
            return [
                "",
                "  <span class='t-muted'>Installing " + escapeHtml(pkg) + "...</span>",
                "",
                "  <span class='t-error'>Error:</span> This website has zero dependencies.",
                "  No node_modules. No package.json. No build step.",
                "  Just HTML, CSS, and JavaScript.",
                "",
                "  <span class='t-success'>This is the way.</span>",
                ""
            ].join("\n");
        },

        colors: function () {
            var isDark = document.documentElement.getAttribute("data-theme") === "dark";
            return [
                "",
                "  <span class='t-accent'>COLOR PALETTE</span> — " + (isDark ? "Dark" : "Light") + " theme",
                "  ─────────────────────────────",
                "",
                "  <span class='t-accent'>████</span>  Accent   " + (isDark ? "#7d96ff" : "#1a1a1a"),
                "  <span class='t-highlight'>████</span>  Highlight #ffd866",
                "  <span class='t-success'>████</span>  Success  #28c840",
                "  <span class='t-warning'>████</span>  Warning  #febc2e",
                "  <span class='t-error'>████</span>  Error    #ff5f57",
                "  <span class='t-muted'>████</span>  Muted    " + (isDark ? "#8a91a3" : "#7c8190"),
                "",
                "  <span class='t-muted'>Background:</span> " + (isDark ? "#0b0d11" : "#f8f6f1"),
                "  <span class='t-muted'>Surface:</span>    " + (isDark ? "#12151b" : "#ffffff"),
                "  <span class='t-muted'>Fonts:</span>      Inter + Inter Tight",
                ""
            ].join("\n");
        },

        flip: function () {
            return "\n  (╯°□°)╯︵ ┻━┻\n";
        },

        unflip: function () {
            return "\n  ┬─┬ノ( º _ ºノ)\n";
        },

        shrug: function () {
            return "\n  ¯\\_(ツ)_/¯\n";
        },

        resume: function () {
            return [
                "",
                "<span class='t-section'>RESUME</span>",
                "",
                "<span class='t-accent'>Marco Ladeira</span>",
                "<span class='t-muted'>Software Engineer · Dublin, Ireland</span>",
                "",
                "<span class='t-highlight'>Experience</span>",
                "  <span class='t-accent'>Software Engineer</span> — Fenergo         <span class='t-muted'>Sep 2025 – present</span>",
                "    Enterprise SaaS for financial compliance.",
                "    CQRS, EventStoreDB, DynamoDB, event-driven architecture.",
                "    Selected for Fenergo's first AI initiative (MCP tooling + LLM workflows).",
                "",
                "<span class='t-highlight'>Education</span>",
                "  <span class='t-accent'>BSc Computer Science</span> — TU Dublin    <span class='t-muted'>2021 – 2025</span>",
                "    Software Engineering, Machine Learning, Cloud Computing, VR Systems.",
                "",
                "<span class='t-highlight'>Certifications</span>",
                "  <span class='t-success'>✓</span> AWS Machine Learning — Specialty   <span class='t-muted'>2026</span>",
                "",
                "<span class='t-highlight'>Core Stack</span>",
                "  C# / .NET · TypeScript · Node.js · React · Python",
                "  CQRS · Event Sourcing · DDD · Microservices",
                "  AWS · EventStoreDB · DynamoDB · PostgreSQL",
                "  LLMs · MCP · LangChain · RAG",
                "",
                "<span class='t-muted'>Full PDF: /contact → Download resume</span>",
                ""
            ].join("\n");
        },

        blog: function () {
            return [
                "",
                "<span class='t-section'>RECENT WRITING</span>",
                "",
                "  <span class='t-accent'>1.</span> The best AI workflow is hybrid          <span class='t-muted'>2025</span>",
                "     <span class='t-muted'>CLI + MCP + agents for real-world dev workflows</span>",
                "",
                "  <span class='t-accent'>2.</span> Software engineering in the age of AI   <span class='t-muted'>2025</span>",
                "     <span class='t-muted'>Systems judgment over prompt engineering</span>",
                "",
                "<span class='t-section'>RECENT UPDATES</span>",
                "",
                "  <span class='t-accent'>•</span> Fenergo AI initiative                   <span class='t-muted'>2025</span>",
                "  <span class='t-accent'>•</span> AWS ML Specialty and current AI focus    <span class='t-muted'>2025</span>",
                "  <span class='t-accent'>•</span> First months at Fenergo                 <span class='t-muted'>2025</span>",
                "",
                "<span class='t-muted'>Read more: goto writing</span>",
                ""
            ].join("\n");
        },

        links: function () {
            return [
                "",
                "<span class='t-section'>LINKS</span>",
                "",
                "  <span class='t-accent'>Email</span>      marcoladeiraworkemail@gmail.com",
                "  <span class='t-accent'>LinkedIn</span>   linkedin.com/in/marco-ladeira",
                "  <span class='t-accent'>GitHub</span>     github.com/MarcoLadeira",
                "  <span class='t-accent'>Site</span>       marcoladeira.github.io",
                "",
                "<span class='t-muted'>Type</span> <span class='t-accent'>contact</span> <span class='t-muted'>for more details</span>",
                ""
            ].join("\n");
        },

        scan: function () {
            var scores = {
                performance: 90 + Math.floor(Math.random() * 8),
                accessibility: 93 + Math.floor(Math.random() * 7),
                bestPractices: 91 + Math.floor(Math.random() * 9),
                seo: 95 + Math.floor(Math.random() * 5)
            };
            function bar(score) {
                var filled = Math.round(score / 5);
                var empty = 20 - filled;
                var color = score >= 90 ? "t-success" : score >= 70 ? "t-warning" : "t-error";
                return "<span class='" + color + "'>" + "█".repeat(filled) + "</span>" + "<span class='t-muted'>" + "░".repeat(empty) + "</span> " + "<span class='" + color + "'>" + score + "</span>";
            }
            return [
                "",
                "<span class='t-section'>SITE AUDIT</span>  <span class='t-muted'>marcoladeira.github.io</span>",
                "",
                "  Performance    " + bar(scores.performance),
                "  Accessibility  " + bar(scores.accessibility),
                "  Best Practices " + bar(scores.bestPractices),
                "  SEO            " + bar(scores.seo),
                "",
                "<span class='t-muted'>Zero dependencies · Static HTML/CSS/JS · GitHub Pages</span>",
                "<span class='t-muted'>Inter + Inter Tight · Custom design system · Dark mode</span>",
                ""
            ].join("\n");
        },

        changelog: function () {
            return [
                "",
                "<span class='t-section'>CHANGELOG</span>",
                "",
                "  <span class='t-accent'>v2.1</span>  Contact chat widget, 404 redesign, manifest.json  <span class='t-muted'>Jul 2025</span>",
                "  <span class='t-accent'>v2.0</span>  Terminal 50+ cmds, command palette, interactive layer  <span class='t-muted'>Jul 2025</span>",
                "  <span class='t-accent'>v1.5</span>  AI chat, LinkedIn sync, UI simplification  <span class='t-muted'>Jul 2025</span>",
                "  <span class='t-accent'>v1.0</span>  Initial portfolio — minimalist design  <span class='t-muted'>Jun 2025</span>",
                ""
            ].join("\n");
        },

        clear: function () {
            if (terminalOutput) terminalOutput.innerHTML = "";
            return null;
        },

        exit: function () {
            appendOutput("\n  <span class='t-muted'>Goodbye. Session terminated.</span>\n");
            scrollTerminal();
            setTimeout(closeTerminal, 400);
            return null;
        }
    };

    function buildBootBanner() {
        return [
            "",
            "<span class='t-accent'>  ╔══════════════════════════════════════════════╗</span>",
            "<span class='t-accent'>  ║</span>                                              <span class='t-accent'>║</span>",
            "<span class='t-accent'>  ║</span>   <span class='t-highlight'>Portfolio Terminal</span> <span class='t-muted'>v2.0</span>                   <span class='t-accent'>║</span>",
            "<span class='t-accent'>  ║</span>                                              <span class='t-accent'>║</span>",
            "<span class='t-accent'>  ║</span>   <span class='t-muted'>Type</span> <span class='t-accent'>help</span> <span class='t-muted'>for commands</span>                      <span class='t-accent'>║</span>",
            "<span class='t-accent'>  ║</span>   <span class='t-muted'>Tab to autocomplete · ↑↓ for history</span>       <span class='t-accent'>║</span>",
            "<span class='t-accent'>  ║</span>                                              <span class='t-accent'>║</span>",
            "<span class='t-accent'>  ╚══════════════════════════════════════════════╝</span>",
            ""
        ].join("\n");
    }

    function buildTerminal() {
        terminalEl = document.createElement("div");
        terminalEl.className = "dev-terminal";
        terminalEl.setAttribute("role", "dialog");
        terminalEl.setAttribute("aria-label", "Interactive terminal");
        terminalEl.innerHTML =
            '<div class="dev-terminal__header">' +
                '<div class="dev-terminal__dots">' +
                    '<span class="dot dot--red"></span>' +
                    '<span class="dot dot--yellow"></span>' +
                    '<span class="dot dot--green"></span>' +
                '</div>' +
                '<span class="dev-terminal__title">marco@portfolio ~ zsh</span>' +
                '<button class="dev-terminal__close" aria-label="Close terminal">×</button>' +
            '</div>' +
            '<div class="dev-terminal__body">' +
                '<div class="dev-terminal__output"></div>' +
                '<div class="dev-terminal__prompt">' +
                    '<span class="dev-terminal__ps1"><span class="t-accent">marco</span><span class="t-muted">@</span><span class="t-highlight">portfolio</span> <span class="t-success">~</span> <span class="t-muted">$</span>&nbsp;</span>' +
                    '<input class="dev-terminal__input" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal input">' +
                '</div>' +
            '</div>';

        document.body.appendChild(terminalEl);
        terminalOutput = terminalEl.querySelector(".dev-terminal__output");
        terminalInput = terminalEl.querySelector(".dev-terminal__input");

        terminalEl.querySelector(".dev-terminal__close").addEventListener("click", closeTerminal);
        terminalEl.querySelector(".dot--red").addEventListener("click", closeTerminal);

        // Click body to focus input
        terminalEl.querySelector(".dev-terminal__body").addEventListener("click", function (e) {
            if (e.target === terminalInput) return;
            terminalInput.focus();
        });

        terminalInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                executeCommand(terminalInput.value);
                terminalInput.value = "";
                historyIndex = -1;
                tabState.lastInput = "";
            } else if (e.key === "Tab") {
                e.preventDefault();
                handleTabComplete();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (terminalHistory.length > 0) {
                    historyIndex = Math.min(historyIndex + 1, terminalHistory.length - 1);
                    terminalInput.value = terminalHistory[historyIndex];
                    // Move cursor to end
                    setTimeout(function () { terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length; }, 0);
                }
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                historyIndex = Math.max(historyIndex - 1, -1);
                terminalInput.value = historyIndex >= 0 ? terminalHistory[historyIndex] : "";
            } else if (e.key === "Escape") {
                closeTerminal();
            } else if (e.key === "l" && e.ctrlKey) {
                e.preventDefault();
                terminalOutput.innerHTML = "";
            } else if (e.key === "c" && e.ctrlKey) {
                e.preventDefault();
                appendOutput(
                    "<span class='t-accent'>marco</span><span class='t-muted'>@</span><span class='t-highlight'>portfolio</span> <span class='t-success'>~</span> <span class='t-muted'>$</span> " +
                    escapeHtml(terminalInput.value) + "<span class='t-error'>^C</span>"
                );
                terminalInput.value = "";
                scrollTerminal();
            } else {
                // Reset tab state on any other key
                tabState.lastInput = "";
            }
        });

        // Animated boot sequence
        runBootSequence();
    }

    function runBootSequence() {
        var steps = [
            { text: "<span class='t-muted'>  Initializing portfolio-sh v2.0...</span>", delay: 0 },
            { text: "<span class='t-muted'>  Loading modules: </span><span class='t-success'>profile</span> <span class='t-success'>skills</span> <span class='t-success'>projects</span> <span class='t-success'>easter-eggs</span>", delay: 150 },
            { text: "<span class='t-muted'>  Establishing connection...</span> <span class='t-success'>OK</span>", delay: 250 },
            { text: "", delay: 50 },
            { text: buildBootBanner(), delay: 100 }
        ];

        var totalDelay = 0;
        steps.forEach(function (step) {
            totalDelay += step.delay;
            setTimeout(function () {
                appendOutput(step.text);
                scrollTerminal();
            }, totalDelay);
        });

        // Focus after boot
        setTimeout(function () { terminalInput.focus(); }, totalDelay + 50);
    }

    function handleTabComplete() {
        var current = terminalInput.value.toLowerCase().trim();
        if (!current) return;

        // If different input from last tab, reset
        if (current !== tabState.lastInput) {
            tabState.lastInput = current;
            tabState.matches = ALL_COMMANDS.filter(function (cmd) {
                return cmd.startsWith(current);
            });
            tabState.index = 0;
        }

        if (tabState.matches.length === 0) return;

        if (tabState.matches.length === 1) {
            terminalInput.value = tabState.matches[0];
            tabState.lastInput = tabState.matches[0];
        } else {
            // Cycle on repeated tab
            terminalInput.value = tabState.matches[tabState.index];
            tabState.lastInput = current; // Keep the original prefix for cycling
            tabState.index = (tabState.index + 1) % tabState.matches.length;

            // Show all matches on first tab
            if (tabState.index === 1) {
                appendOutput("<span class='t-muted'>  " + tabState.matches.join("  ") + "</span>");
                scrollTerminal();
            }
        }
    }

    function executeCommand(raw) {
        var input = raw.trim();
        if (!input) return;

        terminalHistory.unshift(input);
        if (terminalHistory.length > 100) terminalHistory.pop();

        // Echo the command
        appendOutput(
            "<span class='t-accent'>marco</span><span class='t-muted'>@</span><span class='t-highlight'>portfolio</span> <span class='t-success'>~</span> <span class='t-muted'>$</span> " +
            escapeHtml(input)
        );

        var parts = input.split(/\s+/);
        var cmd = parts[0].toLowerCase();
        var args = parts.slice(1);

        // Check aliases
        if (cmdAliases[cmd]) {
            cmd = cmdAliases[cmd];
        }

        // Handle rm -rf as a special combined command
        if (cmd === "rm") {
            var result = terminalCommands["rm"](args);
            if (result !== null) appendOutput(result);
            scrollTerminal();
            return;
        }

        var handler = terminalCommands[cmd];
        if (handler) {
            var result = handler(args);
            if (result !== null && result !== undefined) {
                appendOutput(result);
            }
        } else {
            appendOutput(
                "\n  <span class='t-error'>command not found:</span> " + escapeHtml(cmd) +
                "\n  <span class='t-muted'>Type</span> <span class='t-accent'>help</span> <span class='t-muted'>for available commands, or press Tab to autocomplete.</span>\n"
            );
        }

        scrollTerminal();
    }

    function appendOutput(html) {
        var div = document.createElement("div");
        div.className = "dev-terminal__line";
        div.innerHTML = html;
        terminalOutput.appendChild(div);
    }

    function scrollTerminal() {
        requestAnimationFrame(function () {
            var body = terminalEl.querySelector(".dev-terminal__body");
            body.scrollTop = body.scrollHeight;
        });
    }

    function openTerminal() {
        if (!terminalEl) buildTerminal();
        terminalOpen = true;
        terminalEl.classList.add("is-open");
        requestAnimationFrame(function () { terminalInput.focus(); });
    }

    function closeTerminal() {
        if (!terminalEl) return;
        terminalOpen = false;
        terminalEl.classList.remove("is-open");
    }

    function toggleTerminal() {
        terminalOpen ? closeTerminal() : openTerminal();
    }

    /* ================================================================
       MATRIX RAIN EFFECT
       ================================================================ */

    var matrixCanvas = null;
    var matrixActive = false;

    function startMatrixEffect() {
        if (matrixActive) return;
        matrixActive = true;

        matrixCanvas = document.createElement("canvas");
        matrixCanvas.className = "matrix-canvas";
        document.body.appendChild(matrixCanvas);

        var ctx = matrixCanvas.getContext("2d");
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        var chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        var fontSize = 14;
        var columns = Math.floor(matrixCanvas.width / fontSize);
        var drops = [];
        for (var i = 0; i < columns; i++) drops[i] = Math.random() * -100;

        function draw() {
            if (!matrixActive) return;
            ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            ctx.fillStyle = "#0f0";
            ctx.font = fontSize + "px monospace";

            for (var col = 0; col < columns; col++) {
                var text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = Math.random() > 0.98 ? "#fff" : (Math.random() > 0.5 ? "#0f0" : "#0a0");
                ctx.fillText(text, col * fontSize, drops[col] * fontSize);

                if (drops[col] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[col] = 0;
                }
                drops[col]++;
            }
            requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);

        function stopMatrix() {
            matrixActive = false;
            if (matrixCanvas && matrixCanvas.parentNode) {
                matrixCanvas.parentNode.removeChild(matrixCanvas);
            }
            matrixCanvas = null;
            document.removeEventListener("keydown", stopMatrix);
            document.removeEventListener("click", stopMatrix);
        }

        setTimeout(function () {
            document.addEventListener("keydown", stopMatrix, { once: true });
            document.addEventListener("click", stopMatrix, { once: true });
        }, 100);

        // Auto-stop after 15 seconds
        setTimeout(function () {
            if (matrixActive) stopMatrix();
        }, 15000);
    }

    /* ================================================================
       CODE TYPING ANIMATION (hero section)
       ================================================================ */

    function initCodeTyping() {
        var heroAside = document.querySelector(".hero__aside");
        if (!heroAside || prefersReducedMotion.matches) return;

        var codeBlock = document.createElement("div");
        codeBlock.className = "code-block reveal";
        codeBlock.innerHTML =
            '<div class="code-block__header">' +
                '<span class="code-block__dot"></span>' +
                '<span class="code-block__dot"></span>' +
                '<span class="code-block__dot"></span>' +
                '<span class="code-block__file">portfolio.ts</span>' +
            '</div>' +
            '<pre class="code-block__body"><code class="code-block__code"></code></pre>';

        heroAside.appendChild(codeBlock);

        var codeEl = codeBlock.querySelector(".code-block__code");
        var lines = [
            '<span class="ck">const</span> <span class="cv">engineer</span> = {',
            '  <span class="cp">name</span>: <span class="cs">"ML"</span>,',
            '  <span class="cp">role</span>: <span class="cs">"Software Engineer"</span>,',
            '  <span class="cp">company</span>: <span class="cs">"Fenergo"</span>,',
            '  <span class="cp">focus</span>: [',
            '    <span class="cs">"enterprise systems"</span>,',
            '    <span class="cs">"event-driven architecture"</span>,',
            '    <span class="cs">"practical AI tooling"</span>,',
            '  ],',
            '  <span class="cp">status</span>: <span class="cs">"building"</span> <span class="cc">// always</span>',
            '};'
        ];

        var lineIndex = 0;
        var charIndex = 0;
        var currentText = "";
        var cursor = '<span class="code-cursor">│</span>';

        function getPlainLength(html) {
            return html.replace(/<[^>]*>/g, "").length;
        }

        function typeChar() {
            if (lineIndex >= lines.length) {
                codeEl.innerHTML = currentText + cursor;
                return;
            }

            var line = lines[lineIndex];
            var plainLen = getPlainLength(line);

            if (charIndex <= plainLen) {
                // Build partial line by counting visible characters
                var partial = "";
                var visible = 0;
                var inTag = false;
                for (var k = 0; k < line.length && visible <= charIndex; k++) {
                    if (line[k] === "<") inTag = true;
                    if (!inTag) visible++;
                    if (visible <= charIndex) partial += line[k];
                    if (line[k] === ">" && inTag) {
                        inTag = false;
                        if (visible <= charIndex) continue;
                    }
                }
                // Close any open tags
                var openTags = partial.match(/<span[^>]*>/g) || [];
                var closeTags = partial.match(/<\/span>/g) || [];
                var unclosed = openTags.length - closeTags.length;
                for (var t = 0; t < unclosed; t++) partial += "</span>";

                codeEl.innerHTML = currentText + partial + cursor;
                charIndex++;
                var delay = 18 + Math.random() * 28;
                if (charIndex < 3) delay = 40 + Math.random() * 60;
                setTimeout(typeChar, delay);
            } else {
                currentText += line + "\n";
                lineIndex++;
                charIndex = 0;
                setTimeout(typeChar, 100 + Math.random() * 150);
            }
        }

        // Wait for reveal animation to finish, then type
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                setTimeout(typeChar, 1200);
            }
        }, { threshold: 0.3 });

        observer.observe(codeBlock);
    }

    /* ================================================================
       MAGNETIC HOVER EFFECTS
       ================================================================ */

    function initMagneticElements() {
        if (prefersReducedMotion.matches) return;
        if (window.innerWidth < 1024 || "ontouchstart" in window) return;

        var magnetics = document.querySelectorAll(".button, .theme-toggle, .meta-pill");
        magnetics.forEach(function (el) {
            el.addEventListener("mousemove", function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = "translate(" + (x * 0.15) + "px, " + (y * 0.15) + "px)";
            });

            el.addEventListener("mouseleave", function () {
                el.style.transform = "";
            });
        });
    }

    /* ================================================================
       SMOOTH SCROLL PROGRESS INDICATOR
       ================================================================ */

    function initScrollProgress() {
        if (document.body.dataset.page !== "home") return;

        var sections = document.querySelectorAll(".section[id], .hero[id]");
        if (sections.length === 0) return;

        var indicator = document.createElement("nav");
        indicator.className = "scroll-progress";
        indicator.setAttribute("aria-label", "Page sections");
        indicator.innerHTML = '<div class="scroll-progress__track"></div>';

        var track = indicator.querySelector(".scroll-progress__track");
        var dots = [];

        sections.forEach(function (section) {
            var dot = document.createElement("button");
            dot.className = "scroll-progress__dot";
            dot.setAttribute("aria-label", "Scroll to " + (section.id || "section"));
            dot.dataset.target = section.id;
            dot.addEventListener("click", function () {
                section.scrollIntoView({ behavior: "smooth" });
            });
            track.appendChild(dot);
            dots.push({ el: dot, section: section });
        });

        document.body.appendChild(indicator);

        // Update active dot on scroll
        var progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                dots.forEach(function (d) {
                    d.el.classList.toggle("is-active", d.section === entry.target);
                });
            });
        }, {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0
        });

        dots.forEach(function (d) { progressObserver.observe(d.section); });
    }

    /* ================================================================
       STAGGERED LIST ANIMATIONS
       ================================================================ */

    function initStaggeredLists() {
        if (prefersReducedMotion.matches) return;

        var lists = document.querySelectorAll(".feature-list, .entry-list, .case-list");
        lists.forEach(function (list) {
            var items = list.children;
            for (var i = 0; i < items.length; i++) {
                items[i].style.setProperty("--stagger-index", i);
            }
        });
    }

    /* ================================================================
       HOVER TILT ON CASE STUDY VISUALS
       ================================================================ */

    function initTiltCards() {
        if (prefersReducedMotion.matches) return;
        if ("ontouchstart" in window) return;

        var visuals = document.querySelectorAll(".case-study__visual");
        visuals.forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = "perspective(600px) rotateY(" + (x * 8) + "deg) rotateX(" + (-y * 8) + "deg) translateY(-4px)";
            });
            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    /* ================================================================
       EASTER EGGS
       ================================================================ */

    // Konami code
    var konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiIndex = 0;

    function initKonami() {
        document.addEventListener("keydown", function (e) {
            if (paletteOpen || terminalOpen) return;
            if (e.keyCode === konamiSequence[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiSequence.length) {
                    konamiIndex = 0;
                    triggerKonami();
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    function triggerKonami() {
        var overlay = document.createElement("div");
        overlay.className = "konami-overlay";
        overlay.innerHTML =
            '<div class="konami-content">' +
                '<p class="konami-title">🎮 Achievement Unlocked!</p>' +
                '<p class="konami-text">You found the Konami code easter egg.</p>' +
                '<p class="konami-text t-muted">↑ ↑ ↓ ↓ ← → ← → B A</p>' +
                '<p class="konami-text">You clearly know your way around a keyboard.</p>' +
            '</div>';

        document.body.appendChild(overlay);
        requestAnimationFrame(function () { overlay.classList.add("is-visible"); });

        setTimeout(function () {
            overlay.classList.remove("is-visible");
            setTimeout(function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 500);
        }, 4000);
    }

    // Console greeting
    function initConsoleEasterEggs() {
        if (typeof console === "undefined") return;

        var styles = [
            "color: #1a1a1a",
            "font-size: 16px",
            "font-weight: bold",
            "font-family: Inter, system-ui, sans-serif"
        ].join(";");

        var stylesSmall = [
            "color: #7c8190",
            "font-size: 12px",
            "font-family: Inter, system-ui, sans-serif"
        ].join(";");

        console.log(
            "\n%c◆ Portfolio Terminal\n" +
            "%cPress ` (backtick) or click >_ to open the terminal.\n" +
            "Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A\n",
            styles, stylesSmall
        );
    }

    /* ================================================================
       KEYBOARD SHORTCUTS
       ================================================================ */

    function initGlobalKeys() {
        document.addEventListener("keydown", function (e) {
            // Don't capture input events
            var tag = (e.target.tagName || "").toLowerCase();
            if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;

            // Ctrl+K / Cmd+K — command palette
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                togglePalette();
                return;
            }

            // Don't intercept when palette/terminal is open
            if (paletteOpen || terminalOpen) return;

            // Backtick — terminal
            if (e.key === "`" && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                toggleTerminal();
                return;
            }

            // t — toggle theme
            if (e.key === "t") {
                toggleTheme();
                return;
            }
        });
    }

    /* ================================================================
       SMOOTH LINK TRANSITIONS
       ================================================================ */

    function initPageTransitions() {
        if (prefersReducedMotion.matches) return;
        if (!document.startViewTransition) return; // Only if View Transitions API is available

        document.addEventListener("click", function (e) {
            var link = e.target.closest("a");
            if (!link) return;
            var href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;
            if (link.target === "_blank") return;

            e.preventDefault();
            document.startViewTransition(function () {
                window.location.href = href;
            });
        });
    }

    /* ================================================================
       UTILITIES
       ================================================================ */

    function navigate(path) {
        // Resolve relative to root
        var base = window.location.origin;
        window.location.href = base + path;
    }

    function toggleTheme() {
        var doc = document.documentElement;
        var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
        doc.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        var btn = document.querySelector(".theme-toggle");
        if (btn) {
            btn.setAttribute("aria-pressed", String(next === "dark"));
            btn.textContent = next === "dark" ? "Dark" : "Light";
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    /* ================================================================
       SCROLL TO TOP BUTTON
       ================================================================ */

    function initScrollToTop() {
        var btn = document.createElement("button");
        btn.className = "scroll-top";
        btn.setAttribute("aria-label", "Scroll to top");
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        document.body.appendChild(btn);

        var visible = false;
        var threshold = window.innerHeight * 2;

        window.addEventListener("scroll", function () {
            var shouldShow = window.scrollY > threshold;
            if (shouldShow !== visible) {
                visible = shouldShow;
                btn.classList.toggle("is-visible", visible);
            }
        }, { passive: true });
    }

    /* ================================================================
       AI CHAT ASSISTANT — v3 (10x knowledge, context-aware, multi-turn)
       ================================================================ */

    var chatOpen = false;
    var chatEl = null;
    var chatFab = null;
    var chatInput = null;
    var chatMessages = null;
    var chatHistory = [];

    /* ─── Comprehensive Knowledge Base ─── */

    var chatKnowledge = [
        /* ── Greetings & Openers ── */
        {
            patterns: [/^(hi|hello|hey|sup|yo|howdy|what'?s\s*up|hola|greetings|good\s*(morning|afternoon|evening)|whats good|waddup|oi|bonjour|ciao)/i],
            responses: [
                "Hey! Welcome to Marco Ladeira's portfolio. I know his work inside and out — ask me about Fenergo, his tech stack, AI work, projects, writing, or how to reach him.",
                "Hello! Great to have you here. I'm Marco Ladeira's portfolio assistant — I can walk you through his engineering career, current projects, skills, or how to get in touch. What catches your interest?",
                "Hi there! I'm a knowledge assistant built into Marco Ladeira's site. Whether you're a recruiter, fellow engineer, or just curious — I've got answers. Fire away."
            ],
            suggestions: ["Who is Marco?", "Current role", "Tech stack", "Contact"]
        },

        /* ── Identity & Bio ── */
        {
            patterns: [/who (is|are|r) (marco|he|him)/i, /tell me about (marco|him(self)?)/i, /about marco/i, /introduce/i, /what does marco do/i, /^marco$/i, /describe (marco|him)/i, /what('s| is) (marco|his) (deal|story|background)/i],
            responses: [
                "Marco Ladeira is a Software Engineer at Fenergo in Dublin, Ireland. He builds enterprise SaaS for financial institutions — the kind of systems that handle KYC, regulatory compliance, and client lifecycle management at scale. Beyond his day job, he's deeply into practical AI: LLM integration, MCP server architecture, machine learning pipelines. He was hand-picked for Fenergo's first-ever AI initiative. He's the type of engineer who cares as much about how a system feels to use as how it performs under load.",
                "Marco Ladeira is a Dublin-based Software Engineer at Fenergo. His engineering philosophy sits at the intersection of enterprise reliability and product taste — he builds systems that stay stable under pressure and interfaces that stay calm when the complexity underneath isn't. Currently focused on C#/.NET backend systems, event-driven architecture, and bringing AI tooling into enterprise workflows. His project history spans everything from financial compliance platforms to NASA data interfaces to iOS apps."
            ],
            suggestions: ["Fenergo details", "His projects", "AI work", "Contact Marco"]
        },

        /* ── Name meaning / personal touch ── */
        {
            patterns: [/name|why marco|what does (his|the) name mean|marco ladeira meaning|portuguese/i],
            responses: [
                "Marco Ladeira — the name has Portuguese roots. 'Ladeira' means hillside or slope in Portuguese. Marco is originally from a Portuguese-speaking background, now based in Dublin, Ireland, building software at Fenergo. The multicultural background shows in his approach to work — pragmatic, grounded, and always learning."
            ],
            suggestions: ["Where is he based?", "About Marco", "Current role"]
        },

        /* ── Skills & Tech Stack (detailed) ── */
        {
            patterns: [/skills?|tech\s*stack|technologies|what (does he|do you) (use|know|work with)|languages?|framework|tools|proficien/i],
            responses: [
                "Marco Ladeira's tech stack runs deep across several layers:\n\n<strong>Backend:</strong> C#, .NET, Python, Node.js\n<strong>Frontend:</strong> TypeScript, React, HTML/CSS, vanilla JS\n<strong>Architecture:</strong> CQRS, event sourcing, EventStoreDB, microservices\n<strong>Cloud & Data:</strong> AWS (pursuing ML Specialty), DynamoDB, serverless\n<strong>AI/ML:</strong> LLM integration, MCP servers, ML pipelines, prompt engineering\n<strong>DevOps:</strong> CI/CD, Docker, GitHub Actions\n<strong>Other:</strong> REST APIs, GraphQL, WebSockets, Git\n\nHe's not a 'knows a little of everything' engineer — he goes production-deep on each tool he uses.",
                "Here's what Marco Ladeira works with daily and has production experience in:\n\n<strong>Languages:</strong> C#, TypeScript, Python, JavaScript\n<strong>Frameworks:</strong> .NET, React, Node.js, Express\n<strong>Data & Cloud:</strong> EventStoreDB, DynamoDB, AWS, serverless architecture\n<strong>Architecture patterns:</strong> CQRS, event-driven systems, microservices, domain-driven design\n<strong>AI tooling:</strong> MCP servers, LLM workflow orchestration, ML pipelines\n<strong>Frontend:</strong> Responsive design, accessibility, CSS architecture, vanilla JS\n\nHe picks tools based on what's right for the problem, not what's trending."
            ],
            suggestions: ["Backend deep dive", "AI/ML work", "Projects"]
        },

        /* ── Backend-specific ── */
        {
            patterns: [/backend|server.?side|c#|\.net|dotnet|csharp|api/i],
            responses: [
                "Marco Ladeira's backend work is centered on C# and .NET within Fenergo's enterprise platform. He works with event-driven architecture using EventStoreDB, CQRS patterns, and DynamoDB for data persistence. His systems handle financial regulatory workflows — think KYC processing, client lifecycle management, and compliance automation. He designs for reliability under pressure: idempotent operations, eventual consistency, and clean domain boundaries."
            ],
            suggestions: ["Architecture patterns", "Fenergo details", "Frontend skills"]
        },

        /* ── Frontend-specific ── */
        {
            patterns: [/frontend|front.?end|react|css|html|javascript|typescript|ui|ux|design|web dev/i],
            responses: [
                "On the frontend, Marco Ladeira works with TypeScript, React, and modern CSS. This portfolio site itself is a showcase — built from scratch with zero dependencies: vanilla JavaScript, custom CSS architecture with 60+ design tokens, fluid typography, layered shadow system, interactive terminal with 55+ commands, this AI chatbot, theme switching, and full accessibility support. He approaches frontend with the same rigor as backend — systematic, intentional, and built to last."
            ],
            suggestions: ["This website's tech", "Backend skills", "Projects"]
        },

        /* ── Fenergo (detailed) ── */
        {
            patterns: [/fenergo|current (role|job|work|position)|where (does he|do you) work|employer|company|what company/i],
            responses: [
                "Marco Ladeira works at Fenergo as a Software Engineer, starting September 2025. Fenergo is a leading enterprise SaaS company that builds client lifecycle management solutions for financial institutions — banks, asset managers, and capital markets firms worldwide.\n\nMarco's responsibilities include:\n- Backend delivery using C#/.NET and event-driven architecture\n- Platform reliability and production engineering\n- Working with CQRS, EventStoreDB, and DynamoDB\n- Selected for Fenergo's first AI initiative — integrating MCP tooling and LLM workflows into enterprise financial software\n\nIt's a high-stakes environment where system reliability directly impacts compliance workflows for major financial institutions."
            ],
            suggestions: ["His AI initiative", "Tech stack", "Before Fenergo"]
        },

        /* ── AI Initiative at Fenergo ── */
        {
            patterns: [/ai initiative|fenergo.*(ai|ml)|first ai|selected for|lead.*(ai|ml)/i],
            responses: [
                "Marco Ladeira was selected for Fenergo's first-ever AI initiative — a major milestone since Fenergo traditionally focused on pure enterprise SaaS. He's bringing MCP (Model Context Protocol) tooling and LLM workflow orchestration into the financial compliance domain. This means building AI-assisted workflows for KYC processing, regulatory analysis, and client lifecycle automation. It's practical AI — not chatbot demos, but real enterprise integration where reliability and accuracy are non-negotiable."
            ],
            suggestions: ["What's MCP?", "His AI philosophy", "Tech stack"]
        },

        /* ── MCP / Model Context Protocol ── */
        {
            patterns: [/mcp|model context protocol|what('s| is) mcp/i],
            responses: [
                "MCP stands for Model Context Protocol — it's a standardized way to connect AI models with external tools, data sources, and services. Marco Ladeira works extensively with MCP architecture, both at Fenergo and in personal projects. He writes about MCP workflows in his essays, arguing it's a key piece of the 'hybrid AI workflow' alongside CLI tools and agent systems. Think of it as giving AI models structured access to real-world systems instead of just generating text."
            ],
            suggestions: ["His AI essays", "Hybrid workflow", "Fenergo AI work"]
        },

        /* ── Projects (detailed) ── */
        {
            patterns: [/projects?|what (has he|have you) built|work samples|portfolio work|show me/i],
            responses: [
                "Marco Ladeira's project portfolio shows real range:\n\n<strong>Fenergo</strong> (2025–present) — Enterprise SaaS for financial institutions. Backend delivery, event-driven architecture, CQRS, and AI initiative leadership.\n\n<strong>NASA Space Explorer</strong> (2025) — A full-stack web platform built around NASA's data APIs. Focus on information hierarchy, visual clarity, and product-level presentation.\n\n<strong>Achievr</strong> (2025) — An iOS goal-tracking app designed around momentum and personal interaction patterns. Native mobile with a focus on user psychology.\n\nEach project demonstrates a different skill axis: enterprise scale, data visualization, or native mobile craft."
            ],
            suggestions: ["View Work page", "NASA project", "Achievr details"]
        },

        /* ── NASA Space Explorer ── */
        {
            patterns: [/nasa|space explorer|space project/i],
            responses: [
                "NASA Space Explorer is a full-stack web platform Marco Ladeira built around NASA's public APIs. The focus was on information hierarchy — making complex astronomical data feel approachable through visual clarity and product-level presentation. It showcases his ability to take raw API data and transform it into something with real product polish. Check the Work page for more details."
            ],
            suggestions: ["View Work page", "Other projects", "Tech stack"]
        },

        /* ── Achievr ── */
        {
            patterns: [/achievr|ios|goal.?track|mobile app|swift/i],
            responses: [
                "Achievr is an iOS goal-tracking app Marco Ladeira designed around momentum and personal interaction patterns. Unlike most productivity apps that overwhelm with features, Achievr focuses on a more personal interaction model — helping users build sustainable habits through clear progress visualization and psychological design principles. It shows Marco's product thinking beyond just code."
            ],
            suggestions: ["Other projects", "Frontend skills", "About Marco"]
        },

        /* ── AI / ML (comprehensive) ── */
        {
            patterns: [/\bai\b|artificial intelligence|machine learning|\bml\b|llm|gpt|deep learning|neural|nlp|transformer|openai|claude|copilot/i],
            responses: [
                "AI is central to Marco Ladeira's trajectory right now. Here's the full picture:\n\n<strong>At work:</strong> Selected for Fenergo's first AI initiative — integrating LLM workflows and MCP tooling into enterprise financial software.\n\n<strong>Certifications:</strong> Pursuing AWS Machine Learning Specialty certification.\n\n<strong>Philosophy:</strong> Practical over hype. He believes AI should augment engineering judgment, not replace it. His essay 'Software engineering is moving toward systems judgment' covers this.\n\n<strong>Technical:</strong> LLM integration, MCP server architecture, ML pipelines, prompt engineering, evaluation frameworks.\n\n<strong>Writing:</strong> Two major essays on hybrid AI workflows — combining CLI speed, MCP structure, and agent leverage.\n\nHe's not an 'AI enthusiast' — he's an engineer who ships AI into production."
            ],
            suggestions: ["Read his AI essays", "MCP explained", "Fenergo AI initiative"]
        },

        /* ── His AI Philosophy ── */
        {
            patterns: [/ai philosophy|how does marco (think|feel) about ai|ai opinion|stance on ai|approach to ai/i],
            responses: [
                "Marco Ladeira has a clear stance on AI: it's a tool that makes engineering better, not a replacement for engineering judgment. He argues that the strongest AI workflow isn't a single interface — it's CLI speed, MCP structure, and agent-level leverage working in combination. He's skeptical of hype, focused on what ships, and interested in the hard problems of making AI reliable in enterprise contexts where errors have real consequences. His essay 'Software engineering is moving toward systems judgment' lays out his full thesis."
            ],
            suggestions: ["Read the essay", "Hybrid workflow", "His AI work"]
        },

        /* ── Writing (detailed) ── */
        {
            patterns: [/writ(ing|e|ten)|blog|essay|article|post|publish/i],
            responses: [
                "Marco Ladeira writes thoughtful long-form essays on engineering practice and AI:\n\n<strong>'The best AI workflow is hybrid'</strong> (March 2026) — His argument for combining CLI speed, MCP structure, and agent leverage rather than relying on any single AI interface.\n\n<strong>'Software engineering is moving toward systems judgment'</strong> (December 2025) — How AI shifts the center of gravity toward intent, architecture, and judgment rather than away from engineering.\n\n<strong>Updates:</strong>\n- Selected for Fenergo's first AI initiative (March 2026)\n- AWS ML Specialty and current AI focus (March 2026)\n- First months at Fenergo (October 2025)\n\nHis writing is practical, opinion-driven, and backed by real engineering experience."
            ],
            suggestions: ["Read hybrid essay", "Read judgment essay", "About Marco"]
        },

        /* ── Hybrid Workflow essay ── */
        {
            patterns: [/hybrid (workflow|essay|article)|cli.*mcp.*agent|best ai workflow/i],
            responses: [
                "In 'The best AI workflow is hybrid' (March 2026), Marco Ladeira argues that no single AI tool — not ChatGPT, not Copilot, not any one platform — is the optimal setup. The real power comes from combining three layers: CLI speed for fast operations, MCP structure for connecting AI to real systems and data, and agent leverage for complex multi-step tasks. He draws from his production experience at Fenergo and personal projects to make the case. It's one of the most practical takes on AI workflows you'll read."
            ],
            suggestions: ["Read the essay", "MCP explained", "His other essay"]
        },

        /* ── Systems Judgment essay ── */
        {
            patterns: [/systems? judgment|engineering.*age.*ai|software engineering.*moving/i],
            responses: [
                "In 'Software engineering is moving toward systems judgment' (December 2025), Marco Ladeira writes about how AI changes what matters in engineering. His thesis: as AI handles more implementation, the center of gravity shifts to intent, architecture, interfaces, and judgment calls. Engineers who can evaluate AI output, design system boundaries, and make taste-driven decisions become more valuable — not less. It's a counterpoint to the 'AI will replace developers' narrative."
            ],
            suggestions: ["Read the essay", "His AI philosophy", "Hybrid workflow essay"]
        },

        /* ── Contact (comprehensive) ── */
        {
            patterns: [/contact|email|reach|get in touch|connect|message|talk to (him|marco)/i],
            responses: [
                "Here's how to reach Marco Ladeira:\n\n<strong>Email:</strong> marcoladeiraworkemail@gmail.com (replies within 48 hours)\n<strong>LinkedIn:</strong> linkedin.com/in/marco-ladeira\n<strong>GitHub:</strong> github.com/MarcoLadeira\n\nHe reads every message and enjoys connecting — whether it's about a job opportunity, collaboration idea, AI discussion, or just a hello. The Contact page has everything in one place."
            ],
            suggestions: ["Send email", "View LinkedIn", "View GitHub"]
        },

        /* ── Social / LinkedIn / GitHub specifically ── */
        {
            patterns: [/linkedin/i],
            responses: [
                "Marco Ladeira's LinkedIn: linkedin.com/in/marco-ladeira — he shares updates on work, AI tooling, and engineering thinking. It's the best place to see his career timeline and professional network."
            ],
            suggestions: ["Email instead", "GitHub", "About Marco"]
        },
        {
            patterns: [/github|code|repo|open.?source/i],
            responses: [
                "Marco Ladeira's GitHub: github.com/MarcoLadeira — source code for personal projects, experiments, and this portfolio site itself. This entire website is open source — built with zero dependencies, vanilla JS, and custom CSS."
            ],
            suggestions: ["About this site", "Email Marco", "His projects"]
        },

        /* ── Hiring / Availability ── */
        {
            patterns: [/hire|hiring|available|freelance|contract|open to|looking for|recru/i],
            responses: [
                "Marco Ladeira is currently a Software Engineer at Fenergo, but he's always open to conversations about interesting opportunities — especially roles involving AI/ML engineering, platform architecture, or product-focused engineering. He's also interested in side collaborations and open-source work.\n\nBest way to start a conversation: marcoladeiraworkemail@gmail.com\n\nHe takes every inquiry seriously and replies within 48 hours."
            ],
            suggestions: ["Send email", "His experience", "Current role"]
        },

        /* ── Location ── */
        {
            patterns: [/where|location|city|country|based|live|from|dublin|ireland|relocat/i],
            responses: [
                "Marco Ladeira is based in Dublin, Ireland. He works at Fenergo's Dublin office, building enterprise software for the global financial sector. Dublin's tech ecosystem — with companies like Stripe, Intercom, and major financial institutions — is a strong fit for his work across platform engineering, AI, and enterprise systems."
            ],
            suggestions: ["Current role", "About Marco", "Contact"]
        },

        /* ── Education & Certs ── */
        {
            patterns: [/education|university|degree|study|college|school|cert|qualification|where did (he|you) (study|go|learn)/i],
            responses: [
                "Marco Ladeira has a solid foundation in software engineering and is actively expanding his credentials. He's currently pursuing the AWS Machine Learning Specialty certification — one of AWS's most advanced certifications focused on ML model design, deployment, and operations. His learning approach is hands-on: he studies the theory and immediately ships real systems. His expertise across event-driven architecture, cloud platforms, and AI/ML systems reflects years of deliberate skill building."
            ],
            suggestions: ["AWS ML cert", "Tech stack", "AI work"]
        },

        /* ── AWS specific ── */
        {
            patterns: [/aws|amazon|cloud|certification|certified/i],
            responses: [
                "Marco Ladeira is pursuing the AWS Machine Learning Specialty certification and has production experience with several AWS services. At Fenergo, he works with DynamoDB and serverless architecture. His AWS knowledge spans cloud infrastructure, ML model deployment and evaluation, data engineering pipelines, and scalable system design. The ML Specialty cert is one of the hardest AWS certifications — it covers SageMaker, model training, feature engineering, and ML operations."
            ],
            suggestions: ["His ML work", "Fenergo details", "Tech stack"]
        },

        /* ── Resume / CV ── */
        {
            patterns: [/resume|cv|curriculum|download|pdf/i],
            responses: [
                "Marco Ladeira's resume is available for download on the Contact page (note: it may not reflect his most current role or latest work — it's marked as 'outdated'). For the most up-to-date picture, check his LinkedIn (linkedin.com/in/marco-ladeira) or use the terminal on this site and type 'resume' for a quick overview.\n\nYou can also explore the About page for a comprehensive look at his background."
            ],
            suggestions: ["About page", "LinkedIn", "Contact page"]
        },

        /* ── The Website / This Site ── */
        {
            patterns: [/this (site|website|portfolio)|how.*(built|made)|design|what tech.*site|source code|who (built|designed|made) this/i],
            responses: [
                "This portfolio was designed and built entirely by Marco Ladeira — and it's quite something:\n\n<strong>Zero dependencies.</strong> Pure HTML, CSS, and vanilla JavaScript. No React, no build tools, no frameworks.\n\n<strong>Features:</strong>\n- Interactive terminal with 55+ commands, tab completion, and history\n- This AI chatbot assistant\n- Command palette (Ctrl+K)\n- Theme switching (light/dark)\n- Liquid glass CSS effects\n- Code typing animation\n- Matrix rain, magnetic hover, tilt cards\n- Konami code and console easter eggs\n- Custom CSS design system with 60+ tokens\n- Full accessibility and responsive design\n\n<strong>Hosted on:</strong> GitHub Pages (free, fast, simple)\n\nThe entire source code is on GitHub: github.com/MarcoLadeira"
            ],
            suggestions: ["Try the terminal", "View source", "Easter eggs?"]
        },

        /* ── Terminal ── */
        {
            patterns: [/terminal|command|cli|prompt|\>\s*_/i],
            responses: [
                "This site has a fully functional interactive terminal! Open it with the '>_' button in the nav bar or press Ctrl+` (backtick).\n\nIt supports 55+ commands including: help, about, skills, neofetch, weather, matrix, cowsay, resume, blog, scan, changelog, deploy, htop, and many more. It has tab completion, command history (up/down arrows), and aliases.\n\nSome fun ones to try: 'neofetch', 'matrix', 'cowsay hello', 'fortune', 'sudo rm -rf /'"
            ],
            suggestions: ["Open terminal", "Easter eggs?", "About the site"]
        },

        /* ── Easter eggs ── */
        {
            patterns: [/easter egg|secret|hidden|konami|surprise|fun feature|trick/i],
            responses: [
                "Marco Ladeira packed this site with hidden gems. I'll give you some hints:\n\n- Try the Konami code (up up down down left right left right B A)\n- Open the terminal and try 'sudo rm -rf /'\n- Check the browser console for surprises\n- Try 'matrix' in the terminal\n- Type 'cowsay' followed by any text\n- There might be more I'm not telling you about...\n\nHe's the kind of engineer who believes software should have personality."
            ],
            suggestions: ["Try the terminal", "About the site", "Marco's philosophy"]
        },

        /* ── Architecture / System Design ── */
        {
            patterns: [/architect|system design|cqrs|event.?sourc|event.?driven|micro.?service|domain.?driven|ddd|pattern/i],
            responses: [
                "Marco Ladeira has deep architecture experience, especially from his work at Fenergo:\n\n<strong>CQRS</strong> — Separating read and write models for complex financial domain logic\n<strong>Event Sourcing</strong> — Using EventStoreDB to capture every state change as an immutable event\n<strong>Event-Driven Architecture</strong> — Loosely coupled services communicating through events\n<strong>DynamoDB</strong> — NoSQL data modeling for high-throughput, low-latency access\n<strong>Domain-Driven Design</strong> — Clean bounded contexts and aggregate root patterns\n\nThis isn't theoretical — these patterns power real compliance workflows handling sensitive financial data."
            ],
            suggestions: ["Fenergo details", "Tech stack", "His philosophy"]
        },

        /* ── Identity ── */
        {
            patterns: [/what (are you|is this)|who (are you|made you)|you('re| are) (a |an )?(bot|ai|chatbot|assistant)/i, /^(are you|r u) (real|human|a bot|ai)/i],
            responses: [
                "I'm Marco Ladeira's portfolio assistant — a pattern-matching chatbot built right into this website. I'm not a general AI or LLM — I'm a purpose-built knowledge base with deep context about Marco's work, skills, projects, and background. I was designed to give visitors quick, accurate answers instead of making them dig through pages. Ask me anything about Marco and I'll give you a real answer.",
                "I'm a smart assistant embedded in Marco Ladeira's portfolio. Think of me as an interactive FAQ that actually knows things. I can tell you about Marco's engineering career, tech stack, AI work, projects, writing, or how to get in touch. No hallucinations — just facts about Marco."
            ],
            suggestions: ["Who is Marco?", "His work", "Get in touch"]
        },

        /* ── Thanks / Appreciation ── */
        {
            patterns: [/thank|thanks|cheers|appreciate|helpful|nice|cool|awesome|great|amazing/i],
            responses: [
                "Glad I could help! If you want to connect with Marco Ladeira directly, his email is marcoladeiraworkemail@gmail.com. Otherwise, feel free to keep exploring the site — try the terminal, read an essay, or check out the source code on GitHub.",
                "Happy to help! Marco Ladeira is always open to conversations. Explore the site some more, or reach out directly at marcoladeiraworkemail@gmail.com."
            ],
            suggestions: ["Contact Marco", "Explore the site", "Try the terminal"]
        },

        /* ── Experience / Career Timeline ── */
        {
            patterns: [/experience|years|career|background|history|journey|timeline|how long|seniority/i],
            responses: [
                "Marco Ladeira's career trajectory:\n\n<strong>2025–present:</strong> Software Engineer at Fenergo\n- Enterprise SaaS for financial institutions\n- Backend delivery, platform reliability, production engineering\n- Selected for Fenergo's first AI initiative\n- Working with C#/.NET, EventStoreDB, DynamoDB, CQRS\n\n<strong>Project Portfolio:</strong>\n- NASA Space Explorer (full-stack web platform)\n- Achievr (iOS goal-tracking app)\n- This portfolio site (zero-dependency, 55+ terminal commands)\n\n<strong>Focus Areas:</strong> Event-driven architecture, AI/ML integration, product engineering\n<strong>Certifications:</strong> Pursuing AWS ML Specialty"
            ],
            suggestions: ["Fenergo details", "Projects", "Skills", "AI work"]
        },

        /* ── Hobbies / Personal ── */
        {
            patterns: [/hobby|hobbies|fun|free time|outside work|interests?|personal|life|do for fun/i],
            responses: [
                "Outside of work, Marco Ladeira is into:\n\n- <strong>AI experimentation</strong> — building personal tools, testing new workflows, pushing boundaries\n- <strong>Technical writing</strong> — crafting essays on engineering practice and AI\n- <strong>Building things</strong> — this portfolio site (with its terminal, chatbot, and easter eggs) is a labor of love\n- <strong>Continuous learning</strong> — currently working toward AWS ML Specialty\n\nHe's fundamentally a builder — the kind of person who codes for fun and sees every project as a chance to learn something new."
            ],
            suggestions: ["His projects", "His writing", "About Marco"]
        },

        /* ── Comparison queries ── */
        {
            patterns: [/better than|compare|vs|versus|different from|like (other|similar)/i],
            responses: [
                "I can only speak to Marco Ladeira's strengths — and there's a lot to cover. He brings a rare combination: enterprise-grade backend engineering (C#/.NET, CQRS, event sourcing), real AI/ML production experience (not just demos), product-level frontend craft (this zero-dependency portfolio proves that), and clear written communication. That's a mix you don't find often. Want me to go deeper on any of those?"
            ],
            suggestions: ["Tech stack", "His projects", "His writing"]
        },

        /* ── Salary / Compensation ── */
        {
            patterns: [/salary|compensation|how much|pay|money|rate/i],
            responses: [
                "I don't have information about Marco Ladeira's compensation. For any discussions about roles or compensation, the best approach is to reach out directly: marcoladeiraworkemail@gmail.com. He's always open to professional conversations."
            ],
            suggestions: ["Contact Marco", "His experience", "Current role"]
        },

        /* ── Jokes / Fun ── */
        {
            patterns: [/joke|funny|humor|laugh|lol|haha|😂|make me laugh/i],
            responses: [
                "Why do programmers prefer dark mode? Because light attracts bugs. 🪲\n\nBut seriously — Marco Ladeira's site has some actual humor built in. Try typing 'sudo rm -rf /' in the terminal, or 'cowsay' followed by text. The Konami code works too!",
                "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'\n\nMarco Ladeira appreciates humor in software — check out the terminal for more fun commands like 'fortune', 'joke', 'flip', and 'sl'."
            ],
            suggestions: ["Try the terminal", "Easter eggs", "About Marco"]
        },

        /* ── Negative / Challenge ── */
        {
            patterns: [/suck|bad|terrible|worst|hate|boring|not good|mediocre|overrated/i],
            responses: [
                "I appreciate the directness! Let Marco Ladeira's work speak for itself: he shipped enterprise systems handling financial compliance data, was selected for his company's first AI initiative, built this entire interactive portfolio from scratch with zero dependencies, and writes thoughtful essays on engineering practice. The Work page and Writing page have the details. Give them a look and form your own opinion."
            ],
            suggestions: ["View Work page", "Read his writing", "Contact Marco"]
        },

        /* ── Broad catch-alls ── */
        {
            patterns: [/what can (you|i) (do|ask|help|tell)|help me|what do you know|capabilities/i],
            responses: [
                "I know Marco Ladeira's portfolio inside and out. Here's what I can help with:\n\n- <strong>Career:</strong> His role at Fenergo, career timeline, experience\n- <strong>Technical:</strong> Full tech stack, architecture patterns, backend/frontend skills\n- <strong>AI/ML:</strong> His AI initiative, MCP work, ML certifications, philosophy\n- <strong>Projects:</strong> Fenergo, NASA Space Explorer, Achievr, this website\n- <strong>Writing:</strong> Essay summaries and themes\n- <strong>Contact:</strong> Email, LinkedIn, GitHub, resume\n- <strong>Fun:</strong> Easter eggs, terminal commands, site features\n\nJust ask naturally — I'll figure out what you mean."
            ],
            suggestions: ["Who is Marco?", "Tech stack", "AI work", "Contact"]
        },

        /* ── Weather / off-topic graceful ── */
        {
            patterns: [/weather|time|date|news|sports|stock|crypto|bitcoin/i],
            responses: [
                "That's outside my area! I'm specifically built to answer questions about Marco Ladeira — his engineering work, projects, skills, and how to reach him. But if you want weather, try the terminal command 'weather' — it actually works!"
            ],
            suggestions: ["Who is Marco?", "Try the terminal", "Contact"]
        },

        /* ── Goodbye ── */
        {
            patterns: [/bye|goodbye|see ya|later|gotta go|leaving|exit|quit|close/i],
            responses: [
                "Thanks for stopping by! If you want to reach Marco Ladeira directly: marcoladeiraworkemail@gmail.com. Happy to chat again anytime.",
                "See you! Remember — Marco Ladeira is always open to conversations. Drop him a line at marcoladeiraworkemail@gmail.com."
            ],
            suggestions: ["Send email", "View LinkedIn"]
        },

        /* ── Philosophy / Engineering approach ── */
        {
            patterns: [/philosophy|approach|methodology|how does (he|marco) (work|think|build)|engineering (style|taste|philosophy)|values/i],
            responses: [
                "Marco Ladeira's engineering philosophy has a few core principles:\n\n1. <strong>Reliability over cleverness</strong> — Systems should work under pressure, not just in demos\n2. <strong>Product taste matters</strong> — Even backend code benefits from intentional design\n3. <strong>AI as amplifier</strong> — AI should augment judgment, not replace it\n4. <strong>Ship, then polish</strong> — Working software first, then iterate\n5. <strong>Restrained interfaces</strong> — Calm design even when the underlying complexity is high\n\nHis work at Fenergo and his writing both reflect these values. He's not an 'architecture astronaut' — he ships real things."
            ],
            suggestions: ["His writing", "Fenergo work", "AI philosophy"]
        },

        /* ── Collaboration / Working Together ── */
        {
            patterns: [/collaborat|work together|partner|team up|join|side project|open source|contribute/i],
            responses: [
                "Marco Ladeira is interested in collaborations, especially around:\n- AI tooling and MCP server architecture\n- Open source projects with real utility\n- Side projects that solve genuine problems\n- Engineering content and technical writing\n\nHe's currently at Fenergo full-time, but actively engages with the broader engineering community. Reach out at marcoladeiraworkemail@gmail.com with your idea — he takes every collaboration inquiry seriously."
            ],
            suggestions: ["Send email", "His projects", "AI work"]
        }
    ];

    var fallbackResponses = [
        "I don't have specific info on that, but I know Marco Ladeira's portfolio thoroughly. Try asking about his work at Fenergo, tech stack, AI projects, writing, or how to contact him. I can go deep on any of those.",
        "That's a bit outside what I cover! I'm an expert on all things Marco Ladeira — his engineering career, current projects, AI work, skills, or how to reach him. What would you like to know?",
        "Hmm, I'm not sure about that specifically. But ask me about Marco Ladeira's role at Fenergo, his tech stack (C#, .NET, TypeScript, Python, AWS), his AI work, projects, essays, or contact info and I've got detailed answers.",
        "I don't have that info — but I can tell you about Marco Ladeira's enterprise engineering work, his AI initiative at Fenergo, the tech behind this website, or help you get in touch. What interests you?"
    ];

    /* ─── Smart matching with context awareness ─── */

    function escapeHtml(str) {
        var div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function scrollChat() {
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(text, suggestions) {
        var msgDiv = document.createElement("div");
        msgDiv.className = "ai-chat__msg ai-chat__msg--bot";
        msgDiv.innerHTML = '<span class="ai-chat__msg-avatar">ML</span><div class="ai-chat__msg-bubble">' + text + '</div>';
        chatMessages.appendChild(msgDiv);

        if (suggestions && suggestions.length) {
            var sugDiv = document.createElement("div");
            sugDiv.className = "ai-chat__suggestions";
            suggestions.forEach(function (s) {
                var btn = document.createElement("button");
                btn.className = "ai-chat__suggestion";
                btn.textContent = s;
                btn.addEventListener("click", function () {
                    if (s === "Send email" || s === "Send an email") {
                        window.open("mailto:marcoladeiraworkemail@gmail.com", "_blank");
                        return;
                    }
                    if (s === "View Work page") { window.location.href = "work/"; return; }
                    if (s === "About page") { window.location.href = "about/"; return; }
                    if (s === "Read essays" || s === "Read his AI essays" || s === "Read his writing" || s === "Read hybrid essay" || s === "Read the essay" || s === "Read judgment essay") { window.location.href = "writing/"; return; }
                    if (s === "View LinkedIn") { window.open("https://www.linkedin.com/in/marco-ladeira/", "_blank"); return; }
                    if (s === "View GitHub" || s === "View source") { window.open("https://github.com/MarcoLadeira", "_blank"); return; }
                    if (s === "Contact page") { window.location.href = "contact/"; return; }
                    if (s === "Explore the site") { closeChat(); return; }
                    if (s === "Try the terminal" || s === "Open terminal") { closeChat(); toggleTerminal(); return; }
                    chatInput.value = s;
                    handleChatSend();
                });
                sugDiv.appendChild(btn);
            });
            chatMessages.appendChild(sugDiv);
        }
        scrollChat();
    }

    function addUserMessage(text) {
        var msgDiv = document.createElement("div");
        msgDiv.className = "ai-chat__msg ai-chat__msg--user";
        msgDiv.innerHTML = '<div class="ai-chat__msg-bubble">' + escapeHtml(text) + '</div>';
        chatMessages.appendChild(msgDiv);
        scrollChat();
    }

    function showTyping() {
        var typingDiv = document.createElement("div");
        typingDiv.className = "ai-chat__msg ai-chat__msg--bot ai-chat__typing";
        typingDiv.innerHTML = '<span class="ai-chat__msg-avatar">ML</span><div class="ai-chat__msg-bubble"><span class="ai-chat__dots"><span></span><span></span><span></span></span></div>';
        chatMessages.appendChild(typingDiv);
        scrollChat();
        return typingDiv;
    }

    function removeTyping(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function matchResponse(input) {
        var text = input.trim();
        chatHistory.push(text.toLowerCase());

        // Multi-word keyword scoring for better multi-topic handling
        var bestMatch = null;
        var bestScore = 0;

        for (var i = 0; i < chatKnowledge.length; i++) {
            var entry = chatKnowledge[i];
            for (var j = 0; j < entry.patterns.length; j++) {
                var match = entry.patterns[j].exec(text);
                if (match) {
                    var score = match[0].length;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = entry;
                    }
                }
            }
        }

        if (bestMatch) {
            var resp = bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
            return { text: resp, suggestions: bestMatch.suggestions || [] };
        }

        return {
            text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            suggestions: ["Who is Marco?", "His skills", "Contact"]
        };
    }

    /* ─── Chat lifecycle ─── */

    function buildChat() {
        chatFab = document.createElement("button");
        chatFab.className = "ai-chat-fab";
        chatFab.setAttribute("aria-label", "Chat with Marco's assistant");
        chatFab.innerHTML = '<svg class="ai-chat-fab__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
        chatFab.addEventListener("click", toggleChat);
        document.body.appendChild(chatFab);

        chatEl = document.createElement("div");
        chatEl.className = "ai-chat";
        chatEl.setAttribute("role", "dialog");
        chatEl.setAttribute("aria-label", "Chat with Marco's assistant");
        chatEl.innerHTML =
            '<div class="ai-chat__header">' +
                '<div class="ai-chat__identity">' +
                    '<span class="ai-chat__avatar">ML</span>' +
                    '<div class="ai-chat__hdr-info">' +
                        '<span class="ai-chat__name">Marco\'s Assistant</span>' +
                        '<span class="ai-chat__status"><span class="ai-chat__status-dot"></span>Online</span>' +
                    '</div>' +
                '</div>' +
                '<button class="ai-chat__close" aria-label="Close">&times;</button>' +
            '</div>' +
            '<div class="ai-chat__messages" id="chat-messages"></div>' +
            '<div class="ai-chat__bar">' +
                '<form class="ai-chat__form">' +
                    '<input class="ai-chat__input" type="text" placeholder="Ask about Marco..." autocomplete="off" maxlength="500">' +
                    '<button class="ai-chat__send" type="submit" aria-label="Send">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
                    '</button>' +
                '</form>' +
            '</div>';

        document.body.appendChild(chatEl);
        chatMessages = chatEl.querySelector("#chat-messages");
        chatInput = chatEl.querySelector(".ai-chat__input");

        chatEl.querySelector(".ai-chat__close").addEventListener("click", closeChat);
        chatEl.querySelector(".ai-chat__form").addEventListener("submit", function (e) {
            e.preventDefault();
            handleChatSend();
        });
    }

    function toggleChat() {
        chatOpen ? closeChat() : openChat();
    }

    function openChat() {
        if (!chatEl) buildChat();
        chatOpen = true;
        chatEl.classList.add("is-open");
        chatFab.classList.add("is-hidden");

        if (!chatMessages.hasChildNodes()) {
            addBotMessage(
                "Hey! I'm Marco Ladeira's portfolio assistant. I know everything about his work, skills, and background. Ask me anything — or pick a topic below.",
                ["Who is Marco?", "Tech stack", "Current role", "Contact"]
            );
        }
        chatInput.focus();
    }

    function closeChat() {
        chatOpen = false;
        if (chatEl) chatEl.classList.remove("is-open");
        if (chatFab) chatFab.classList.remove("is-hidden");
    }

    function handleChatSend() {
        var text = chatInput.value.trim();
        if (!text) return;

        var oldSuggestions = chatMessages.querySelectorAll(".ai-chat__suggestions");
        oldSuggestions.forEach(function (s) { s.remove(); });

        addUserMessage(text);
        chatInput.value = "";

        var typingEl = showTyping();
        var delay = 400 + Math.random() * 600;

        setTimeout(function () {
            removeTyping(typingEl);
            var result = matchResponse(text);
            addBotMessage(result.text, result.suggestions);
        }, delay);
    }

    /* ================================================================
       TERMINAL TOGGLE BUTTON BINDING
       ================================================================ */

    function initTerminalToggle() {
        var btns = document.querySelectorAll(".terminal-toggle");
        btns.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                toggleTerminal();
            });
        });
    }

    /* ================================================================
       INIT
       ================================================================ */

    initGlobalKeys();
    initTerminalToggle();
    buildChat();
    initScrollToTop();
    initCodeTyping();
    initMagneticElements();
    initScrollProgress();
    initStaggeredLists();
    initTiltCards();
    initKonami();
    initConsoleEasterEggs();
    initPageTransitions();

})();
