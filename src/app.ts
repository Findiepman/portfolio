// ─────────────────────────────────────────────────────────
// app.ts — Portfolio interactivity
// Compiled to dist/app.js via tsc
// ─────────────────────────────────────────────────────────

// ── Nav: scroll state ─────────────────────────────────────
function initNav(): void {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = (): void => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
}

// ── Nav: hamburger / mobile menu ──────────────────────────
function initMobileMenu(): void {
  const btn   = document.getElementById("hamburger") as HTMLButtonElement | null;
  const menu  = document.getElementById("mobile-menu");
  const links = menu?.querySelectorAll<HTMLAnchorElement>(".mobile-link");

  if (!btn || !menu) return;

  const setOpen = (open: boolean): void => {
    btn.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  btn.addEventListener("click", () => {
    setOpen(!btn.classList.contains("open"));
  });

  links?.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

// ── Intersection observer: scroll-reveal ─────────────────
function initScrollReveal(): void {
  const els = document.querySelectorAll<HTMLElement>(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target as HTMLElement;
          const delay = el.dataset.delay ?? "0";
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("visible");
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

// ── Footer: current year ──────────────────────────────────
function initYear(): void {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

// ── Smooth scroll for anchor links ───────────────────────
function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = 64;
      const top       = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

// ── Active nav link highlight on scroll ──────────────────
function initActiveNav(): void {
  const sections = document.querySelectorAll<HTMLElement>("section[id], footer[id]");
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

// ── Add .reveal class to section content blocks ───────────
function prepareRevealTargets(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    ".project-card, .skill-group, .aside-card"
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.dataset.delay = String((i % 4) * 80);
  });
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initMobileMenu();
  initYear();
  initSmoothScroll();
  prepareRevealTargets();
  initScrollReveal();
  initActiveNav();
});
