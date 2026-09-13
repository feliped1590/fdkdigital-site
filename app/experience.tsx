"use client";
import { useEffect } from "react";
export function ExperienceEnhancer(){useEffect(()=>{const els=[...document.querySelectorAll<HTMLElement>(".reveal")];if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("visible"));return}const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.14,rootMargin:"0px 0px -8%"});els.forEach(e=>io.observe(e));return()=>io.disconnect()},[]);return null}
