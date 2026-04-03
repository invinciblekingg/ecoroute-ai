"use client";

import { useEffect, useRef, useState } from "react";
import { readApiJson } from "../lib/client-api";
import { gsap, prefersReducedMotion, setVisibleState } from "../lib/motion";

const initialState = {
  email: "admin@ecoroute.ai",
  password: "Admin@12345",
};

export default function AuthModal({ open, onClose, onAuthSuccess, googleEnabled = false }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const shellRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setMessage("");
      setFieldErrors({});
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !shellRef.current || !cardRef.current) {
      return;
    }

    if (prefersReducedMotion()) {
      setVisibleState([shellRef.current, cardRef.current]);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: "power2.out" }
      );

      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 22,
          scale: 0.96,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.58,
          ease: "power3.out",
        }
      );
    }, shellRef);

    return () => ctx.revert();
  }, [open]);

  function handleGoogleAuth() {
    if (!googleEnabled) {
      setStatus("error");
      setMessage("Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel to enable Google sign-in.");
      return;
    }

    window.location.href = "/api/auth/google/start";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setFieldErrors({});

    try {
      const data = await readApiJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setStatus("success");
      setMessage(`Welcome back, ${data.user?.name ?? "operator"}.`);
      onAuthSuccess?.(data.user ?? null);
      onClose();
    } catch (error) {
      setStatus("error");
      setFieldErrors(error?.data?.errors || {});
      setMessage(error.message || "Login is temporarily unavailable.");
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="modal-shell" ref={shellRef} role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="modal-card" ref={cardRef}>
        <div className="modal-topline">
          <span className="eyebrow">Sign in</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <h2 id="auth-title">Operator access</h2>
        <p>Use the built-in operator account or your own seeded credentials to access the live platform.</p>

        <form className="demo-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className="google-auth-button"
            onClick={handleGoogleAuth}
            disabled={status === "loading"}
          >
            <span className="google-auth-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12.26 10.2v3.92h5.45c-.24 1.25-.95 2.3-2.02 3.01l3.28 2.55c1.91-1.77 3.01-4.37 3.01-7.48 0-.72-.06-1.4-.19-2.06H12.26Z" />
                <path fill="#4285F4" d="M12 21.5c2.73 0 5.02-.9 6.69-2.45l-3.28-2.55c-.91.61-2.07.97-3.41.97-2.62 0-4.84-1.77-5.63-4.15H2.98v2.62A10.1 10.1 0 0 0 12 21.5Z" />
                <path fill="#FBBC05" d="M6.37 13.32A6.06 6.06 0 0 1 6.05 11.5c0-.63.11-1.24.32-1.82V7.06H2.98A10.08 10.08 0 0 0 1.9 11.5c0 1.61.39 3.13 1.08 4.44l3.39-2.62Z" />
                <path fill="#34A853" d="M12 5.53c1.48 0 2.81.51 3.85 1.5l2.89-2.89C17.01 2.54 14.73 1.5 12 1.5A10.1 10.1 0 0 0 2.98 7.06l3.39 2.62C7.16 7.3 9.38 5.53 12 5.53Z" />
              </svg>
            </span>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or use email</span>
          </div>

          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            {fieldErrors.email ? <small>{fieldErrors.email[0]}</small> : null}
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            {fieldErrors.password ? <small>{fieldErrors.password[0]}</small> : null}
          </label>

          <div className="auth-hint">
            Demo login: <strong>admin@ecoroute.ai</strong> / <strong>Admin@12345</strong>
          </div>

          {message ? <div className={`form-status ${status === "success" ? "success" : "error"}`}>{message}</div> : null}

          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={status === "loading"}>
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
