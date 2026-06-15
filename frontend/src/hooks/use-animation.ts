"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimationOptions {
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  stagger?: number;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean;
}

export function useScrollReveal(options: AnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      delay = 0,
      duration = 0.8,
      y = 40,
      x = 0,
      scale = 1,
      opacity = 0,
      stagger = 0,
      trigger,
      start = "top 85%",
      end = "bottom 20%",
      scrub = false,
    } = options;

    const ctx = gsap.context(() => {
      const targets = stagger ? el.children : el;

      gsap.fromTo(
        targets,
        { y, x, scale, opacity: 0, autoAlpha: 0 },
        {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          autoAlpha: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: trigger ? el.closest(trigger) || el : el,
            start,
            end,
            scrub,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => -el.offsetHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

export function useCounter(end: number, duration: number = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { textContent: 0 },
        {
          textContent: end,
          duration,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [end, duration]);

  return ref;
}
