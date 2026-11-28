// Single source of truth for identity, links and navigation.
// Every page, the CV, structured data and social previews read from here.

export const site = {
  origin: "https://marcoladeira.github.io",
  base: "/MarcoLadeiraWebsite/",
  lang: "en-IE",
  locale: "en_IE",
  name: "Marco Ladeira",
  wordmark: "MARCO LADEIRA",
  role: "Associate Software Engineer",
  employer: "Fenergo",
  employerUrl: "https://www.fenergo.com/",
  location: "Dublin, Ireland",
  email: "marcoladeirawork@gmail.com",
  linkedin: "https://www.linkedin.com/in/marco-ladeira/",
  github: "https://github.com/MarcoLadeira",
  cv: "assets/marco-ladeira-cv.pdf",
  tagline: "Software engineer and product builder",
  description:
    "Marco Ladeira is an Associate Software Engineer at Fenergo in Dublin, working across enterprise software, distributed systems and AI. He also builds Vesta and ONE Oddlings.",
  updated: "2026-11-28",
};

export const nav = [
  { href: "work/", label: "Work" },
  { href: "experience/", label: "Experience" },
  { href: "about/", label: "About" },
];

/** Absolute-from-root URL inside the site (respects the GitHub Pages base path). */
export const url = (path = "") => site.base + path.replace(/^\//, "");
/** Fully-qualified URL for canonical/OG tags. */
export const absUrl = (path = "") => site.origin + url(path);
