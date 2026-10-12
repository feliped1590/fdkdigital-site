"use client";
import { useEffect } from "react";

export function ExperienceEnhancer() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".reveal")];
    // Usa o `observer` que a própria callback recebe, em vez de fechar sobre a
    // variável `io` — que o TypeScript, com razão, considera possivelmente nula.
    // É a mesma instância; o comportamento não muda.
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver((entries, observer) => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }), { threshold: .14, rootMargin: "0px 0px -8%" })
      : null;

    if (io) els.forEach(el => io.observe(el));
    else els.forEach(el => el.classList.add("visible"));

    let lastY = window.scrollY;
    let settleTimer = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const movingDown = currentY > lastY + 5 && currentY > 120;
      document.documentElement.classList.toggle("scrolling-down", movingDown);
      lastY = currentY;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => document.documentElement.classList.remove("scrolling-down"), 700);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(settleTimer);
      document.documentElement.classList.remove("scrolling-down");
    };
  }, []);

  return null;
}
