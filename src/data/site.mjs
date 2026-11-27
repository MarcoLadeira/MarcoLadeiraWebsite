// Single source of truth for identity, links and navigation.
// Every page, the CV, structured data and social previews read from here.

export const site = {
  origin: "https://marcoladeira.github.io",
  base: "/MarcoLadeiraWebsite/",
  lang: "en-IE",
  locale: "en_IE",
  name: "Marco Ladeira",
  role: "Associate Software Engineer",
  employer: "Fenergo",
  employerUrl: "https://www.fenergo.com/",
  location: "Dublin, Ireland",
  email: "marcoladeiraworkemail@gmail.com",
  linkedin: "https://www.linkedin.com/in/marco-ladeira/",
  github: "https://github.com/MarcoLadeira",
  cv: "assets/marco-ladeira-cv.pdf",
  tagline: "Software that shows its working.",
  description:
    "Marco Ladeira is an Associate Software Engineer at Fenergo in Dublin, building enterprise AI for financial-services compliance, and the builder of Vesta and ONE Oddlings.",
  updated: "2026-11-27",
};

export const nav = [
  { href: "work/", label: "Work" },
  { href: "experience/", label: "Experience" },
  { href: "about/", label: "About" },
  { href: "lab/", label: "Lab" },
  { href: "writing/", label: "Writing" },
  { href: "contact/", label: "Contact" },
];

/** Absolute-from-root URL inside the site (respects the GitHub Pages base path). */
export const url = (path = "") => site.base + path.replace(/^\//, "");
/** Fully-qualified URL for canonical/OG tags. */
export const absUrl = (path = "") => site.origin + url(path);
