"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

if (typeof window !== "undefined" && !pluginsRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
}

export { gsap, ScrollTrigger };

export function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function createCardHover(elements, options = {}) {
  const cards = elements.filter(Boolean);

  if (!cards.length || prefersReducedMotion() || !hasFinePointer()) {
    return () => {};
  }

  const {
    x = 8,
    y = 10,
    rotateX = 5,
    rotateY = 5,
    scale = 1.018,
  } = options;

  const cleanups = [];

  cards.forEach((card) => {
    const moveX = gsap.quickTo(card, "x", { duration: 0.35, ease: "power3.out" });
    const moveY = gsap.quickTo(card, "y", { duration: 0.35, ease: "power3.out" });
    const tiltX = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power3.out" });
    const tiltY = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power3.out" });
    const scaleTo = gsap.quickTo(card, "scale", { duration: 0.35, ease: "power2.out" });

    gsap.set(card, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
      willChange: "transform",
    });

    const onEnter = () => {
      scaleTo(scale);
    };

    const onMove = (event) => {
      const bounds = card.getBoundingClientRect();
      const xProgress = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const yProgress = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      moveX(xProgress * x);
      moveY(yProgress * y);
      tiltX(yProgress * -rotateX);
      tiltY(xProgress * rotateY);
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
      tiltX(0);
      tiltY(0);
      scaleTo(1);
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    cleanups.push(() => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function setVisibleState(targets) {
  const nodes =
    targets && typeof targets.length === "number" && typeof targets !== "string"
      ? Array.from(targets).filter(Boolean)
      : [targets].filter(Boolean);

  if (!nodes.length) {
    return;
  }

  gsap.set(nodes, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    clearProps: "filter",
  });
}
