"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ModuleWorkbench from "./module-workbench";
import Navbar from "./navbar";
import Reveal from "./reveal";
import { createCardHover, gsap, prefersReducedMotion, setVisibleState } from "../lib/motion";

function ProductIcon({ name }) {
  if (name === "report") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3C8 6.1 5.5 9.4 5.5 13c0 4 3 7 6.5 7s6.5-3 6.5-7c0-3.6-2.5-6.9-6.5-10Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 10v4M10 12h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "ai") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 12h2M14 12h2M9 16c1.2 1 4.8 1 6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "route") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 17c4 0 4-10 8-10s4 10 8 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="6" cy="17" r="1.8" fill="currentColor" />
        <circle cx="12" cy="7" r="1.8" fill="currentColor" />
        <circle cx="18" cy="17" r="1.8" fill="currentColor" />
      </svg>
    );
  }

  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 16h8M8 12h4M8 8h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "worker") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 7h4M9 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "reward") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4l2.5 4 4.5.7-3.2 3.1.8 4.5L12 14.8 7.4 16.3l.8-4.5L5 8.7 9.5 8 12 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }

  return null;
}

export default function ProductPage({ product }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let hoverCleanup = () => {};
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        setVisibleState(root.querySelectorAll("[data-product-intro], [data-product-float], [data-product-orb]"));
        return;
      }

      const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      introTimeline
        .from("[data-product-kicker]", { opacity: 0, y: 18, duration: 0.55 })
        .from("[data-product-title]", { opacity: 0, y: 26, duration: 0.8 }, "-=0.2")
        .from("[data-product-copy]", { opacity: 0, y: 22, duration: 0.7 }, "-=0.45")
        .from("[data-product-cta] > *", { opacity: 0, y: 18, stagger: 0.08, duration: 0.55 }, "-=0.4")
        .from("[data-product-panel]", { opacity: 0, x: 32, duration: 0.9 }, "-=0.65")
        .from("[data-product-float]", { opacity: 0, y: 20, stagger: 0.08, duration: 0.6 }, "-=0.45");

      gsap.to("[data-product-orb]", {
        x: 18,
        y: -22,
        scale: 1.05,
        duration: 8,
        repeat: -1,
        yoyo: true,
        stagger: 0.7,
        ease: "sine.inOut",
      });

      gsap.to("[data-product-float]", {
        y: -10,
        delay: 0.9,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.22,
        ease: "sine.inOut",
      });

      mm.add("(min-width: 781px)", () => {
        const heroDrift = gsap.timeline({
          scrollTrigger: {
            trigger: ".product-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        heroDrift
          .to("[data-product-copy-shell]", { yPercent: -10 }, 0)
          .to("[data-product-panel-shell]", { yPercent: 8 }, 0)
          .to("[data-product-orb]", { scale: 1.08, yPercent: -10 }, 0);

        gsap.utils.toArray("[data-product-parallax]").forEach((element, index) => {
          gsap.to(element, {
            yPercent: index % 2 === 0 ? -4 : 4,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      });

      mm.add("(hover: hover) and (pointer: fine)", () => {
        hoverCleanup = createCardHover(Array.from(root.querySelectorAll("[data-product-card]:not([data-product-float])")), {
          x: 6,
          y: 8,
          rotateX: 4,
          rotateY: 4,
          scale: 1.014,
        });
      });
    }, root);

    return () => {
      hoverCleanup();
      mm.revert();
      ctx.revert();
    };
  }, [product.id]);

  return (
    <>
      <Navbar />

      <main className="eco-shell product-page" ref={rootRef}>
        <section className="product-hero">
          <div className="product-hero-backdrop" aria-hidden="true">
            <span className="product-hero-orb product-orb-a" data-product-orb />
            <span className="product-hero-orb product-orb-b" data-product-orb />
            <span className="product-hero-orb product-orb-c" data-product-orb />
          </div>

          <Reveal className="product-hero-grid">
            <div data-product-copy-shell>
              <div
                className="product-badge"
                style={{ background: product.iconBg, color: product.iconColor }}
                data-product-kicker
                data-product-intro
              >
                <span className="product-icon-inline">
                  <ProductIcon name={product.icon} />
                </span>
                {product.name}
              </div>
              <h1 data-product-title data-product-intro>
                <span className="accent-text">{product.tagline}</span>
              </h1>
              <p className="hero-text" data-product-copy data-product-intro>
                {product.heroDesc}
              </p>
              <div className="hero-actions" data-product-cta data-product-intro>
                <a className="primary-button" href="#live-backend">
                  Open live module
                </a>
                <a className="secondary-button" href="#features">
                  View features
                </a>
              </div>
            </div>

            <div className="hero-panel product-panel" data-product-panel data-product-intro data-product-panel-shell>
              <div className="product-stat-card" data-product-card data-product-float>
                <span className="eyebrow">{product.stat.label}</span>
                <h2 className="product-value" style={{ backgroundImage: product.gradientCSS }}>
                  {product.stat.value}
                </h2>
                <p>{product.stat.desc}</p>
              </div>
              <div className="product-mini-grid">
                {product.metrics.map((metric) => (
                  <article key={metric} className="mini-panel" data-product-card data-product-float>
                    <strong>{metric}</strong>
                    <p>headline metric</p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="features" className="section-block">
          <Reveal className="section-heading">
            <span className="eyebrow">What it does</span>
            <h2>Six core capabilities, fully integrated into one workflow</h2>
            <p>Each feature card connects to the broader EcoRoute loop instead of sitting on its own.</p>
          </Reveal>

          <div className="module-grid">
            {product.features.map((feature, index) => (
              <Reveal key={feature.name} delay={index * 60}>
                <article className="module-card" data-product-card data-product-parallax>
                  <div className="module-card-top">
                    <div className="module-icon" style={{ background: product.iconBg, color: product.iconColor }}>
                      <ProductIcon name={product.icon} />
                    </div>
                    <span className="chip">Capability</span>
                  </div>
                  <h3>{feature.name}</h3>
                  <p>{feature.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block split-surface">
          <Reveal className="section-heading">
            <span className="eyebrow">Who uses it</span>
            <h2>Built for citizens, operators, and field crews</h2>
            <p>Each persona gets a clear, useful view instead of a cluttered one-size-fits-all dashboard.</p>
          </Reveal>

          <div className="workflow-grid">
            {product.personas.map((person, index) => (
              <Reveal key={person.role} delay={index * 60}>
                <article className="workflow-card" data-product-card data-product-parallax>
                  <strong>{person.role}</strong>
                  <p>{person.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <ModuleWorkbench product={product} />

        <section className="section-block">
          <Reveal className="section-heading">
            <span className="eyebrow">How it works</span>
            <h2>The path from report to resolution stays visible</h2>
          </Reveal>

          <div className="workflow-grid">
            {product.steps.map((step, index) => (
              <Reveal key={step} delay={index * 60}>
                <article className="workflow-card" data-product-card data-product-parallax>
                  <div className="step-num">0{index + 1}</div>
                  <p>{step}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <Reveal>
            <div className="cta-banner" data-product-card data-product-parallax>
              <div>
                <span className="eyebrow">Go Live</span>
                <h3>Ready to put {product.name} to work?</h3>
                <p>Open the live backend panel, test the module flow, and watch it sync with the rest of the suite.</p>
              </div>
              <div className="cta-actions">
                <a className="primary-button" href="#live-backend">
                  Open live workspace
                </a>
                <Link className="secondary-button" href="/">
                  Back home
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
