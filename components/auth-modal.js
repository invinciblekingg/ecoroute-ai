"use client";

import { useEffect, useState } from "react";
import { readApiJson } from "../lib/client-api";

const initialState = {
  email: "admin@ecoroute.ai",
  password: "Admin@12345",
};

export default function AuthModal({ open, onClose, onAuthSuccess }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="modal-card">
        <div className="modal-topline">
          <span className="eyebrow">Sign in</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <h2 id="auth-title">Operator access</h2>
        <p>Use the built-in operator account or your own seeded credentials to access the live platform.</p>

        <form className="demo-form" onSubmit={handleSubmit}>
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
