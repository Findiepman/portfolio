"use strict";
// ─────────────────────────────────────────────────────────
// app.ts — Portfolio interactivity
// Compiled to dist/app.js via tsc
// ─────────────────────────────────────────────────────────
// ── Nav: scroll state ─────────────────────────────────────
function initNav() {
    const header = document.getElementById("site-header");
    if (!header)
        return;
    const onScroll = () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load
}
// ── Nav: hamburger / mobile menu ──────────────────────────
function initMobileMenu() {
    const btn = document.getElementById("hamburger");
    const menu = document.getElementById("mobile-menu");
    const links = menu?.querySelectorAll(".mobile-link");
    if (!btn || !menu)
        return;
    const setOpen = (open) => {
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
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay ?? "0";
                el.style.transitionDelay = `${delay}ms`;
                el.classList.add("visible");
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => observer.observe(el));
}
// ── Footer: current year ──────────────────────────────────
function initYear() {
    const el = document.getElementById("year");
    if (el)
        el.textContent = String(new Date().getFullYear());
}
// ── Smooth scroll for anchor links ───────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#")
                return;
            const target = document.querySelector(href);
            if (!target)
                return;
            e.preventDefault();
            const navHeight = 64;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}
// ── Active nav link highlight on scroll ──────────────────
function initActiveNav() {
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length || !navLinks.length)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { threshold: 0.35 });
    sections.forEach((sec) => observer.observe(sec));
}
// ── Lightbox: click a screenshot to enlarge + zoom/pan ────
function initLightbox() {
    const shots = document.querySelectorAll(".gallery-item img, .proj-shot img");
    if (!shots.length)
        return;
    const MIN_SCALE = 1;
    const MAX_SCALE = 5;
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Screenshot viewer");
    overlay.innerHTML = `
    <div class="lightbox-stage"><img class="lightbox-img" alt="" /></div>
    <p class="lightbox-caption"></p>
    <div class="lightbox-controls">
      <button type="button" class="lightbox-btn" data-zoom="out" aria-label="Zoom out">&minus;</button>
      <button type="button" class="lightbox-btn" data-zoom="in" aria-label="Zoom in">+</button>
      <button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>
    </div>`;
    document.body.appendChild(overlay);
    const stage = overlay.querySelector(".lightbox-stage");
    const img = overlay.querySelector(".lightbox-img");
    const caption = overlay.querySelector(".lightbox-caption");
    const closeBtn = overlay.querySelector(".lightbox-close");
    let scale = 1;
    let tx = 0;
    let ty = 0;
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let lastFocus = null;
    const apply = () => {
        img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        img.classList.toggle("zoomed", scale > 1);
    };
    const reset = () => {
        scale = 1;
        tx = 0;
        ty = 0;
        apply();
    };
    // Zoom toward a viewport point so it stays under the cursor
    const zoomAt = (cx, cy, factor) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
        if (next === scale)
            return;
        const rect = stage.getBoundingClientRect();
        const ox = cx - (rect.left + rect.width / 2);
        const oy = cy - (rect.top + rect.height / 2);
        tx = ox - ((ox - tx) / scale) * next;
        ty = oy - ((oy - ty) / scale) * next;
        if (next === MIN_SCALE) {
            tx = 0;
            ty = 0;
        }
        scale = next;
        apply();
    };
    const open = (source) => {
        lastFocus = source;
        img.src = source.currentSrc || source.src;
        img.alt = source.alt;
        caption.textContent =
            source.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? "";
        reset();
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    };
    const close = () => {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
        lastFocus?.focus();
    };
    // Wheel: zoom toward the cursor
    stage.addEventListener("wheel", (e) => {
        e.preventDefault();
        zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.2 : 1 / 1.2);
    }, { passive: false });
    // Drag to pan while zoomed in
    img.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        dragging = true;
        moved = false;
        lastX = e.clientX;
        lastY = e.clientY;
        img.setPointerCapture(e.pointerId);
        img.classList.add("dragging");
    });
    img.addEventListener("pointermove", (e) => {
        if (!dragging || scale === 1)
            return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2)
            moved = true;
        tx += dx;
        ty += dy;
        lastX = e.clientX;
        lastY = e.clientY;
        apply();
    });
    const endDrag = () => {
        dragging = false;
        img.classList.remove("dragging");
    };
    img.addEventListener("pointerup", endDrag);
    img.addEventListener("pointercancel", endDrag);
    // Double-click: toggle between fit and 2x
    img.addEventListener("dblclick", (e) => {
        if (scale > 1)
            reset();
        else
            zoomAt(e.clientX, e.clientY, 2);
    });
    // Single click on the un-zoomed image also zooms in a step
    img.addEventListener("click", (e) => {
        if (moved)
            return;
        if (scale === 1)
            zoomAt(e.clientX, e.clientY, 2);
    });
    // Click on the dark backdrop closes
    stage.addEventListener("click", (e) => {
        if (e.target === stage)
            close();
    });
    overlay.querySelectorAll("[data-zoom]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const rect = stage.getBoundingClientRect();
            const factor = btn.dataset.zoom === "in" ? 1.5 : 1 / 1.5;
            zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
        });
    });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if (!overlay.classList.contains("open"))
            return;
        if (e.key === "Escape")
            close();
        if (e.key === "+" || e.key === "=")
            zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.5);
        if (e.key === "-")
            zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1 / 1.5);
    });
    // Make every screenshot clickable (and keyboard-reachable)
    shots.forEach((shot) => {
        shot.classList.add("lightbox-trigger");
        shot.setAttribute("tabindex", "0");
        shot.setAttribute("role", "button");
        shot.addEventListener("click", () => open(shot));
        shot.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(shot);
            }
        });
    });
}
// ── Add .reveal class to section content blocks ───────────
function prepareRevealTargets() {
    const targets = document.querySelectorAll(".project-card, .skill-group, .aside-card");
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
    initLightbox();
});
//# sourceMappingURL=app.js.map