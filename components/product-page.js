"use client";

import Link from "next/link";
import { useState } from "react";
import DemoModal from "./demo-modal";
import ModuleWorkbench from "./module-workbench";
import Navbar from "./navbar";
import Reveal from "./reveal";

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
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <Navbar onOpenDemo={() => setDemoOpen(true)} />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <main className="eco-shell product-page">
        <section className="product-hero">
          <Reveal className="product-hero-grid">
            <div>
              <div className="product-badge" style={{ background: product.iconBg, color: product.iconColor }}>
                <span className="product-icon-inline">
                  <ProductIcon name={product.icon} />
                </span>
                {product.name}
              </div>
              <h1>
                <span className="accent-text">{product.tagline}</span>
              </h1>
              <p className="hero-text">{product.heroDesc}</p>
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={() => setDemoOpen(true)}>
                  Request pilot
                </button>
                <a className="secondary-button" href="#features">
                  View features
                </a>
              </div>
            </div>

            <div className="hero-panel product-panel">
              <div className="product-stat-card">
                <span className="eyebrow">{product.stat.label}</span>
                <h2 className="product-value" style={{ backgroundImage: product.gradientCSS }}>
                  {product.stat.value}
                </h2>
                <p>{product.stat.desc}</p>
              </div>
              <div className="product-mini-grid">
                {product.metrics.map((metric) => (
                  <article key={metric} className="mini-panel">
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
                <article className="module-card">
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
                <article className="workflow-card">
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
                <article className="workflow-card">
                  <div className="step-num">0{index + 1}</div>
                  <p>{step}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <Reveal>
            <div className="cta-banner">
              <div>
                <span className="eyebrow">Pilot ready</span>
                <h3>Ready to {product.ctaAction}?</h3>
                <p>Open the pilot form, then we can adapt the site later into a larger repo if you like the direction.</p>
              </div>
              <div className="cta-actions">
                <button type="button" className="primary-button" onClick={() => setDemoOpen(true)}>
                  Request pilot
                </button>
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
