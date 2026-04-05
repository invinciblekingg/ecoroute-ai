"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "./navbar";
import { createCardHover, gsap, ScrollTrigger, prefersReducedMotion, setVisibleState } from "../lib/motion";
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
    <article className="hero-metric" data-pop data-hover-card>
      <strong>{item.value}</strong>
      <span>{item.label}</span>
    </article>
  );
}

function HeroSignalStrip() {
  const items = [
    {
      label: "Citizen reports",
      value: "312 today",
      accent: "#1fbf8d",
      path: "M4 15c2.8-3.4 5.5-5.1 8.4-5.1 2 0 4 .8 5.8 2.2 1.2 1 1.9 1.8 2.8 3.6",
    },
    {
      label: "AI confidence",
      value: "0.92 score",
      accent: "#3b82f6",
      path: "M5 17l4.2-5 2.8 2.6L18.8 7 21 9.1",
    },
    {
      label: "Cleanup loop",
      value: "24 crews live",
      accent: "#ff8b4a",
      path: "M6 8h9.5L13 5.5M18 16H8.5L11 18.5",
    },
  ];

  return (
    <div className="hero-signal-strip" data-pop>
      {items.map((item) => (
        <article className="hero-signal-card" key={item.label} data-pop data-hover-card>
          <div className="hero-signal-icon" style={{ color: item.accent }} data-signal-icon>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={item.path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function StoryIllustration() {
  return (
    <div className="story-illustration" aria-hidden="true">
      <svg viewBox="0 0 520 220" fill="none">
        <rect x="16" y="18" width="488" height="184" rx="34" fill="url(#storyPanel)" />
        <path
          d="M54 144C127 80 178 66 252 90c62 20 94 63 170 50"
          stroke="#0EA5E9"
          strokeWidth="14"
          strokeLinecap="round"
          data-story-wave
        />
        <path
          d="M80 170C130 126 181 112 236 129c45 14 79 48 126 44"
          stroke="#22C55E"
          strokeWidth="10"
          strokeLinecap="round"
          data-story-wave
        />
        <circle cx="116" cy="101" r="18" fill="#fff" data-story-node />
        <circle cx="116" cy="101" r="8" fill="#FF8B4A" data-story-node />
        <circle cx="276" cy="92" r="16" fill="#fff" data-story-node />
        <circle cx="276" cy="92" r="7" fill="#38BDF8" data-story-node />
        <circle cx="402" cy="136" r="20" fill="#fff" data-story-node />
        <circle cx="402" cy="136" r="9" fill="#22C55E" data-story-node />
        <rect x="64" y="34" width="126" height="36" rx="18" fill="rgba(255,255,255,0.82)" />
        <rect x="328" y="42" width="108" height="30" rx="15" fill="rgba(255,255,255,0.7)" />
        <defs>
          <linearGradient id="storyPanel" x1="34" y1="18" x2="463" y2="202" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E6F4FF" />
            <stop offset="0.45" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EAFBEF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
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
            <article className="live-card live-card-new" key={`${item.title}-${index}`} data-hover-card data-live-card>
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
  const rootRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let hoverCleanup = () => {};
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        setVisibleState(
          root.querySelectorAll(
            "[data-hero-kicker], [data-hero-title] span, [data-hero-copy], [data-hero-cta], [data-hero-chip], [data-hero-panel], [data-reveal], [data-pop]"
          )
        );
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .from("[data-hero-kicker]", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          "[data-hero-title] span",
          {
            yPercent: 120,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
          },
          "-=0.15"
        )
        .from("[data-hero-copy]", { y: 24, opacity: 0, duration: 0.75 }, "-=0.45")
        .from("[data-hero-cta]", { y: 18, opacity: 0, duration: 0.7 }, "-=0.35")
        .from("[data-hero-chip] span", { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35")
        .from("[data-hero-panel]", { x: 28, opacity: 0, duration: 0.9 }, "-=0.75")
        .from("[data-signal-icon]", { rotate: -18, scale: 0.85, stagger: 0.08, duration: 0.45 }, "-=0.45");

      gsap.set("[data-reveal]", { y: 42, opacity: 0 });
      gsap.set("[data-pop]", { y: 26, opacity: 0, scale: 0.96 });

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 84%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            overwrite: true,
          }),
      });

      ScrollTrigger.batch("[data-pop]", {
        start: "top 86%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "back.out(1.28)",
            overwrite: true,
          }),
      });

      gsap.to("[data-hero-orb]", {
        x: 18,
        y: -20,
        scale: 1.06,
        duration: 9,
        repeat: -1,
        yoyo: true,
        stagger: 0.9,
        ease: "sine.inOut",
      });

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

      gsap.to("[data-live-card]", {
        y: -10,
        rotate: 0.6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.12,
          from: "random",
        },
        ease: "sine.inOut",
      });

      gsap.to("[data-story-node]", {
        scale: 1.06,
        transformOrigin: "center center",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
        ease: "sine.inOut",
      });

      gsap.utils.toArray("[data-story-wave]").forEach((line, index) => {
        const length = line.getTotalLength();

        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.15,
          delay: index * 0.14,
          ease: "power2.out",
          scrollTrigger: {
            trigger: line.closest(".story-card-large"),
            start: "top 78%",
            once: true,
          },
        });
      });

      gsap.to("[data-dashboard-marker]", {
        scale: 1.16,
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        stagger: 0.22,
        transformOrigin: "center center",
        ease: "sine.inOut",
      });

      gsap.to("[data-route-chip]", {
        y: -6,
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      mm.add("(min-width: 781px)", () => {
        const heroParallax = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-showcase",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        heroParallax
          .to("[data-hero-copy-shell]", { yPercent: -12 }, 0)
          .to("[data-hero-panel-shell]", { yPercent: 10 }, 0)
          .to("[data-hero-backdrop-shell]", { yPercent: -8, scale: 1.05 }, 0)
          .to("[data-hero-chip] span", { yPercent: -18, stagger: 0.04 }, 0)
          .to("[data-hero-signal-shell]", { yPercent: -6 }, 0);

        gsap.utils.toArray("[data-scroll-parallax]").forEach((element, index) => {
          gsap.to(element, {
            yPercent: index % 2 === 0 ? -5 : 5,
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

      hoverCleanup = createCardHover(Array.from(root.querySelectorAll("[data-hover-card]")), {
        x: 6,
        y: 8,
        rotateX: 4,
        rotateY: 4,
        scale: 1.014,
      });
    }, root);

    return () => {
      hoverCleanup();
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="eco-shell landing-page" ref={rootRef}>
        <section className="hero-section hero-showcase" id="overview">
          <div className="hero-backdrop" aria-hidden="true" data-hero-backdrop-shell>
            <span className="hero-orb orb-a" data-hero-orb />
            <span className="hero-orb orb-b" data-hero-orb />
            <span className="hero-orb orb-c" data-hero-orb />
            <span className="hero-cloud cloud-a" data-cloud />
            <span className="hero-cloud cloud-b" data-cloud />
            <span className="hero-cloud cloud-c" data-cloud />
          </div>

          <div className="hero-grid hero-grid-showcase">
            <div className="hero-copy hero-copy-showcase" data-hero-copy-shell>
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
                EcoRoute AI turns Delhi's messy waste problem into a bright, trackable civic experience. Residents
                drop reports, the system sorts the noise, and crews move with a clear path from alert to cleanup.
              </p>
              <div className="hero-actions" data-hero-cta>
                <Link className="primary-button hero-primary" href="/platform/smart-reporting">
                  Report waste
                </Link>
                <Link className="secondary-button hero-secondary" href="/platform/municipality-dashboard">
                  Open command center
                </Link>
              </div>
              <div className="chip-row hero-chip-row" data-hero-chip>
                <span>Map-first reporting</span>
                <span>AI triage</span>
                <span>Route optimization</span>
                <span>Field crews</span>
              </div>

              <div data-hero-signal-shell>
                <HeroSignalStrip />
              </div>

              <div className="hero-metric-grid">
                {heroStats.map((item) => (
                  <HeroMetric key={item.label} item={item} />
                ))}
              </div>
            </div>

            <div className="hero-panel hero-panel-showcase" data-hero-panel data-hero-panel-shell>
              <div className="hero-sky-stage">
                <div className="hero-sky-card" data-hover-card>
                  <div className="hero-sky-card-top">
                    <span className="eyebrow">Live Delhi pulse</span>
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
            <article className="story-card story-card-large" data-pop data-hover-card data-scroll-parallax>
              <span className="eyebrow">Intake</span>
              <h2>Drop a report in seconds from map, camera, or GPS.</h2>
              <p>
                Citizens can capture proof, tag the waste type, and submit a report that lands in the queue without
                any manual sorting.
              </p>
              <StoryIllustration />
            </article>
            <article className="story-card" data-pop data-hover-card data-scroll-parallax>
              <span className="eyebrow">AI</span>
              <strong>Classify the waste and raise urgent items first.</strong>
              <p>Hazardous and high-priority reports move ahead automatically.</p>
            </article>
            <article className="story-card" data-pop data-hover-card data-scroll-parallax>
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
              Each module keeps Delhi's cleanup loop visible, with a more editorial visual language and a lot more motion.
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
            <div className="dashboard-map dashboard-map-new" data-hover-card data-scroll-parallax>
              <div className="dashboard-map-top">
                <span className="eyebrow">Live Delhi map</span>
                <strong>Dispatch board</strong>
              </div>
              <div className="dashboard-map-canvas dashboard-map-canvas-new">
                <div className="dashboard-route dashboard-route-new" />
                <div className="dashboard-marker urgent" data-dashboard-marker />
                <div className="dashboard-marker medium" data-dashboard-marker />
                <div className="dashboard-marker resolved" data-dashboard-marker />
                <div className="dashboard-route-chip" data-route-chip>route A</div>
              </div>
            </div>

            <div className="dashboard-panels">
              {dashboardPanels.map((panel) => (
                <article className="mini-panel mini-panel-new" key={panel.title} data-pop data-hover-card data-scroll-parallax>
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

        <footer id="footer" className="site-footer site-footer-showcase">
          <div className="footer-shell" data-reveal>
            <div className="footer-spotlight" data-pop data-hover-card data-scroll-parallax>
              <div className="footer-spotlight-grid">
                <div className="footer-spotlight-copy">
                  <span className="eyebrow">Connected cleanup network</span>
                  <h3>EcoRoute links every waste report, field crew, and control room decision into one visible loop.</h3>
                  <p>
                    Residents report, AI triages the signal, operators dispatch the fastest route, and the public sees
                    progress instead of silence.
                  </p>

                  <div className="footer-spotlight-actions">
                    <Link className="primary-button" href="/platform/smart-reporting">
                      Get started
                    </Link>
                    <Link className="footer-video-link" href="/platform/municipality-dashboard">
                      <span className="footer-video-icon" aria-hidden="true">
                        ▶
                      </span>
                      Watch command flow
                    </Link>
                  </div>
                </div>

                <div className="footer-spotlight-side">
                  <p className="footer-spotlight-note">
                    Built around Delhi operations, but designed like a reusable control surface for high-volume civic
                    cleanup systems.
                  </p>

                  <div className="footer-spotlight-metrics">
                    {heroStats.slice(0, 3).map((item) => (
                      <article className="footer-spotlight-metric" key={item.label}>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="footer-spotlight-pattern footer-spotlight-pattern-left" aria-hidden="true" />
              <div className="footer-spotlight-pattern footer-spotlight-pattern-right" aria-hidden="true" />
              <div className="footer-spotlight-line footer-spotlight-line-a" aria-hidden="true" />
              <div className="footer-spotlight-line footer-spotlight-line-b" aria-hidden="true" />
            </div>

            <div className="footer-watermark" aria-hidden="true">
              ECOROUTE
            </div>

            <div className="footer-main-surface">
              <div className="footer-grid footer-grid-showcase">
                <div className="footer-brand-block">
                  <div className="brand footer-brand">
                    <span className="brand-mark">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2C8 5 5.5 8.6 5.5 12.2C5.5 17 9 21 12 21C15 21 18.5 17 18.5 12.2C18.5 8.6 16 5 12 2Z" fill="currentColor" />
                      </svg>
                    </span>
                    <span>EcoRoute AI</span>
                  </div>
                  <p>
                    Citizen-powered waste intelligence for cleaner streets, faster dispatch, and public updates that stay
                    visible instead of disappearing into a backlog.
                  </p>
                  <div className="footer-pill-row">
                    <span>Map-first reporting</span>
                    <span>AI prioritization</span>
                    <span>Route visibility</span>
                  </div>
                </div>

                <div className="footer-column footer-column-links">
                  <span className="footer-title">Explore</span>
                  <div className="footer-link-list">
                    {footerLinks.map((link) => (
                      <a key={link.label} href={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="footer-column footer-column-modules">
                  <span className="footer-title">Core Modules</span>
                  <div className="footer-link-list footer-link-list-rich">
                    {moduleLibrary.slice(0, 4).map((module) => (
                      <Link key={module.id} href={`/platform/${module.id}`} className="footer-module-link">
                        <strong>{module.name}</strong>
                        <span>{module.tagline}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="footer-column footer-note-card">
                  <span className="footer-title">Why it lands</span>
                  <p>
                    Designed for Delhi today, but structured like a reusable city operations loop that can scale to more
                    neighborhoods and more crews.
                  </p>
                  <div className="footer-note-list">
                    <div>
                      <strong>Public trust</strong>
                      <span>Residents can see movement from issue to cleanup.</span>
                    </div>
                    <div>
                      <strong>Operator clarity</strong>
                      <span>Dispatch and field teams work from the same visible signal chain.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <p>EcoRoute AI &copy; {currentYear}. Cleaner cities through transparent waste response.</p>
                <div className="footer-bottom-links">
                  <Link href="/platform/route-optimizer">Route optimizer</Link>
                  <Link href="/platform/worker-panel">Worker panel</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}



