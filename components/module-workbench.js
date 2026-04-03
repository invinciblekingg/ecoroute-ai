"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { locationOptions, severityOptions, wasteCategories } from "../lib/ecoroute-domain";
import { readApiJson } from "../lib/client-api";
import { createCardHover, gsap, prefersReducedMotion, setVisibleState } from "../lib/motion";

const LIVE_SYNC_INTERVAL_MS = 10000;

const defaultReportForm = {
  reporterName: "",
  contact: "",
  locationId: locationOptions[0]?.id ?? "",
  category: "plastic",
  severity: "3",
  description: "",
};

const defaultRewardForm = {
  label: "Ward 12",
  points: "10",
  badge: "Community Hero",
};

const defaultWorkerForm = {
  workerId: "",
  status: "on-route",
  currentTask: "Patrolling zone",
};

const workerStatusOptions = ["available", "assigned", "on-route", "in-progress", "off-duty"];

const defaultRouteForm = {
  selected: [],
};

function formatShortDate(value) {
  if (!value) return "now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "now";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DataCard({ label, value, note }) {
  return (
    <article className="mini-panel mini-panel-new module-data-card" data-module-card>
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {note ? <p>{note}</p> : null}
    </article>
  );
}

function formatApiError(error, fallbackMessage) {
  const fieldErrors = error?.data?.errors;

  if (fieldErrors && typeof fieldErrors === "object") {
    const firstMessage = Object.values(fieldErrors)
      .flat()
      .find(Boolean);

    if (firstMessage) {
      return firstMessage;
    }
  }

  const storageError = error?.data?.storage?.lastError;
  if (storageError) {
    return `${error?.message || fallbackMessage} ${storageError}`;
  }

  return error?.message || fallbackMessage;
}

async function loadSharedModuleData() {
  const endpoints = {
    admin: "/api/admin/overview?reportsLimit=12&notificationsLimit=12&activityLimit=12",
    dashboard: "/api/dashboard",
    region: "/api/regions/delhi",
    reports: "/api/reports?limit=12",
    workers: "/api/workers",
    rewards: "/api/rewards",
    route: "/api/routes/optimize",
    notifications: "/api/notifications",
  };

  const entries = Object.entries(endpoints);
  const settled = await Promise.allSettled(entries.map(([, url]) => readApiJson(url)));

  const nextState = {
    adminOverview: null,
    dashboard: null,
    region: null,
    reports: [],
    workers: [],
    leaderboard: [],
    routePlan: null,
    notifications: [],
  };
  const errors = [];

  settled.forEach((result, index) => {
    const [key] = entries[index];

    if (result.status === "rejected") {
      errors.push(`${key}: ${result.reason?.message || "unavailable"}`);
      return;
    }

    const data = result.value;
    if (key === "admin") nextState.adminOverview = data;
    if (key === "dashboard") nextState.dashboard = data.dashboard ?? data.summary ?? null;
    if (key === "region") nextState.region = data.region ?? null;
    if (key === "reports") nextState.reports = data.reports ?? [];
    if (key === "workers") nextState.workers = data.workers ?? [];
    if (key === "rewards") nextState.leaderboard = data.leaderboard ?? [];
    if (key === "route") nextState.routePlan = data.plan ?? null;
    if (key === "notifications") nextState.notifications = data.notifications ?? [];
  });

  return { nextState, errors };
}

export default function ModuleWorkbench({ product }) {
  const rootRef = useRef(null);
  const [reportForm, setReportForm] = useState(defaultReportForm);
  const [rewardForm, setRewardForm] = useState(defaultRewardForm);
  const [workerForm, setWorkerForm] = useState(defaultWorkerForm);
  const [routeForm, setRouteForm] = useState(defaultRouteForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [region, setRegion] = useState(null);
  const [zoneOptions, setZoneOptions] = useState(locationOptions);
  const [adminOverview, setAdminOverview] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [routePlan, setRoutePlan] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const openReports = useMemo(
    () => reports.filter((report) => !["resolved", "completed", "duplicate"].includes(report.status)),
    [reports]
  );

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let hoverCleanup = () => {};
    const grid = root.querySelector("[data-module-grid]");
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        setVisibleState(root.querySelectorAll("[data-module-panel], [data-module-card]"));
        return;
      }

      gsap.fromTo(
        "[data-module-heading]",
        {
          opacity: 0,
          y: 24,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 84%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-module-panel]",
        {
          opacity: 0,
          y: 26,
          scale: 0.985,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.82,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 82%",
            once: true,
          },
        }
      );

      hoverCleanup = createCardHover(Array.from(root.querySelectorAll("[data-module-card]")), {
        x: 5,
        y: 6,
        rotateX: 3,
        rotateY: 3,
        scale: 1.012,
      });
    }, root);

    return () => {
      hoverCleanup();
      ctx.revert();
    };
  }, [product.id]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || prefersReducedMotion()) {
      return;
    }

    gsap.fromTo(
      root.querySelectorAll("[data-output-card]"),
      {
        opacity: 0,
        y: 16,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.48,
        stagger: 0.05,
        ease: "power2.out",
        overwrite: true,
      }
    );
  }, [
    reports.length,
    workers.length,
    leaderboard.length,
    notifications.length,
    openReports.length,
    adminOverview?.activity?.length,
    routePlan?.routeCount,
  ]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || prefersReducedMotion()) {
      return;
    }

    gsap.fromTo(
      root.querySelectorAll("[data-module-metric]"),
      {
        opacity: 0.6,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.44,
        stagger: 0.06,
        ease: "power2.out",
        overwrite: true,
      }
    );
  }, [reports.length, workers.length, notifications.length]);

  useEffect(() => {
    const root = rootRef.current;
    const statusNode = root?.querySelector("[data-module-status]");

    if (!statusNode || !message || prefersReducedMotion()) {
      return;
    }

    gsap.fromTo(
      statusNode,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out",
      }
    );
  }, [message]);

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setMessage("");
    setRouteForm(defaultRouteForm);
    setWorkerForm(defaultWorkerForm);

    async function syncModuleData({ silent = false } = {}) {
      if (!silent) {
        setStatus("loading");
      }

      try {
        const { nextState, errors } = await loadSharedModuleData();

        if (cancelled) {
          return;
        }

        setRegion(nextState.region);
        setZoneOptions(nextState.region?.reportingZones ?? locationOptions);
        setDashboard(nextState.dashboard);
        setAdminOverview(nextState.adminOverview);
        setReports(nextState.reports);
        setWorkers(nextState.workers);
        setLeaderboard(nextState.leaderboard);
        setRoutePlan(nextState.routePlan);
        setNotifications(nextState.notifications);

        const firstWorker = (nextState.workers ?? [])[0];
        if (firstWorker) {
          setWorkerForm((current) => ({
            ...current,
            workerId: current.workerId || firstWorker.id,
          }));
        }

        if (product.id === "smart-reporting") {
          setReportForm((current) => ({
            ...current,
            locationId: current.locationId || nextState.region?.defaults?.locationId || locationOptions[0]?.id || "",
          }));
        }

        if (errors.length) {
          setMessage(`Some live services are unavailable: ${errors.join(", ")}`);
        } else if (silent) {
          setMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message || "Failed to load live module data.");
        }
      } finally {
        if (!cancelled) {
          setStatus("idle");
        }
      }
    }

    syncModuleData();

    const intervalId = setInterval(() => {
      syncModuleData({ silent: true });
    }, LIVE_SYNC_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [product.id]);

  async function refreshDashboard() {
    setStatus("loading");
    setMessage("");

    try {
      const { nextState, errors } = await loadSharedModuleData();

      setRegion(nextState.region);
      setZoneOptions(nextState.region?.reportingZones ?? locationOptions);
      setDashboard(nextState.dashboard);
      setAdminOverview(nextState.adminOverview);
      setReports(nextState.reports);
      setWorkers(nextState.workers);
      setLeaderboard(nextState.leaderboard);
      setRoutePlan(nextState.routePlan);
      setNotifications(nextState.notifications);
      setMessage(errors.length ? `Partial refresh complete: ${errors.join(", ")}` : "Live backend refreshed successfully.");
    } catch (error) {
      setMessage(error.message || "Could not refresh live data.");
    } finally {
      setStatus("idle");
    }
  }

  async function submitReport(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const data = await readApiJson("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reportForm,
          severity: reportForm.severity,
          source: "module-page",
        }),
      });

      setReports((current) => [data.report, ...current]);
      setDashboard(data.summary ?? dashboard);
      setNotifications(data.summary?.notifications ?? notifications);
      setAdminOverview((current) =>
        current
          ? {
              ...current,
              dashboard: data.summary ?? current.dashboard,
              reports: [data.report, ...(current.reports ?? [])].slice(0, 12),
              activity: [
                {
                  id: `${data.report.id}:${data.report.createdAt}:created`,
                  source: "report",
                  type: "created",
                  title: data.report.title,
                  detail: "Report submitted through the EcoRoute intake flow.",
                  relatedId: data.report.id,
                  status: data.report.status,
                  category: data.report.category,
                  ward: data.report.ward,
                  createdAt: data.report.createdAt,
                },
                ...(current.activity ?? []),
              ].slice(0, 12),
              notifications: data.summary?.notifications ?? current.notifications ?? [],
              unreadNotifications: (data.summary?.notifications ?? current.notifications ?? []).filter((item) => !item.read)
                .length,
            }
          : current
      );
      setMessage(`Report created successfully: ${data.report.title}`);
      setReportForm({
        ...defaultReportForm,
        locationId: reportForm.locationId || defaultReportForm.locationId,
      });
    } catch (error) {
      setMessage(formatApiError(error, "Could not submit the report."));
    } finally {
      setStatus("idle");
    }
  }

  async function optimizeRoute(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const selectedIds = routeForm.selected.length ? routeForm.selected : openReports.slice(0, 4).map((item) => item.id);
      const data = await readApiJson("/api/routes/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportIds: selectedIds, name: `${product.name} route` }),
      });

      setRoutePlan(data.plan);
      setDashboard(data.summary ?? dashboard);
      setMessage(`Route optimized with ${data.plan.routeCount} stops.`);
    } catch (error) {
      setMessage(error.message || "Could not optimize the route.");
    } finally {
      setStatus("idle");
    }
  }

  async function updateWorker(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      if (!workerForm.workerId) {
        throw new Error("Select a worker first.");
      }

      const data = await readApiJson(`/api/workers/${workerForm.workerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: workerForm.status,
          currentTask: workerForm.currentTask,
        }),
      });

      setWorkers((current) => current.map((worker) => (worker.id === data.worker.id ? data.worker : worker)));
      setMessage(`Worker updated: ${data.worker.name}`);
    } catch (error) {
      setMessage(error.message || "Could not update the worker.");
    } finally {
      setStatus("idle");
    }
  }

  async function awardPoints(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const data = await readApiJson("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: rewardForm.label,
          points: Number(rewardForm.points),
          badge: rewardForm.badge,
        }),
      });

      setLeaderboard((current) => {
        const index = current.findIndex((entry) => entry.id === data.entry.id);
        if (index === -1) {
          return [data.entry, ...current];
        }
        const next = [...current];
        next[index] = data.entry;
        return next;
      });
      setMessage(`Reward updated for ${data.entry.label}.`);
    } catch (error) {
      setMessage(error.message || "Could not award points.");
    } finally {
      setStatus("idle");
    }
  }

  async function markNotificationRead() {
    setStatus("loading");
    setMessage("");
    try {
      await readApiJson("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setMessage("Notifications marked as read.");
    } catch (error) {
      setMessage(error.message || "Could not update notifications.");
    } finally {
      setStatus("idle");
    }
  }

  const output = useMemo(() => {
    if (product.id === "smart-reporting") {
      return {
        title: "Live report queue",
        body: reports.slice(0, 4),
      };
    }

    if (product.id === "ai-triage") {
      return {
        title: "Priority queue",
        body: openReports.slice(0, 6),
      };
    }

    if (product.id === "route-optimizer") {
      return {
        title: "Route plan",
        body: routePlan,
      };
    }

    if (product.id === "municipality-dashboard") {
      return {
        title: "Live admin feed",
        body: adminOverview?.activity?.length ? adminOverview.activity : adminOverview?.reports ?? [],
      };
    }

    if (product.id === "worker-panel") {
      return {
        title: "Worker roster",
        body: workers,
      };
    }

    return {
      title: "Reward table",
      body: leaderboard,
    };
  }, [product.id, reports, openReports, routePlan, dashboard, workers, leaderboard, adminOverview]);

  return (
    <section className="section-block module-lab" id="live-backend" ref={rootRef}>
      <div className="section-heading" data-reveal data-module-heading>
        <span className="eyebrow">Live backend</span>
        <h2>Everything here talks to the real Next.js API and Delhi region grid</h2>
        <p>
          Each core module can now submit, optimize, update, or refresh against the backend so the product feels
          finished instead of mocked. Live zone data is served from the Delhi region API.
        </p>
      </div>

      {region ? (
        <div className="module-output-summary" data-module-card data-reveal>
          <strong>{region.displayName}</strong>
          <p>
            {region.coverage?.length ?? 0} live Delhi zones · {region.controlRoom} · {region.responseTargetMinutes} min target
          </p>
        </div>
      ) : null}

      <div className="module-lab-grid" data-reveal data-module-grid>
        <div className="module-lab-panel" data-hover-card data-module-panel>
          {product.id === "smart-reporting" ? (
            <form className="demo-form" onSubmit={submitReport}>
              <label>
                <span>Reporter name</span>
                <input
                  value={reportForm.reporterName}
                  onChange={(event) => setReportForm((current) => ({ ...current, reporterName: event.target.value }))}
                  placeholder="Aisha Khan"
                />
              </label>
              <label>
                <span>Contact</span>
                <input
                  value={reportForm.contact}
                  onChange={(event) => setReportForm((current) => ({ ...current, contact: event.target.value }))}
                  placeholder="aisha@example.com"
                />
              </label>
              <label>
                <span>Location</span>
                <select
                  value={reportForm.locationId}
                  onChange={(event) => setReportForm((current) => ({ ...current, locationId: event.target.value }))}
                >
                  {zoneOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label} - {option.ward}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Category</span>
                <select
                  value={reportForm.category}
                  onChange={(event) => setReportForm((current) => ({ ...current, category: event.target.value }))}
                >
                  {wasteCategories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Severity</span>
                <select
                  value={reportForm.severity}
                  onChange={(event) => setReportForm((current) => ({ ...current, severity: event.target.value }))}
                >
                  {severityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-width">
                <span>Description</span>
                <textarea
                  rows="4"
                  value={reportForm.description}
                  onChange={(event) => setReportForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Describe the waste issue in at least 8 characters"
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="primary-button" disabled={status === "loading"}>
                  Submit report
                </button>
                <button type="button" className="secondary-button" onClick={refreshDashboard}>
                  Refresh live data
                </button>
              </div>
            </form>
          ) : null}

          {product.id === "ai-triage" ? (
            <div className="module-action-stack">
              <div className="module-inline-list">
                {openReports.slice(0, 4).map((report) => (
                  <article className="module-inline-card" key={report.id} data-module-card>
                    <strong>{report.title}</strong>
                    <p>
                      {report.category} · severity {report.severity} · {report.status}
                    </p>
                  </article>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="primary-button" onClick={refreshDashboard} disabled={status === "loading"}>
                  Refresh queue
                </button>
                <button type="button" className="secondary-button" onClick={optimizeRoute} disabled={status === "loading"}>
                  Recompute priority route
                </button>
              </div>
            </div>
          ) : null}

          {product.id === "route-optimizer" ? (
            <form className="module-action-stack" onSubmit={optimizeRoute}>
              <div className="module-inline-list">
                {openReports.slice(0, 6).map((report) => {
                  const checked = routeForm.selected.includes(report.id);
                  return (
                    <label className="module-select-card" key={report.id} data-module-card>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          setRouteForm((current) => ({
                            ...current,
                            selected: event.target.checked
                              ? [...current.selected, report.id]
                              : current.selected.filter((id) => id !== report.id),
                          }));
                        }}
                      />
                      <span>
                        <strong>{report.title}</strong>
                        <small>
                          {report.ward} · {report.status}
                        </small>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-button" disabled={status === "loading"}>
                  Optimize selected route
                </button>
                <button type="button" className="secondary-button" onClick={refreshDashboard}>
                  Reload reports
                </button>
              </div>
            </form>
          ) : null}

          {product.id === "municipality-dashboard" ? (
            <div className="module-action-stack">
              <div className="module-action-row">
                <button type="button" className="primary-button" onClick={refreshDashboard} disabled={status === "loading"}>
                  Refresh dashboard
                </button>
                <button type="button" className="secondary-button" onClick={markNotificationRead} disabled={status === "loading"}>
                  Mark notifications read
                </button>
              </div>
              <div className="module-inline-list">
                <DataCard label="Open queue" value={dashboard?.totals?.openReports ?? 0} note="Live unresolved reports" />
                <DataCard label="Average response" value={`${dashboard?.operations?.averageResponseMinutes ?? 0} min`} note="Response benchmark" />
                <DataCard label="Today done" value={dashboard?.operations?.todayCompleted ?? 0} note="Resolved today" />
              </div>
            </div>
          ) : null}

          {product.id === "worker-panel" ? (
            <form className="module-action-stack" onSubmit={updateWorker}>
              <label>
                <span>Select worker</span>
                <select
                  value={workerForm.workerId}
                  onChange={(event) => setWorkerForm((current) => ({ ...current, workerId: event.target.value }))}
                >
                  <option value="">Choose a worker</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.zone}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Status</span>
                <select
                  value={workerForm.status}
                  onChange={(event) => setWorkerForm((current) => ({ ...current, status: event.target.value }))}
                >
                  {workerStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full-width">
                <span>Current task</span>
                <input
                  value={workerForm.currentTask}
                  onChange={(event) => setWorkerForm((current) => ({ ...current, currentTask: event.target.value }))}
                  placeholder="Collecting waste"
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="primary-button" disabled={status === "loading"}>
                  Update worker
                </button>
                <button type="button" className="secondary-button" onClick={refreshDashboard}>
                  Refresh roster
                </button>
              </div>
            </form>
          ) : null}

          {product.id === "rewards-analytics" ? (
            <form className="module-action-stack" onSubmit={awardPoints}>
              <label>
                <span>Ward / team</span>
                <input
                  value={rewardForm.label}
                  onChange={(event) => setRewardForm((current) => ({ ...current, label: event.target.value }))}
                  placeholder="Ward 12"
                />
              </label>
              <label>
                <span>Points</span>
                <input
                  type="number"
                  min="1"
                  value={rewardForm.points}
                  onChange={(event) => setRewardForm((current) => ({ ...current, points: event.target.value }))}
                />
              </label>
              <label className="full-width">
                <span>Badge</span>
                <input
                  value={rewardForm.badge}
                  onChange={(event) => setRewardForm((current) => ({ ...current, badge: event.target.value }))}
                  placeholder="Community Hero"
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="primary-button" disabled={status === "loading"}>
                  Award points
                </button>
                <button type="button" className="secondary-button" onClick={refreshDashboard}>
                  Refresh leaderboard
                </button>
              </div>
            </form>
          ) : null}
        </div>

          <aside className="module-lab-aside" data-hover-card data-module-panel>
            <div className="module-output-shell">
              <span className="eyebrow">{output.title}</span>
            {product.id === "route-optimizer" && routePlan ? (
              <div className="module-output-summary">
                <strong>{routePlan.routeCount} stops</strong>
                <p>
                  {routePlan.totals.distanceKm} km · {routePlan.totals.estimatedMinutes} min · {routePlan.totals.efficiencyScore}% efficiency
                </p>
              </div>
            ) : null}

            {product.id === "municipality-dashboard" && dashboard ? (
              <div className="module-output-summary">
                <strong>{dashboard.city}</strong>
                <p>
                  {dashboard.totals.openReports} open reports · {dashboard.totals.workers} workers · {dashboard.operations.routeEfficiency}% route efficiency
                </p>
              </div>
            ) : null}

            <div className="module-output-list">
              {Array.isArray(output.body)
                ? output.body.map((item) => (
                    <article className="module-output-card" key={item.id ?? item.title ?? item.label} data-output-card data-module-card>
                      <strong>{item.title ?? item.label ?? item.name}</strong>
                      <p>
                        {[item.status, item.category, item.zone ?? item.ward ?? item.role ?? item.currentTask ?? item.points]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {item.createdAt ? <span>{formatShortDate(item.createdAt)}</span> : null}
                    </article>
                  ))
                : null}

              {output.body && !Array.isArray(output.body) ? (
                <pre className="json-output">{JSON.stringify(output.body, null, 2)}</pre>
              ) : null}
            </div>

            <div className="module-data-grid">
              <div data-module-metric>
                <DataCard label="Reports" value={reports.length} note="Live records" />
              </div>
              <div data-module-metric>
                <DataCard label="Workers" value={workers.length} note="Active crews" />
              </div>
              <div data-module-metric>
                <DataCard label="Notifications" value={notifications.length} note="System updates" />
              </div>
            </div>
          </div>

          {message ? <div className={`form-status ${status === "loading" ? "" : "success"}`} data-module-status>{message}</div> : null}
        </aside>
      </div>
    </section>
  );
}
