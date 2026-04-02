"use client";

import Link from "next/link";
import { useState } from "react";
import DemoModal from "./demo-modal";
import Navbar from "./navbar";
import Reveal from "./reveal";
import { footerLinks, howItWorks, liveActivity, pricingPlans, products, proofStats, suiteMetrics, systemInsights, testimonials } from "../lib/site-data";

function Icon({ name }) {
  if (name === "analytics") {
    return (
      <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="10" width="3" height="8" rx="1" />
        <rect x="8.5" y="6" width="3" height="12" rx="1" />
        <rect x="15" y="2" width="3" height="16" rx="1" />
      </svg>
    );
  }

  if (name === "growth") {
    return (
      <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 3v4.5L4 14h12l-4-6.5V3M6 3h8" />
        <circle cx="10" cy="16" r="1.5" />
      </svg>
    );
  }

  if (name === "creative") {
    return (
      <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 3l3 3-9 9-4 1 1-4 9-9z" />
        <path d="M12 5l3 3" />
      </svg>
    );
  }

  if (name === "projects") {
    return (
      <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M7 10l2.5 2.5L13 8" />
      </svg>
    );
  }

  if (name === "rise") {
    return (
      <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
        <polyline points="3,14 8,9 12,12 17,5" />
        <path d="M15 5h2v2" />
      </svg>
    );
  }

  if (name === "circle") {
    return (
      <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
        <circle cx="10" cy="8" r="3" />
        <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" />
        <circle cx="3.5" cy="10" r="2" />
        <circle cx="16.5" cy="10" r="2" />
      </svg>
    );
  }

  return (
    <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="9" r="5" />
      <path d="M14.5 14.5L18 18" />
      <path d="M7 9h4M9 7v4" />
    </svg>
  );
}

function ProductCard({ product }) {
  return (
    <Link className="product-card" href={`/platform/${product.id}`}>
      <div className="product-card-top">
        <div className="product-icon" style={{ background: product.iconBg, color: product.iconColor }}>
          <Icon name={product.icon} />
        </div>
        <span className="product-chip">Module</span>
      </div>
      <h3>{product.name}</h3>
      <p className="card-desc">{product.desc}</p>
      <ul className="feature-list">
        {product.featureList.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <span className="product-link" style={{ color: product.iconColor }}>
        Explore {product.name}
      </span>
    </Link>
  );
}

function LiveActivityStrip() {
  return (
    <div className="activity-strip">
      <div className="activity-strip-label">
        <span className="section-kicker">Live activity</span>
        <strong>Signals moving through the system right now</strong>
      </div>
      <div className="activity-marquee">
        {liveActivity.map((item) => (
          <article className="activity-pill" key={item.title}>
            <span>{item.time}</span>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <Navbar onOpenDemo={() => setDemoOpen(true)} />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <main className="page-shell">
        <section className="hero">
          <div className="hero-centered">
            <Reveal className="hero-copy hero-copy-centered">
              <div className="eyebrow badge">New: AI-powered report co-pilot</div>
              <h1>
                <span className="hero-heading-intro">The Operating System</span>
                <span className="hero-heading-sub">for Autonomous Growth</span>
              </h1>
              <p className="hero-text">
                Unify data. Predict what converts. Execute with AI. Kyle.ai is a single, cohesive operating system
                where every module works in concert and insights from one area automatically inform actions in
                another.
              </p>
              <div className="hero-actions hero-actions-centered">
                <button type="button" className="primary-button" onClick={() => setDemoOpen(true)}>
                  Get Started Free
                </button>
                <a className="secondary-button" href="#suite">
                  Watch Demo
                </a>
              </div>
              <p className="micro-note hero-micro-note">No credit card required / Free 14-day trial</p>
            </Reveal>
          </div>
        </section>

        <LiveActivityStrip />

        <section className="proof-strip">
          <Reveal>
            <div className="proof-grid">
              {proofStats.map((item) => (
                <div className="proof-item" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="suite" className="section-block">
          <Reveal className="section-heading">
            <span className="section-kicker">Product Suite</span>
            <h2>An Integrated Suite, Not a Collection of Tools</h2>
            <p>
              Kyle.ai is designed like an operating system. Every module feeds the next, so the UI feels connected,
              intelligent, and alive.
            </p>
          </Reveal>

          <div className="card-grid">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block soft-surface">
          <Reveal className="section-heading">
            <h2>From Signal to Action, Automatically</h2>
            <p>Three steps. No manual intervention required.</p>
          </Reveal>

          <div className="steps-grid">
            {howItWorks.map((step, index) => (
              <Reveal key={step.step} delay={index * 80}>
                <div className="step-card">
                  <div className="step-num">0{step.step}</div>
                  <div className="step-icon">{step.icon === "link" ? "Link" : step.icon === "brain" ? "AI" : "Ship"}</div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-block">
          <Reveal className="section-heading">
            <h2>Deep Feature Cards Built for Real SaaS Workflows</h2>
            <p>Hover states, soft gradients, and layered cards make the system feel premium without becoming noisy.</p>
          </Reveal>

          <div className="metrics-grid system-metrics">
            {systemInsights.map((insight, index) => (
              <Reveal key={insight} delay={index * 60}>
                <article className="feature-card highlight-card">
                  <span className="feature-index">0{index + 1}</span>
                  <h3>{index === 0 ? "AI Workflows" : index === 1 ? "Auto Routing" : "Connected Actions"}</h3>
                  <p>{insight}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="metrics-band">
          <Reveal>
            <div className="metrics-grid">
              {suiteMetrics.map((metric) => (
                <div key={metric.label} className="metric-item">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <small>{metric.source}</small>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section-block">
          <Reveal className="section-heading">
            <h2>Teams That Need Clarity, Velocity, and Control</h2>
            <p>One platform. Different views for different jobs.</p>
          </Reveal>

          <div className="testimonial-grid">
            {testimonials.map((item, index) => (
              <Reveal key={item.author} delay={index * 70}>
                <blockquote className="testimonial-card">
                  <p>"{item.quote}"</p>
                  <footer>
                    <strong>{item.author}</strong>
                    <span>{item.role}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="pricing" className="section-block">
          <Reveal className="section-heading">
            <h2>Simple Entry. Serious Upside.</h2>
            <p>Start small, then expand into the modules that matter most to your team.</p>
          </Reveal>

          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <Reveal key={plan.name}>
                <article className="pricing-card">
                  <span className="section-kicker">{plan.name}</span>
                  <h3>{plan.price}</h3>
                  <p>{plan.blurb}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="cta-banner">
              <div>
                <h3>Ready to see the operating system in action?</h3>
                <p>Book a demo and we will wire the request through the backend so the workflow is actually live.</p>
              </div>
              <button type="button" className="primary-button" onClick={() => setDemoOpen(true)}>
                Book a Demo
              </button>
            </div>
          </Reveal>
        </section>

        <footer id="footer" className="site-footer">
          <div className="footer-grid">
            <div>
              <div className="brand footer-brand">
                <span className="brand-mark">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" fill="currentColor" />
                  </svg>
                </span>
                <span>Kyle.ai</span>
              </div>
              <p>The operating system for autonomous growth.</p>
            </div>
            <div className="footer-links">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
