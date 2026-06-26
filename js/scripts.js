/*
 * Elijah Aken — Glacial Editorial
 * Refined, dependency-free motion: scroll reveals, section index sync, mobile nav.
 */

(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.addEventListener("DOMContentLoaded", () => {
        initReveals();
        initScrollSpy();
        initMobileNav();
    });

    /* ---- Scroll reveals: masked headlines, fade-ups, hairline rules ---- */
    function initReveals() {
        const items = document.querySelectorAll(".reveal, .mask, .rule");

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            items.forEach((el) => el.classList.add("in"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
        );

        items.forEach((el) => observer.observe(el));
    }

    /* ---- Index rail: highlight the section currently in view ---- */
    function initScrollSpy() {
        const links = Array.from(document.querySelectorAll(".index a"));
        const sections = links
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        if (!sections.length || !("IntersectionObserver" in window)) return;

        const setActive = (id) => {
            links.forEach((link) => {
                link.classList.toggle(
                    "is-active",
                    link.getAttribute("href") === "#" + id
                );
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" }
        );

        sections.forEach((section) => observer.observe(section));
    }

    /* ---- Mobile navigation ---- */
    function initMobileNav() {
        const toggle = document.querySelector(".menu-toggle");
        const nav = document.querySelector(".mobile-nav");
        if (!toggle || !nav) return;

        const close = () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            document.body.style.removeProperty("overflow");
        };

        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
            document.body.style.overflow = open ? "hidden" : "";
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", close);
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") close();
        });
    }
})();
