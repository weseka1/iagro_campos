import { useEffect } from "react";

// Reveal on scroll usando IntersectionObserver.
// Con red de seguridad: si algo falla (IO ausente, scroll hijack, etc.) NUNCA
// deja una sección invisible — a los 1.8s fuerza el reveal de lo que quede.
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const revelar = (el: HTMLElement) => {
      el.style.transitionDelay = el.dataset.delay || "0ms";
      el.classList.add("is-in");
    };

    if (!("IntersectionObserver" in window)) {
      els.forEach(revelar);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            revelar(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Red de seguridad: nada se queda invisible.
    const safety = window.setTimeout(() => {
      els.forEach((el) => {
        if (!el.classList.contains("is-in")) revelar(el);
      });
    }, 1800);

    return () => {
      clearTimeout(safety);
      io.disconnect();
    };
  }, []);
}
