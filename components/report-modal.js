"use client";

import { useEffect, useRef, useState } from "react";
import { locationOptions, severityOptions, wasteCategories } from "../lib/ecoroute-domain";
import { readApiJson } from "../lib/client-api";

const initialState = {
  reporterName: "",
  contact: "",
  locationId: locationOptions[0]?.id ?? "",
  category: "plastic",
  severity: "3",
  description: "",
  notes: "",
  latitude: "",
  longitude: "",
};

export default function ReportModal({ open, onClose }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [file, setFile] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setMessage("");
      setFieldErrors({});
      setForm(initialState);
      setFile(null);
      setGpsStatus("");
      setFileKey((value) => value + 1);
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

  async function useGps() {
    if (!navigator.geolocation) {
      setGpsStatus("GPS is not available in this browser.");
      return;
    }

    setGpsStatus("Requesting GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((value) => ({
          ...value,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
          locationId: value.locationId || "",
        }));
        setGpsStatus("GPS locked.");
      },
      () => {
        setGpsStatus("GPS permission was denied.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setFieldErrors({});

    const payload = new FormData();
    payload.set("reporterName", form.reporterName);
    payload.set("contact", form.contact);
    payload.set("locationId", form.locationId);
    payload.set("category", form.category);
    payload.set("severity", form.severity);
    payload.set("description", form.description);
    payload.set("notes", form.notes);
    payload.set("source", "hero-report");

    if (form.latitude) {
      payload.set("latitude", form.latitude);
    }

    if (form.longitude) {
      payload.set("longitude", form.longitude);
    }

    if (file) {
      payload.append("proof", file);
    }

    try {
      const data = await readApiJson("/api/reports", {
        method: "POST",
        body: payload,
      });

      setStatus("success");
      setMessage(`Report submitted. ${data.report?.title ?? "The case"} is now in the live queue.`);
      setForm(initialState);
      setFile(null);
      setGpsStatus("");
      setFileKey((value) => value + 1);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setStatus("error");
      setFieldErrors(error?.data?.errors || {});
      setMessage(error.message || "The report service is temporarily unavailable.");
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="modal-card">
        <div className="modal-topline">
          <span className="eyebrow">Report waste</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <h2 id="report-title">Submit a city cleanup report</h2>
        <p>
          Add the location, category, severity, and proof. The backend will classify the report and push it into
          the live queue.
        </p>

        <form className="demo-form" onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input
              value={form.reporterName}
              onChange={(event) => setForm((value) => ({ ...value, reporterName: event.target.value }))}
              autoComplete="name"
              placeholder="Aisha Khan"
            />
            {fieldErrors.reporterName ? <small>{fieldErrors.reporterName[0]}</small> : null}
          </label>

          <label>
            <span>Contact</span>
            <input
              value={form.contact}
              onChange={(event) => setForm((value) => ({ ...value, contact: event.target.value }))}
              autoComplete="email"
              placeholder="aisha@example.com"
            />
            {fieldErrors.contact ? <small>{fieldErrors.contact[0]}</small> : null}
          </label>

          <div className="report-grid-2">
            <label>
              <span>Location</span>
              <select
                value={form.locationId}
                onChange={(event) => setForm((value) => ({ ...value, locationId: event.target.value }))}
              >
                {locationOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} - {option.ward}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))}
              >
                {wasteCategories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="report-grid-2">
            <label>
              <span>Severity</span>
              <select
                value={form.severity}
                onChange={(event) => setForm((value) => ({ ...value, severity: event.target.value }))}
              >
                {severityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="report-gps-stack">
              <span className="report-gps-label">GPS</span>
              <button type="button" className="ghost-button report-gps-button" onClick={useGps}>
                Use current location
              </button>
              {gpsStatus ? <small className="report-note">{gpsStatus}</small> : null}
            </div>
          </div>

          <div className="report-grid-2">
            <label>
              <span>Latitude</span>
              <input
                value={form.latitude}
                onChange={(event) => setForm((value) => ({ ...value, latitude: event.target.value }))}
                placeholder="28.6139"
              />
            </label>
            <label>
              <span>Longitude</span>
              <input
                value={form.longitude}
                onChange={(event) => setForm((value) => ({ ...value, longitude: event.target.value }))}
                placeholder="77.2090"
              />
            </label>
          </div>

          <label className="full-width">
            <span>Description</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))}
              placeholder="Describe the waste problem, how large it is, and what makes it urgent."
            />
            {fieldErrors.description ? <small>{fieldErrors.description[0]}</small> : null}
          </label>

          <label className="full-width">
            <span>Cleanup notes</span>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))}
              placeholder="Optional details for the operations team."
            />
          </label>

          <label className="full-width">
            <span>Photo or video proof</span>
            <input
              key={fileKey}
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file ? <small>Selected: {file.name}</small> : null}
          </label>

          {message ? <div className={`form-status ${status}`}>{message}</div> : null}

          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={status === "loading"}>
              {status === "loading" ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
