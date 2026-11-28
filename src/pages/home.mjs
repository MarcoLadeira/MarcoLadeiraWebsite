import { html, raw } from "../lib/html.mjs";
import { layout, personJsonLd } from "../lib/layout.mjs";
import { site, url } from "../data/site.mjs";
import { flagship } from "../data/projects.mjs";
import { featureVisual } from "../components/work.mjs";
import { icon } from "../components/icons.mjs";

export function home() {
  const [fenergo, ...projects] = flagship;
  const body = html`
<section class="landing" aria-labelledby="hero-title">
  <div class="wrap landing__inner">
    <p class="landing__location">Dublin, Ireland</p>
    <h1 id="hero-title" class="landing__name">MARCO LADEIRA</h1>
    <div class="landing__intro">
      <p class="landing__role">${site.role} at ${site.employer}</p>
      <p>I build event-driven services and full-stack features for financial institutions, and help integrate AI into regulated workflows. Outside work, I build Vesta and ONE Oddlings.</p>
    </div>
    <div class="landing__actions">
      <a class="btn btn--primary" href="${url("work/")}">See the work ${raw(icon("arrow-right"))}</a>
      <a class="link-arrow" href="${url(site.cv)}" download>Download CV ${raw(icon("download"))}</a>
    </div>
  </div>
</section>

<section class="landing-career" aria-labelledby="career-title">
  <div class="wrap landing-career__inner">
    <h2 id="career-title">Engineering at Fenergo</h2>
    <div>
      <p>I joined Fenergo on its client lifecycle platform and advanced from Graduate to Associate Software Engineer. I’ve since worked on new features with several engineering teams, including the company’s first AI initiative.</p>
      <div class="landing-career__links">
        <a class="link-arrow" href="${url(`work/${fenergo.slug}/`)}">Fenergo case study ${raw(icon("arrow-right"))}</a>
        <a href="${url("experience/")}">Experience</a>
      </div>
    </div>
  </div>
</section>

<section class="landing-work" aria-labelledby="work-title">
  <div class="wrap">
    <header class="landing-work__heading"><h2 id="work-title">Selected projects</h2><a href="${url("work/")}">All work ${raw(icon("arrow-right"))}</a></header>
    <div class="landing-projects">
      ${projects.map((project) => html`
        <article class="feature landing-project landing-project--${project.accent}" aria-labelledby="project-${project.slug}">
          <a class="landing-project__media" href="${url(`work/${project.slug}/`)}" tabindex="-1" aria-hidden="true">
            ${featureVisual(project)}
          </a>
          <div class="landing-project__copy">
            <h3 id="project-${project.slug}"><a href="${url(`work/${project.slug}/`)}">${project.name} ${raw(icon("arrow-ne"))}</a></h3>
            <p>${project.card}</p>
          </div>
        </article>`)}
    </div>
  </div>
</section>

<section class="landing-practice" aria-labelledby="practice-title">
  <div class="wrap landing-practice__inner">
    <div>
      <h2 id="practice-title">What I work on</h2>
      <ul class="landing-practice__list">
        <li>Back-end services and event-driven systems</li>
        <li>Full-stack products and developer tools</li>
        <li>AI integrations and agent workflows</li>
      </ul>
    </div>
    <div>
      <h2>Outside work</h2>
      <p>I studied software development at Dundalk Institute of Technology. I’m based in Dublin and build Vesta and ONE Oddlings in my own time.</p>
      <a class="link-arrow" href="${url("about/")}">About me ${raw(icon("arrow-right"))}</a>
    </div>
  </div>
</section>`;

  return layout({
    path: "",
    title: `${site.name} — Software Engineer`,
    description: site.description,
    body,
    bodyClass: "page-home",
    jsonLd: [personJsonLd(), { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.origin + site.base }],
  });
}
