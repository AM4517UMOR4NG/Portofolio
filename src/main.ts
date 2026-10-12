import "./style.css";
import avatar from "./assets/avatar.jpg";
import { initCursorTrail } from "./effects/cursor";
import { SettingsManager } from "./utils/SettingsManager";

const github = "https://github.com/AM4517UMOR4NG";
const arrow = '<span aria-hidden="true">↗</span>';
const settings = SettingsManager.getInstance();
const route =
  location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/\.html$/, "") || "index";
const navigation = [
  ["index", "Home"],
  ["projects", "Work"],
  ["about", "About"],
  ["repos", "Open source"],
  ["notes", "Journal"],
  ["games", "Playground"],
  ["settings", "Preferences"],
];
type Project = {
  name: string;
  repo: string;
  description: string;
  tags: string[];
  category: string;
  art: string;
};
const projects: Project[] = [
  {
    name: "Patch Pilot",
    repo: "Patch_Pilot",
    description:
      "An AI-powered platform for GitHub repository insights and code analysis.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "AI"],
    category: "Backend & AI",
    art: "pilot",
  },
  {
    name: "ProjectPI",
    repo: "ProjectPI_Playstation",
    description:
      "A PlayStation rental system with point of sale and inventory management.",
    tags: ["PHP", "Laravel"],
    category: "Web applications",
    art: "playstation",
  },
  {
    name: "Football Ticket",
    repo: "Football-Ticket",
    description:
      "A football ticketing experience with seat selection and payment integration.",
    tags: ["Java", "Spring Boot"],
    category: "Backend & AI",
    art: "ticket",
  },
  {
    name: "Gov Reports",
    repo: "Government-General-Report-and-Complain-System",
    description:
      "Public reports and complaints, organized with role-based dashboards and workflows.",
    tags: ["PHP", "Laravel"],
    category: "Web applications",
    art: "reports",
  },
  {
    name: "Holy Bible",
    repo: "HOLY-BIBLE",
    description:
      "A digital Bible with search, bookmarks, and reading progress tracking.",
    tags: ["JavaScript", "Web App"],
    category: "Web applications",
    art: "bible",
  },
  {
    name: "Library Management",
    repo: "Librabry-Management-System",
    description:
      "A library system with JWT authentication, book management, and borrowing history.",
    tags: ["Java", "Spring Boot"],
    category: "Backend & AI",
    art: "library",
  },
  {
    name: "Machine Learning",
    repo: "Pembelajaran-Mesin",
    description:
      "Experiments in classification, prediction, and turning data into useful insights.",
    tags: ["Python", "Machine Learning"],
    category: "Experiments",
    art: "learning",
  },
  {
    name: "This Portfolio",
    repo: "Portofolio",
    description:
      "A personal space for code, ideas, and experiments. Built with TypeScript and Vite.",
    tags: ["TypeScript", "Vite"],
    category: "Experiments",
    art: "portfolio",
  },
];
const tags = (items: string[]) =>
  `<div class="tags">${items.map((tag) => `<span>${tag}</span>`).join("")}</div>`;
function artwork(project: Project) {
  const illustrations: Record<string, string> = {
    pilot:
      '<div class="code-window"><div class="window-dots"><i></i><i></i><i></i><span>patch_pilot / analysis</span></div><code><span class="code-muted">01</span> repository.scan()<br><span class="code-muted">02</span> <b>insights</b> → generated<br><span class="code-muted">03</span> build.something_better()</code><div class="code-result"><span>✦</span> A new perspective on your code.</div></div>',
    playstation:
      '<div class="controller"><span>✚</span><div class="controller-center"><i></i><i></i></div><span class="controller-symbols">△ ○<br>□ ×</span></div><span class="art-caption">PRESS START. KEEP TRACK.</span>',
    ticket:
      '<div class="ticket-stub"><small>MATCH DAY / ADMIT ONE</small><strong>90 MIN.<br>ALL IN.</strong><div class="ticket-bottom"><span>SEAT A—01</span><span>▥▥▥▥</span></div></div>',
    reports:
      '<div class="mini-document"><small>PUBLIC REPORT</small><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div><span>↗ A clearer way forward</span></div>',
    bible:
      '<div class="book"><span>THE<br>HOLY<br>BIBLE</span><small>READ. REFLECT. RETURN.</small></div>',
    library:
      '<div class="book-stack"><i></i><i></i><i></i><span>A place for every story.</span></div>',
    learning:
      '<div class="data-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="art-caption">FROM DATA TO DIRECTION</span>',
    portfolio:
      '<div class="art-monogram">a<span>↗</span></div><span class="art-caption">ALWAYS A WORK IN PROGRESS.</span>',
  };
  return `<div class="project-art art-${project.art}" aria-hidden="true">${illustrations[project.art]}</div>`;
}
function projectCard(project: Project, index: number) {
  return `<a class="project-card reveal" href="${github}/${project.repo}" target="_blank" rel="noopener noreferrer" data-category="${project.category}">${artwork(project)}<div class="project-meta"><span class="eyebrow">${String(index + 1).padStart(2, "0")} / ${project.category}</span>${arrow}</div><h3>${project.name}</h3><p>${project.description}</p>${tags(project.tags)}</a>`;
}
const pageHeading = (
  number: string,
  label: string,
  heading: string,
  description: string,
) =>
  `<header class="page-heading"><div class="eyebrow">${number} / ${label}</div><h1>${heading}</h1><p>${description}</p></header>`;
const skills = `<div class="skill-row"><span class="eyebrow">01</span><div><h3>Backend, built right.</h3><p>Java · Spring Boot · PHP · Laravel · PostgreSQL</p></div>${arrow}</div><div class="skill-row"><span class="eyebrow">02</span><div><h3>Ideas into interfaces.</h3><p>TypeScript · JavaScript · React · Vite</p></div>${arrow}</div><div class="skill-row"><span class="eyebrow">03</span><div><h3>Curiosity, driven by data.</h3><p>Python · Machine Learning · Data Analysis</p></div>${arrow}</div>`;

function home() {
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="status-dot"></span> FULL-STACK DEVELOPER & CURIOUS BUILDER</div><h1>Good ideas.<br>Thoughtful code.<br><span>Real impact.</span></h1><div class="hero-bottom"><p>Hey, I'm Alogo. I build web applications,<br class="desktop-break"> explore data, and turn curiosity into code.</p><a class="button button-lime" href="/projects.html">Explore my work ${arrow}</a></div></div><div class="hero-art"><span class="art-corner eyebrow">A DIGITAL ALTER EGO</span><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="portrait-frame"><img src="${avatar}" alt="Illustrated robot avatar for Alogo, with headphones and lime accents" width="1254" height="1254" fetchpriority="high"><span class="portrait-tag">ALOGO / DIGITAL AVATAR</span></div><span class="hero-star" aria-hidden="true">✳</span><a class="art-link" href="/about.html">A little about me ${arrow}</a></div></section><div class="tech-strip"><span class="eyebrow">MY TOOLBOX</span><span>Java</span><span>Spring Boot</span><span>Laravel</span><span>TypeScript</span><span>Python</span><span>PostgreSQL</span></div><section class="section"><div class="section-header"><div><span class="eyebrow">01 / SELECTED WORK</span><h2>A few things<br>I've put into the world.</h2></div><a class="text-link" href="/projects.html">All projects ${arrow}</a></div><div class="project-grid featured">${projects.slice(0, 2).map(projectCard).join("")}</div></section><section class="about-preview section"><div><span class="eyebrow">02 / WHAT I DO</span><h2>Built with purpose.<br><span class="muted">Backed by curiosity.</span></h2><p>From complex backend systems to modern web experiences, I enjoy connecting the pieces and making things work.</p><a class="text-link" href="/about.html">More about me ${arrow}</a></div><div>${skills}</div></section><section class="playground-banner"><div><span class="eyebrow">A SMALL DETOUR</span><h2>All work? A little play.</h2><p>Step into the playground. Snake and Tetris are waiting.</p></div><a class="button" href="/games.html">Let's play ${arrow}</a></section>`;
}
function about() {
  return `${pageHeading("02", "THE PERSON", "Curious mind.<br><span>Builder at heart.</span>", "A.M. Alogo Situmorang / Full-stack developer")}<section class="about-layout"><div class="about-portrait"><img src="${avatar}" alt="Illustrated robot avatar for Alogo, with headphones and lime accents" width="1254" height="1254"><div class="eyebrow">ALOGO / DIGITAL AVATAR</div></div><div class="about-story"><h2>Hey, I'm Alogo.</h2><p>I'm a passionate developer exploring the depths of code and faith. Currently focused on building complex backend systems with Java and Spring Boot, creating data-driven solutions with Python, and crafting modern web applications.</p><p>My work spans enterprise applications and machine learning experiments. I love exploring new technologies and turning ideas into reality.</p><blockquote>“You must love your GOD,<br>more than your sins.”<cite>A principle I carry with me.</cite></blockquote><a class="button button-lime" href="/contact.html">Let's connect ${arrow}</a></div></section><section class="section"><div class="section-header"><div><span class="eyebrow">THE TOOLBOX</span><h2>Different tools.<br>Same thoughtful approach.</h2></div></div><div class="skills-full">${skills}</div></section>`;
}
function work() {
  return `${pageHeading("01", "SELECTED WORK", "Ideas made<br><span>into something.</span>", "A collection of web applications, backend systems, and experiments.")}<div class="filters" role="group" aria-label="Filter projects">${["All projects", "Backend & AI", "Web applications", "Experiments"].map((filter, i) => `<button class="filter ${i === 0 ? "active" : ""}" aria-pressed="${i === 0}" data-filter="${filter}">${filter}</button>`).join("")}<span id="project-count" class="eyebrow">8 PROJECTS</span></div><div class="project-grid">${projects.map(projectCard).join("")}</div>`;
}
function repos() {
  return `${pageHeading("03", "OPEN SOURCE", "Behind the scenes.<br><span>Out in the open.</span>", "The code, the experiments, and everything in between. Explore on GitHub.")}<div class="repository-intro"><span class="eyebrow">AM4517UMOR4NG / GITHUB</span><a class="text-link" href="${github}?tab=repositories" target="_blank" rel="noopener noreferrer">View all repositories ${arrow}</a></div><div class="repo-grid">${[...projects, { name: "Tools", repo: "Tools", description: "A collection of utilities and tools.", tags: ["Utilities"], category: "Experiments", art: "" }].map((project, i) => `<a class="repo-row" href="${github}/${project.repo}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">${String(i + 1).padStart(2, "0")} / SOURCE CODE</span><h3>${project.name} ${arrow}</h3><p>${project.description}</p>${tags(project.tags)}</a>`).join("")}</div>`;
}
function journal() {
  return `${pageHeading("04", "DEVELOPMENT JOURNAL", "A work<br><span>in progress.</span>", "Recent commits, new repositories, and small steps forward. Live from GitHub.")}<div class="journal-layout"><aside><span class="eyebrow">FIELD NOTES</span><p>Building is a process.<br>Here's a look at mine.</p><a class="text-link" href="${github}" target="_blank" rel="noopener noreferrer">Follow along ${arrow}</a></aside><div id="github-activity" aria-live="polite"><div class="activity-state"><span class="status-dot"></span> Fetching the latest activity…</div></div></div>`;
}
function games() {
  return `${pageHeading("05", "THE PLAYGROUND", "Take a break.<br><span>Press play.</span>", "Small experiments. Classic games. A little room for fun.")}<div class="game-grid"><button class="game-card" data-game="snake"><div class="game-illustration snake-illustration" aria-hidden="true"><div class="pixel-snake"></div><i></i></div><span class="eyebrow">01 / THE CLASSIC</span><h2>Snake 2.0 ${arrow}</h2><p>Keep moving. Keep growing. Arrow keys or swipe to find your next bite.</p><span class="game-action">PLAY SNAKE →</span></button><button class="game-card" data-game="tetris"><div class="game-illustration tetris-illustration" aria-hidden="true"><div class="tetris-block block-one"></div><div class="tetris-block block-two"></div><div class="tetris-block block-three"></div></div><span class="eyebrow">02 / MAKE IT FIT</span><h2>Tetris Void ${arrow}</h2><p>Find your rhythm, clear the lines. Arrow keys to move, up to rotate.</p><span class="game-action">PLAY TETRIS →</span></button></div><div id="gameModal" class="game-modal" role="dialog" aria-modal="true" aria-labelledby="gameTitle" style="display:none"><div class="game-modal-inner"><div class="game-modal-header"><h3 id="gameTitle">Game</h3><button class="game-close-btn" id="gameClose" aria-label="Close game">×</button></div><div class="game-canvas-wrap"><canvas id="gameCanvas"></canvas></div><div class="game-score">SCORE <span id="gameScore">0</span></div><div class="game-controls-mobile" id="mobileControls" style="display:none"><button class="ctrl-btn" data-dir="up" aria-label="Up or rotate">▲</button><div class="ctrl-row"><button class="ctrl-btn" data-dir="left" aria-label="Left">◀</button><button class="ctrl-btn" data-dir="down" aria-label="Down">▼</button><button class="ctrl-btn" data-dir="right" aria-label="Right">▶</button></div></div><p class="game-hint">Arrow keys to move · Space to restart · Esc to close</p></div></div>`;
}
function contact() {
  return `${pageHeading("06", "SAY HELLO", "Something in mind?<br><span>Let’s talk.</span>", "A project, an idea, or a simple hello. I would love to hear from you.")}<div class="contact-layout"><div class="contact-note"><span class="contact-asterisk" aria-hidden="true">✳</span><h2>Good things start<br>with a conversation.</h2><p>Reach out through any of these channels.<br>Let's see what we can build together.</p></div><div class="contact-list"><a class="contact-row" href="mailto:${atob("YWVrbW9ob3BAZ21haWwuY29t")}"><span class="eyebrow">01 / EMAIL</span><h3>${atob("YWVrbW9ob3BAZ21haWwuY29t")} ${arrow}</h3></a><a class="contact-row" href="${github}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">02 / GITHUB</span><h3>AM4517UMOR4NG ${arrow}</h3></a><a class="contact-row" href="${atob("aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2EtbS1hbG9nby1zaXR1bW9yYW5nLTc1NTM3NzNhYg==")}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">03 / LINKEDIN</span><h3>A.M. Alogo Situmorang ${arrow}</h3></a><a class="contact-row" href="${atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS91c2Vycy85MDc5NDA5NjYzMzIyMzU4Mjg=")}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">04 / DISCORD</span><h3>Find me on Discord ${arrow}</h3></a><button class="text-link copy-email" id="copy-email">Copy email address <span aria-hidden="true">⧉</span></button><span id="copy-status" class="eyebrow" aria-live="polite"></span></div></div>`;
}
function preferences() {
  return `${pageHeading("07", "PREFERENCES", "Make yourself<br><span>at home.</span>", "A few small adjustments to make this space yours. Saved on this device.")}<div class="preferences"><label class="setting-row" for="theme-toggle"><div><span class="eyebrow">01 / APPEARANCE</span><h3>Dark mode</h3><p>A quieter canvas. Switch off for a lighter look.</p></div><span class="switch"><input type="checkbox" id="theme-toggle" ${settings.state.theme === "dark" ? "checked" : ""}><span class="slider"></span></span></label><label class="setting-row" for="sidebar-pref-toggle"><div><span class="eyebrow">02 / NAVIGATION</span><h3>Compact navigation</h3><p>Keep the main links visible, with extras in the menu.</p></div><span class="switch"><input type="checkbox" id="sidebar-pref-toggle" ${settings.state.sidebarCollapsed ? "checked" : ""}><span class="slider"></span></span></label><label class="setting-row" for="anim-toggle"><div><span class="eyebrow">03 / MOTION</span><h3>Interface animations</h3><p>Gentle reveals and transitions as you explore.</p></div><span class="switch"><input type="checkbox" id="anim-toggle" ${settings.state.animationsEnabled ? "checked" : ""}><span class="slider"></span></span></label><p class="preferences-note">The signature red cursor trail stays with you.</p></div>`;
}
const pages: Record<string, () => string> = {
  index: home,
  about,
  projects: work,
  repos,
  notes: journal,
  games,
  contact,
  settings: preferences,
};
document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="/index.html" aria-label="Alogo home">alogo<span>↗</span><small>DEVELOPER & BUILDER</small></a><nav class="desktop-nav" aria-label="Main navigation">${navigation
    .slice(0, 5)
    .map(
      ([path, label], i) =>
        `<a class="${route === path ? "active" : ""} ${i > 2 ? "extra-nav" : ""}" href="/${path}.html" ${route === path ? 'aria-current="page"' : ""}>${label}</a>`,
    )
    .join(
      "",
    )}</nav><div class="header-actions"><a class="header-contact" href="/contact.html">Let's talk ${arrow}</a><button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-menu"><span></span><span></span></button></div><nav id="site-menu" class="site-menu" aria-label="All pages" hidden>${[...navigation, ["contact", "Contact"]].map(([path, label]) => `<a href="/${path}.html" ${route === path ? 'aria-current="page"' : ""}>${label}${arrow}</a>`).join("")}</nav></header><main id="main" tabindex="-1">${(pages[route] || home)()}</main>${route !== "contact" && route !== "settings" ? `<section class="contact-cta"><span class="eyebrow">HAVE SOMETHING IN MIND?</span><a href="/contact.html">Let's make it happen.<span>↗</span></a></section>` : ""}<footer class="site-footer"><a class="footer-brand" href="/index.html">alogo↗</a><span>© ${new Date().getFullYear()} Alogo Situmorang</span><div><a href="${github}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a><a href="/games.html">Playground ${arrow}</a><a href="/settings.html">Preferences</a><a href="#" aria-label="Back to top">↑</a></div></footer>`;

initCursorTrail();
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const menu = document.querySelector<HTMLElement>("#site-menu")!;
const setMenu = (open: boolean) => {
  menu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuButton.addEventListener("click", () => setMenu(menu.hidden));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!(event.target as Element).closest(".site-header")) setMenu(false);
});
if (route === "projects")
  document
    .querySelectorAll<HTMLButtonElement>("[data-filter]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        document
          .querySelectorAll<HTMLButtonElement>("[data-filter]")
          .forEach((filter) => {
            filter.classList.toggle("active", filter === button);
            filter.setAttribute("aria-pressed", String(filter === button));
          });
        let count = 0;
        document
          .querySelectorAll<HTMLElement>("[data-category]")
          .forEach((card) => {
            card.hidden =
              button.dataset.filter !== "All projects" &&
              card.dataset.category !== button.dataset.filter;
            if (!card.hidden) count++;
          });
        document.querySelector("#project-count")!.textContent =
          `${count} PROJECT${count === 1 ? "" : "S"}`;
      }),
    );
if (route === "games") void import("./pages/games");
if (route === "settings") {
  document
    .querySelector<HTMLInputElement>("#theme-toggle")!
    .addEventListener("change", (event) =>
      settings.update(
        "theme",
        (event.target as HTMLInputElement).checked ? "dark" : "light",
      ),
    );
  document
    .querySelector<HTMLInputElement>("#sidebar-pref-toggle")!
    .addEventListener("change", (event) =>
      settings.update(
        "sidebarCollapsed",
        (event.target as HTMLInputElement).checked,
      ),
    );
  document
    .querySelector<HTMLInputElement>("#anim-toggle")!
    .addEventListener("change", (event) =>
      settings.update(
        "animationsEnabled",
        (event.target as HTMLInputElement).checked,
      ),
    );
}
document.querySelector("#copy-email")?.addEventListener("click", async () => {
  const status = document.querySelector("#copy-status")!;
  try {
    await navigator.clipboard.writeText(atob("YWVrbW9ob3BAZ21haWwuY29t"));
    status.textContent = "Email copied. Say hello!";
  } catch {
    status.textContent = "Copy unavailable. Use the email link above.";
  }
});
type GitHubEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    description?: string;
    pull_request?: { title: string };
  };
};
async function loadActivity() {
  const container = document.querySelector("#github-activity")!;
  const cacheKey = "alogo_activity_v2";
  const render = (events: GitHubEvent[]) => {
    container.replaceChildren();
    const recent = events
      .filter((event) =>
        ["PushEvent", "CreateEvent", "PullRequestEvent"].includes(event.type),
      )
      .slice(0, 6);
    if (!recent.length) {
      container.innerHTML = `<div class="activity-state">No recent public activity. <a href="${github}" target="_blank" rel="noopener noreferrer">Explore GitHub ↗</a></div>`;
      return;
    }
    recent.forEach((event) => {
      const link = document.createElement("a");
      link.className = "journal-entry";
      link.href = `https://github.com/${event.repo.name}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const date = document.createElement("span");
      date.className = "eyebrow";
      date.textContent = new Date(event.created_at).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "short", year: "numeric" },
      );
      const title = document.createElement("h3");
      title.textContent = `${event.type === "PushEvent" ? "Updates to" : event.type === "CreateEvent" ? "Created" : "Pull request in"} ${event.repo.name.split("/").pop()} ↗`;
      const description = document.createElement("p");
      description.textContent = (
        event.payload.commits?.[0]?.message ||
        event.payload.pull_request?.title ||
        event.payload.description ||
        "View this activity on GitHub."
      ).slice(0, 180);
      link.append(date, title, description);
      container.append(link);
    });
  };
  try {
    const saved = sessionStorage.getItem(cacheKey);
    if (saved) {
      const cached = JSON.parse(saved);
      if (Date.now() - cached.time < 1800000) {
        render(cached.events);
        return;
      }
    }
    const response = await fetch(
      "https://api.github.com/users/AM4517UMOR4NG/events/public?per_page=30",
      { signal: AbortSignal.timeout(10000) },
    );
    if (!response.ok) throw new Error("GitHub unavailable");
    const events: GitHubEvent[] = await response.json();
    if (!Array.isArray(events)) throw new Error("Invalid activity");
    render(events);
    try {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ time: Date.now(), events }),
      );
    } catch {
      /* Activity remains visible when storage is unavailable. */
    }
  } catch {
    container.innerHTML = `<div class="activity-state"><h3>A little quiet here.</h3><p>GitHub activity is unavailable right now.</p><a class="text-link" href="${github}" target="_blank" rel="noopener noreferrer">View activity on GitHub ${arrow}</a><button class="text-link" id="retry-activity">Try again ↻</button></div>`;
    document.querySelector("#retry-activity")?.addEventListener("click", () => {
      container.textContent = "Fetching the latest activity…";
      void loadActivity();
    });
  }
}
if (route === "notes") void loadActivity();
if (
  settings.state.animationsEnabled &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.05 },
  );
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("will-reveal");
    observer.observe(element);
  });
}
