"use client";
import { useEffect } from "react";

export function ExperienceEnhancer() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
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
