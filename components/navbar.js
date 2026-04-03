"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AuthModal from "./auth-modal";
import { readApiJson } from "../lib/client-api";
import { navigationProducts } from "../lib/site-data";

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C8 5 5.5 8.6 5.5 12.2C5.5 17 9 21 12 21C15 21 18.5 17 18.5 12.2C18.5 8.6 16 5 12 2Z" fill="currentColor" />
      <path d="M9 13.1C10.3 11.5 11.6 10.7 13.2 10.1C14 9.8 14.8 9.7 15.7 9.7" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 16.2C10.7 14.8 11.9 13.6 13.4 12.9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar({ onOpenDemo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };

    const onClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await readApiJson("/api/auth/session");
        setCurrentUser(data.authenticated ? data.user : null);
      } catch {
        setCurrentUser(null);
      }
    }

    loadSession();
  }, []);

  const closeMobile = () => setMobileOpen(false);

  async function handleLogout() {
    try {
      await readApiJson("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Keep the UI responsive even if the logout request fails remotely.
    } finally {
      setCurrentUser(null);
      closeMobile();
    }
  }

  return (
    <>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          closeMobile();
        }}
      />

      <header className="topbar-shell" ref={navRef}>
        <div className="topbar">
          <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">
              <LogoMark />
            </span>
            <span>EcoRoute AI</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            <div className="platform-trigger-wrap">
              <button
                type="button"
                className={`nav-link ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-controls="module-menu"
              >
                Modules
                <span className="caret">v</span>
              </button>

              <div id="module-menu" className={`platform-menu ${menuOpen ? "open" : ""}`}>
                {navigationProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/platform/${product.id}`}
                    className="platform-card"
                    onClick={() => setMenuOpen(false)}
                  >
                    <strong>{product.name}</strong>
                    <span>{product.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            <a className="nav-link" href="#overview">
              Overview
            </a>
            <a className="nav-link" href="#modules">
              Modules
            </a>
            <a className="nav-link" href="#operations">
              Operations
            </a>
            <a className="nav-link" href="#impact">
              Impact
            </a>
          </nav>

          <div className="nav-actions">
            {currentUser ? (
              <span className="session-chip">
                {currentUser.name}
                <small>{currentUser.role}</small>
              </span>
            ) : null}

            <a className="ghost-button" href="#pilot">
              See pilot
            </a>

            {currentUser ? (
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <button type="button" className="ghost-button" onClick={() => setAuthOpen(true)}>
                Login
              </button>
            )}

            <button type="button" className="primary-button" onClick={onOpenDemo}>
              Launch pilot
            </button>

            <button
              type="button"
              className={`hamburger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label="Toggle mobile navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
          <div className="mobile-drawer-inner">
            {currentUser ? (
              <div className="mobile-session-card">
                <strong>{currentUser.name}</strong>
                <span>{currentUser.role}</span>
              </div>
            ) : null}

            <div className="mobile-group-title">Modules</div>
            {navigationProducts.map((product) => (
              <Link
                key={product.id}
                href={`/platform/${product.id}`}
                className="mobile-link"
                onClick={closeMobile}
              >
                {product.name}
              </Link>
            ))}

            <div className="divider" />

            <a className="mobile-link" href="#overview" onClick={closeMobile}>
              Overview
            </a>
            <a className="mobile-link" href="#modules" onClick={closeMobile}>
              Modules
            </a>
            <a className="mobile-link" href="#operations" onClick={closeMobile}>
              Operations
            </a>
            <a className="mobile-link" href="#impact" onClick={closeMobile}>
              Impact
            </a>

            <div className="divider" />

            {currentUser ? (
              <button type="button" className="mobile-link button-link" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <button
                type="button"
                className="mobile-link button-link"
                onClick={() => {
                  closeMobile();
                  setAuthOpen(true);
                }}
              >
                Login
              </button>
            )}

            <div className="divider" />

            <button
              type="button"
              className="mobile-link button-link"
              onClick={() => {
                closeMobile();
                onOpenDemo();
              }}
            >
              Launch pilot
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
