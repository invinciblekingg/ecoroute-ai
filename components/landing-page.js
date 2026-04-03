"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DemoModal from "./demo-modal";
import Navbar from "./navbar";
import {
  dashboardPanels,
  footerLinks,
  heroStats,
  impactCards,
  liveActivity,
  moduleLibrary,
  testimonials,
  workflowSteps,
} from "../lib/site-data";

gsap.registerPlugin(ScrollTrigger);

function ModuleIcon({ name }) {
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

  return <span aria-hidden="true">Go</span>;
}

function ModuleCard({ module }) {
  return (
    <Link
      className="module-card module-card-new module-card-link"
      href={`/platform/${module.id}`}
      aria-label={`Open ${module.name}`}
      data-pop
      data-hover-card
    >
      <div className="module-card-top">
        <div className="module-icon" style={{ background: module.iconBg, color: module.iconColor }}>
          <ModuleIcon name={module.icon} />
        </div>
        <span className="chip chip-soft">Core module</span>
      </div>
      <div className="module-copy-stack">
        <span className="eyebrow">{module.tagline}</span>
        <h3>{module.name}</h3>
        <p>{module.desc}</p>
      </div>
      <ul>
        {module.featureList.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <span className="module-card-link-row">
        <span>Open module</span>
        <span aria-hidden="true">-&gt;</span>
      </span>
    </Link>
  );
}

function WorkflowCard({ step }) {
  return (
    <article className="workflow-card workflow-card-new" data-pop data-hover-card>
      <div className="step-num">0{step.step}</div>
      <h3>{step.title}</h3>
      <p>{step.copy}</p>
    </article>
  );
}

function HeroMetric({ item }) {
  return (
    <article className="hero-metric" data-pop>
      <strong>{item.value}</strong>
      <span>{item.label}</span>
    </article>
  );
}

function LiveMarquee() {
  const items = [...liveActivity, ...liveActivity];

  return (
    <div className="live-strip live-strip-new" data-reveal>
      <div className="live-strip-head">
        <span className="eyebrow">Live activity</span>
        <strong>Signals moving through the system right now</strong>
      </div>
      <div className="live-marquee" aria-label="Live activity feed">
        <div className="live-track" data-marquee-track>
          {items.map((item, index) => (
            <article className="live-card live-card-new" key={`${item.title}-${index}`} data-hover-card>
              <span>{item.time}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [pilotOpen, setPilotOpen] = useState(false);

  useEffect(() => {
    const hoverCleanups = [];
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .from("[data-hero-kicker]", { y: 18, opacity: 0, duration: 0.6 })
        .from("[data-hero-title] span", {
          yPercent: 120,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
        }, "-=0.15")
        .from("[data-hero-copy]", { y: 24, opacity: 0, duration: 0.75 }, "-=0.45")
        .from("[data-hero-cta]", { y: 18, opacity: 0, duration: 0.7 }, "-=0.35")
        .from("[data-hero-chip]", { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35")
        .from("[data-hero-panel]", { x: 28, opacity: 0, duration: 0.9 }, "-=0.75");

      gsap.to("[data-cloud]", {
        x: 28,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.45,
      });

      gsap.to("[data-hill]", {
        scaleX: 1.015,
        scaleY: 1.03,
        transformOrigin: "bottom center",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("[data-float]", {
        y: -14,
        x: 10,
        rotate: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
      });

      gsap.to("[data-orbit]", {
        rotate: 360,
        duration: 42,
        repeat: -1,
        ease: "none",
      });

      gsap.to("[data-path-dash]", {
        xPercent: 12,
        duration: 2.5,
        repeat: -1,
        ease: "none",
      });

      gsap.to("[data-marquee-track]", {
        xPercent: -50,
        duration: 26,
        repeat: -1,
        ease: "none",
      });

      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
            },
          }
        );
      });

      gsap.utils.toArray("[data-pop]").forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.04,
            ease: "back.out(1.35)",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
            },
          }
        );
      });

      const hoverables = gsap.utils.toArray("[data-hover-card]");

      hoverables.forEach((el) => {
        const onEnter = () => gsap.to(el, { y: -10, scale: 1.015, duration: 0.28, ease: "power2.out" });
        const onLeave = () => gsap.to(el, { y: 0, scale: 1, duration: 0.32, ease: "power2.out" });

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        hoverCleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    });

    return () => {
      hoverCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Navbar onOpenDemo={() => setPilotOpen(true)} />
      <DemoModal open={pilotOpen} onClose={() => setPilotOpen(false)} />

      <main className="eco-shell landing-page">
        <section className="hero-section hero-showcase" id="overview">
          <div className="hero-backdrop" aria-hidden="true">
            <span className="hero-orb orb-a" />
            <span className="hero-orb orb-b" />
            <span className="hero-orb orb-c" />
            <span className="hero-cloud cloud-a" data-cloud />
            <span className="hero-cloud cloud-b" data-cloud />
            <span className="hero-cloud cloud-c" data-cloud />
          </div>

          <div className="hero-grid hero-grid-showcase">
            <div className="hero-copy hero-copy-showcase">
              <span className="eyebrow hero-eyebrow" data-hero-kicker>
                Citizen-powered waste intelligence
              </span>
              <h1 className="hero-title" data-hero-title>
                <span>WHERE WASTE</span>
                <span>BECOMES</span>
                <span className="hero-title-accent">
                  <em>Worth</em>
                </span>
              </h1>
              <p className="hero-text hero-text-showcase" data-hero-copy>
                EcoRoute AI turns a messy city problem into a bright, trackable civic experience. Residents drop
                reports, the system sorts the noise, and crews move with a clear path from alert to cleanup.
              </p>
              <div className="hero-actions" data-hero-cta>
                <Link className="primary-button hero-primary" href="/platform/smart-reporting">
                  Report waste
                </Link>
                <a className="secondary-button hero-secondary" href="#modules">
                  View live modules
                </a>
              </div>
              <div className="chip-row hero-chip-row" data-hero-chip>
                <span>Map-first reporting</span>
                <span>AI triage</span>
                <span>Route optimization</span>
                <span>Field crews</span>
              </div>

              <div className="hero-metric-grid">
                {heroStats.map((item) => (
                  <HeroMetric key={item.label} item={item} />
                ))}
              </div>
            </div>

            <div className="hero-panel hero-panel-showcase" data-hero-panel>
              <div className="hero-sky-stage">
                <div className="hero-sky-card" data-hover-card>
                  <div className="hero-sky-card-top">
                    <span className="eyebrow">Live city pulse</span>
                    <strong>18 active signals</strong>
                  </div>
                  <div className="hero-artboard">
                    <div className="hero-art-half art-blue" />
                    <div className="hero-art-half art-green" />
                    <div className="hero-art-line" />
                    <div className="hero-art-line alt" />
                  </div>
                  <p>
                    Reports move from a bright intake form into dispatch, with proof and status updates that stay
                    visible.
                  </p>
                </div>

                <div className="hero-landscape">
                  <div className="hero-hill hill-back" data-hill />
                  <div className="hero-hill hill-front" data-hill />
                  <div className="hero-path path-main" data-path-dash />
                  <div className="hero-path path-secondary" data-path-dash />

                  <div className="hero-marker marker-urgent" data-float>
                    <span>Urgent</span>
                    <strong>Hazardous spill</strong>
                  </div>
                  <div className="hero-marker marker-medium" data-float>
                    <span>Queued</span>
                    <strong>Plastic cluster</strong>
                  </div>
                  <div className="hero-marker marker-green" data-float>
                    <span>Done</span>
                    <strong>Park sweep</strong>
                  </div>

                  <div className="hero-pin-card" data-hover-card>
                    <div className="hero-pin-preview">
                      <div className="hero-pin-left" />
                      <div className="hero-pin-right" />
                    </div>
                    <div className="hero-pin-copy">
                      <span className="eyebrow">Before / after</span>
                      <strong>Show the cleanup, not just the complaint.</strong>
                      <p>
                        The public sees a live loop: report, route, cleanup, and resolution in one place.
                      </p>
                    </div>
                  </div>

                  <div className="hero-orbit-ring" data-orbit aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <LiveMarquee />
        </section>

        <section className="section-block">
          <div className="story-strip" data-reveal>
            <article className="story-card story-card-large" data-pop data-hover-card>
              <span className="eyebrow">Intake</span>
              <h2>Drop a report in seconds from map, camera, or GPS.</h2>
              <p>
                Citizens can capture proof, tag the waste type, and submit a report that lands in the queue without
                any manual sorting.
              </p>
            </article>
            <article className="story-card" data-pop data-hover-card>
              <span className="eyebrow">AI</span>
              <strong>Classify the waste and raise urgent items first.</strong>
              <p>Hazardous and high-priority reports move ahead automatically.</p>
            </article>
            <article className="story-card" data-pop data-hover-card>
              <span className="eyebrow">Dispatch</span>
              <strong>Turn the backlog into a clean route plan.</strong>
              <p>Nearby stops, travel time, and field capacity get balanced in one pass.</p>
            </article>
          </div>
        </section>

        <section id="modules" className="section-block">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Core modules</span>
            <h2>Built like a bright control panel, not a boring admin site</h2>
            <p>
              Each module keeps the city loop visible, with a more editorial visual language and a lot more motion.
            </p>
          </div>

          <div className="module-grid module-grid-new">
            {moduleLibrary.map((module, index) => (
              <ModuleCard module={module} key={module.id} delay={index * 60} />
            ))}
          </div>
        </section>

        <section id="operations" className="section-block split-surface split-surface-new">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Operations</span>
            <h2>From report to pickup, the loop stays visible at every step</h2>
            <p>
              Dispatch sees the queue, crews see the route, and citizens see the status. The whole thing feels alive.
            </p>
          </div>

          <div className="workflow-grid workflow-grid-new">
            {workflowSteps.map((step, index) => (
              <WorkflowCard key={step.step} step={step} delay={index * 70} />
            ))}
          </div>

          <div className="dashboard-shell dashboard-shell-new" data-reveal>
            <div className="dashboard-map dashboard-map-new" data-hover-card>
              <div className="dashboard-map-top">
                <span className="eyebrow">Live city map</span>
                <strong>Dispatch board</strong>
              </div>
              <div className="dashboard-map-canvas dashboard-map-canvas-new">
                <div className="dashboard-route dashboard-route-new" />
                <div className="dashboard-marker urgent" />
                <div className="dashboard-marker medium" />
                <div className="dashboard-marker resolved" />
                <div className="dashboard-route-chip">route A</div>
              </div>
            </div>

            <div className="dashboard-panels">
              {dashboardPanels.map((panel) => (
                <article className="mini-panel mini-panel-new" key={panel.title} data-pop data-hover-card>
                  <strong>{panel.title}</strong>
                  <p>{panel.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="section-block">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Impact</span>
            <h2>Designed to feel bright, useful, and very real</h2>
            <p>
              Predictive analytics, transparency, and engagement combine into one civic loop that is easy to demo and
              easy to understand.
            </p>
          </div>

          <div className="impact-grid impact-grid-new">
            {impactCards.map((card, index) => (
              <article className="impact-card impact-card-new" key={card.title} data-pop data-hover-card>
                <strong>{card.title}</strong>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <div className="testimonial-grid testimonial-grid-new">
            {testimonials.map((item, index) => (
              <blockquote className="testimonial-card testimonial-card-new" key={item.author} data-pop data-hover-card>
                <p>{item.quote}</p>
                <footer>
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="pilot" className="section-block">
          <div className="cta-banner cta-banner-new" data-reveal>
            <div>
              <span className="eyebrow">Pilot ready</span>
              <h3>Make the map the hero, then animate the whole story.</h3>
              <p>
                The landing page now feels much more like a living campaign site. If you like the direction, I can
                keep pushing the rest of the app to match it.
              </p>
            </div>
            <button type="button" className="primary-button" onClick={() => setPilotOpen(true)}>
              Request a pilot
            </button>
          </div>
        </section>

        <footer id="footer" className="site-footer">
          <div className="footer-grid">
            <div>
              <div className="brand footer-brand">
                <span className="brand-mark">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8 5 5.5 8.6 5.5 12.2C5.5 17 9 21 12 21C15 21 18.5 17 18.5 12.2C18.5 8.6 16 5 12 2Z" fill="currentColor" />
                  </svg>
                </span>
                <span>EcoRoute AI</span>
              </div>
              <p>Citizen-powered waste management with bright visual storytelling, AI routing, and live transparency.</p>
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



