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
// ── Minecraft plugin library: compact cards + detail modal ─
// Renders every entry of MC_PLUGINS (src/plugins.ts) into the
// #mc-plugins grid on minecraft.html. Clicking a card opens a
// modal with the full write-up; the open plugin is addressable
// as minecraft#<slug>.
function initMcPlugins() {
    const grid = document.getElementById("mc-plugins");
    if (!grid || typeof MC_PLUGINS === "undefined" || MC_PLUGINS.length === 0)
        return;
    const h = (tag, className = "", text = "") => {
        const el = document.createElement(tag);
        if (className)
            el.className = className;
        if (text)
            el.textContent = text;
        return el;
    };
    const metaLine = (p) => [...p.technologies, ...(p.platform ? [p.platform] : [])].join(" · ");
    // ── Modal shell (one instance, refilled per plugin) ──
    const modal = h("div", "mc-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "mc-modal-title");
    modal.innerHTML = `
    <div class="mc-modal-panel">
      <button type="button" class="mc-modal-close" aria-label="Close">&times;</button>
      <div class="mc-modal-scroll" tabindex="-1">
        <div class="mc-modal-media"><img class="mc-modal-img" alt="" /></div>
        <div class="mc-modal-body">
          <p class="mc-modal-kicker pixel"></p>
          <h3 class="mc-modal-title" id="mc-modal-title"></h3>
          <div class="mc-modal-sections"></div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
    const panel = modal.querySelector(".mc-modal-panel");
    const scroller = modal.querySelector(".mc-modal-scroll");
    const media = modal.querySelector(".mc-modal-media");
    const img = modal.querySelector(".mc-modal-img");
    const kicker = modal.querySelector(".mc-modal-kicker");
    const title = modal.querySelector(".mc-modal-title");
    const sections = modal.querySelector(".mc-modal-sections");
    const closeBtn = modal.querySelector(".mc-modal-close");
    const LINK_LABELS = {
        github: "GitHub",
        discord: "Discord",
        spigot: "SpigotMC",
        modrinth: "Modrinth",
    };
    const fill = (p) => {
        kicker.textContent = metaLine(p);
        title.textContent = p.name;
        if (p.image) {
            img.src = p.image;
            img.alt = `${p.name} screenshot`;
            media.hidden = false;
        }
        else {
            img.removeAttribute("src");
            media.hidden = true;
        }
        sections.replaceChildren();
        // About — reuses the .proj-section styles from project-page.css
        const about = h("div", "proj-section");
        about.appendChild(h("h4", "proj-section-title", "about"));
        const paras = p.longDescription
            ? Array.isArray(p.longDescription) ? p.longDescription : [p.longDescription]
            : [p.description];
        paras.forEach((t) => about.appendChild(h("p", "", t)));
        sections.appendChild(about);
        if (p.features?.length) {
            const feat = h("div", "proj-section");
            feat.appendChild(h("h4", "proj-section-title", "features"));
            const ul = h("ul");
            p.features.forEach((f) => ul.appendChild(h("li", "", f)));
            feat.appendChild(ul);
            sections.appendChild(feat);
        }
        if (p.extra) {
            const extra = h("div", "proj-section");
            extra.appendChild(h("h4", "proj-section-title", "good to know"));
            extra.appendChild(h("p", "", p.extra));
            sections.appendChild(extra);
        }
        const stack = h("div", "proj-section");
        stack.appendChild(h("h4", "proj-section-title", "built with"));
        const list = h("ul", "skill-list");
        [...p.technologies, ...(p.platform ? [p.platform] : []), ...(p.tags ?? [])]
            .forEach((t) => list.appendChild(h("li", "tag pixel", t)));
        if (p.server)
            list.appendChild(h("li", "tag pixel", `Server: ${p.server}`));
        stack.appendChild(list);
        sections.appendChild(stack);
        const linkEntries = Object.entries(p.links ?? {}).filter(([, url]) => Boolean(url));
        if (linkEntries.length) {
            const linksWrap = h("div", "proj-section");
            linksWrap.appendChild(h("h4", "proj-section-title", "links"));
            const row = h("div", "mc-modal-links");
            linkEntries.forEach(([key, url]) => {
                const a = h("a", "btn btn-outline", `${LINK_LABELS[key] ?? key} →`);
                a.href = url;
                a.target = "_blank";
                a.rel = "noopener";
                row.appendChild(a);
            });
            linksWrap.appendChild(row);
            sections.appendChild(linksWrap);
        }
    };
    // ── Scroll lock without layout shift (compensates the
    //    disappearing scrollbar on body + the fixed header) ──
    const header = document.getElementById("site-header");
    const lockScroll = () => {
        const gap = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (gap > 0) {
            document.body.style.paddingRight = `${gap}px`;
            if (header)
                header.style.paddingRight = `${gap}px`;
        }
    };
    const unlockScroll = () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        if (header)
            header.style.paddingRight = "";
    };
    let openSlug = null;
    let lastFocus = null;
    const openModal = (p, updateUrl) => {
        fill(p);
        openSlug = p.slug;
        lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        modal.classList.add("open");
        lockScroll();
        scroller.scrollTop = 0;
        closeBtn.focus();
        if (updateUrl && location.hash !== `#${p.slug}`) {
            history.pushState(null, "", `#${p.slug}`);
        }
    };
    const closeModal = (updateUrl) => {
        if (!openSlug)
            return;
        openSlug = null;
        modal.classList.remove("open");
        unlockScroll();
        lastFocus?.focus();
        lastFocus = null;
        if (updateUrl && location.hash) {
            history.pushState(null, "", location.pathname + location.search);
        }
    };
    // ── Cards ──
    MC_PLUGINS.forEach((p) => {
        const card = h("button", "mc-plugin-card");
        card.type = "button";
        card.setAttribute("aria-haspopup", "dialog");
        const head = h("span", "mc-plugin-head");
        if (p.icon) {
            const ic = h("img", "mc-plugin-icon");
            ic.src = p.icon;
            ic.alt = "";
            head.appendChild(ic);
        }
        head.appendChild(h("span", "mc-plugin-name", p.name));
        card.appendChild(head);
        card.appendChild(h("span", "mc-plugin-meta pixel", metaLine(p)));
        card.appendChild(h("span", "mc-plugin-desc", p.description));
        if (p.tags?.length) {
            const tags = h("span", "mc-plugin-tags");
            p.tags.forEach((t) => tags.appendChild(h("span", "tag pixel", t)));
            card.appendChild(tags);
        }
        card.appendChild(h("span", "mc-plugin-view", "view →"));
        card.addEventListener("click", () => openModal(p, true));
        grid.appendChild(card);
    });
    // ── Close interactions ──
    closeBtn.addEventListener("click", () => closeModal(true));
    modal.addEventListener("click", (e) => {
        if (e.target === modal)
            closeModal(true);
    });
    document.addEventListener("keydown", (e) => {
        if (!openSlug)
            return;
        if (e.key === "Escape") {
            closeModal(true);
            return;
        }
        // Keep Tab focus inside the modal while it's open
        if (e.key === "Tab") {
            const focusables = Array.from(panel.querySelectorAll('a[href], button:not([disabled])'));
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (!first || !last)
                return;
            const active = document.activeElement;
            if (e.shiftKey && (active === first || !panel.contains(active))) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
    // ── Deep links: minecraft#<slug> opens the matching modal,
    //    and back/forward keep it in sync ──
    const syncToHash = () => {
        const slug = decodeURIComponent(location.hash.slice(1));
        const p = slug ? MC_PLUGINS.find((x) => x.slug === slug) : undefined;
        if (p) {
            if (openSlug !== p.slug)
                openModal(p, false);
        }
        else {
            closeModal(false);
        }
    };
    window.addEventListener("popstate", syncToHash);
    syncToHash();
}
// ── Add .reveal class to section content blocks ───────────
function prepareRevealTargets() {
    const targets = document.querySelectorAll(".project-card, .skill-group, .aside-card, .mc-plugin-card");
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
    initMcPlugins();
    prepareRevealTargets();
    initScrollReveal();
    initActiveNav();
    initLightbox();
});
//# sourceMappingURL=app.js.map