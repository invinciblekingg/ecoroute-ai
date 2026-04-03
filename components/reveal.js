"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, setVisibleState } from "../lib/motion";

export default function Reveal({ children, className = "", delay = 0, distance = 28 }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (prefersReducedMotion()) {
      setVisibleState(element);
      return;
    }

    const animation = gsap.fromTo(
      element,
      {
        opacity: 0,
        y: distance,
        scale: 0.985,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        delay: delay / 1000,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
          once: true,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [delay, distance]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
