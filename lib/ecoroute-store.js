import { randomUUID, scryptSync, timingSafeEqual } from "crypto";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { getConfiguredStorageDriver, getMongoDb, getStorageStatus } from "./mongodb";
import { moduleLibrary } from "./site-data";
import {
  buildDashboardSnapshot,
  buildRoutePlan,
  computeSeverityScore,
  detectWasteType,
  enrichReportDraft,
  getZoneById,
  locationOptions,
  normalizeCategory,
  normalizeString,
  parseSeverity,
  resolveLocation,
} from "./ecoroute-domain";

const dataDir = path.join(process.cwd(), "data");
const statePath = path.join(dataDir, "ecoroute-state.json");

function nowISO() {
  return new Date().toISOString();
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function seedReports() {
  const rawReports = [
    {
      reporterName: "Aarav",
      contact: "aarav@example.com",
      category: "hazardous",
      severity: 5,
      description: "Chemical spill near the fruit stalls needs urgent pickup.",
      location: "central-market",
      source: "seed",
      status: "urgent",
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(4),
      resolvedAt: null,
      assignedWorkerId: "worker-1",
    },
    {
      reporterName: "Nisha",
      contact: "nisha@example.com",
      category: "plastic",
      severity: 3,
      description: "Plastic waste piled near the entrance gate.",
      location: "riverside-ward",
      source: "seed",
      status: "assigned",
      createdAt: hoursAgo(12),
      updatedAt: hoursAgo(9),
      resolvedAt: null,
      assignedWorkerId: "worker-2",
    },
    {
      reporterName: "Imran",
      contact: "imran@example.com",
      category: "organic",
      severity: 2,
      description: "Organic waste collecting near the park bench line.",
      location: "lake-colony",
      source: "seed",
      status: "resolved",
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(21),
      resolvedAt: hoursAgo(21),
      assignedWorkerId: "worker-3",
      cleanupProofUrl: "/uploads/seed-cleanup.jpg",
    },
    {
      reporterName: "Meera",
      contact: "meera@example.com",
      category: "e-waste",
      severity: 4,
      description: "Old batteries and broken chargers dumped behind shops.",
      location: "old-town-lane",
      source: "seed",
      status: "triaged",
      createdAt: hoursAgo(8),
      updatedAt: hoursAgo(7),
      resolvedAt: null,
      assignedWorkerId: null,
    },
    {
      reporterName: "Kabir",
      contact: "kabir@example.com",
      category: "plastic",
      severity: 2,
      description: "Small plastic pile on the roadside, could be grouped with nearby jobs.",
      location: "industrial-belt",
      source: "seed",
      status: "pending",
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(3),
      resolvedAt: null,
      assignedWorkerId: null,
    },
    {
      reporterName: "Sara",
      contact: "sara@example.com",
      category: "hazardous",
      severity: 5,
      description: "Broken glass and paint spill reported at the depot road.",
      location: "north-depot",
      source: "seed",
      status: "in-progress",
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1),
      resolvedAt: null,
      assignedWorkerId: "worker-4",
    },
  ];

  return rawReports.map((report, index) => {
    const enriched = enrichReportDraft(report, []);
    const location = resolveLocation(report.location);
    const ai = detectWasteType(report.category, report.description);
    const status = report.status;
    return {
      id: `report-${index + 1}`,
      title: enriched.title,
      reporterName: report.reporterName,
      contact: report.contact,
      category: normalizeCategory(report.category),
      severity: parseSeverity(report.severity),
      description: report.description,
      source: report.source,
      status,
      location,
      assignedWorkerId: report.assignedWorkerId,
      cleanupProofUrl: report.cleanupProofUrl ?? null,
      imageUrl: report.imageUrl ?? null,
      ai,
      duplicateOf: null,
      duplicateScore: 0,
      priorityScore: enriched.priorityScore,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      resolvedAt: report.resolvedAt,
      ward: location.ward,
    };
  });
}

function seedPilots() {
  return [
    {
      id: "pilot-1",
      name: "Priya Kapoor",
      email: "priya@city.gov",
      company: "City Operations Office",
      goal: "Run a pilot for smart report intake and route optimization.",
      status: "reviewed",
      createdAt: hoursAgo(36),
    },
  ];
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

function createSeedUser({ id, name, email, role, password }) {
  const salt = `${id}-salt`;
  return {
    id,
    name,
    email: email.toLowerCase(),
    role,
    status: "active",
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    createdAt: hoursAgo(120),
    updatedAt: hoursAgo(24),
  };
}

function seedUsers() {
  return [
    createSeedUser({
      id: "user-admin",
      name: "EcoRoute Admin",
      email: "admin@ecoroute.ai",
      role: "admin",
      password: "Admin@12345",
    }),
    createSeedUser({
      id: "user-ops",
      name: "Ops Lead",
      email: "ops@ecoroute.ai",
      role: "operator",
      password: "Ops@12345",
    }),
  ];
}

function seedWorkers() {
  return [
    {
      id: "worker-1",
      name: "Aman Singh",
      vehicle: "Truck 4",
      status: "on-route",
      zone: "Central Market",
      currentTask: "Hazardous spill",
      currentReportId: "report-1",
      routePlanId: "route-1",
      completedToday: 4,
      shiftStart: "06:00",
      shiftEnd: "14:00",
    },
    {
      id: "worker-2",
      name: "Rita Mehra",
      vehicle: "Truck 6",
      status: "assigned",
      zone: "Riverside Ward",
      currentTask: "Plastic cluster",
      currentReportId: "report-2",
      routePlanId: "route-1",
      completedToday: 3,
      shiftStart: "06:30",
      shiftEnd: "14:30",
    },
    {
      id: "worker-3",
      name: "Dev Sharma",
      vehicle: "Truck 2",
      status: "available",
      zone: "Lake Colony",
      currentTask: "Resolved",
      currentReportId: "report-3",
      routePlanId: null,
      completedToday: 5,
      shiftStart: "07:00",
      shiftEnd: "15:00",
    },
    {
      id: "worker-4",
      name: "Farah Khan",
      vehicle: "Truck 9",
      status: "on-route",
      zone: "North Depot",
      currentTask: "Glass and paint spill",
      currentReportId: "report-6",
      routePlanId: "route-2",
      completedToday: 2,
      shiftStart: "08:00",
      shiftEnd: "16:00",
    },
  ];
}

function seedNotifications() {
  return [
    {
      id: "note-1",
      type: "report",
      title: "Chemical spill flagged",
      body: "Central Market report was marked urgent and sent to the queue.",
      relatedId: "report-1",
      createdAt: hoursAgo(5),
      read: false,
    },
    {
      id: "note-2",
      type: "route",
      title: "Route recomputed",
      body: "Dispatch reduced backtracking by grouping the nearby jobs.",
      relatedId: "route-1",
      createdAt: hoursAgo(4),
      read: false,
    },
    {
      id: "note-3",
      type: "cleanup",
      title: "Cleanup completed",
      body: "Lake Colony cleanup was marked complete and points were awarded.",
      relatedId: "report-3",
      createdAt: hoursAgo(21),
      read: true,
    },
  ];
}

function seedLeaderboard() {
  return [
    { id: "ward-12", label: "Ward 12", points: 540, badges: ["Eco Warrior"], completedReports: 18 },
    { id: "ward-08", label: "Ward 08", points: 472, badges: ["Clean City Hero"], completedReports: 15 },
    { id: "ward-09", label: "Ward 09", points: 398, badges: ["Top Reporter"], completedReports: 12 },
    { id: "ward-15", label: "Ward 15", points: 355, badges: [], completedReports: 10 },
    { id: "ward-04", label: "Ward 04", points: 320, badges: [], completedReports: 9 },
  ];
}

function seedRoutePlans() {
  const reports = seedReports();
  const plan = buildRoutePlan(reports, {
    startLocation: getZoneById("north-depot"),
    avgSpeedKmh: 18,
    fuelLitersPerKm: 0.18,
    stopTimeMinutes: 8,
  });

  return [
    {
      id: "route-1",
      name: "Morning cluster",
      createdAt: hoursAgo(5),
      status: "active",
      ...plan,
    },
  ];
}

function createSeedState() {
  return {
    schemaVersion: 1,
    settings: {
      cityName: "EcoRoute City",
      responseTargetMinutes: 12,
      avgSpeedKmh: 18,
      fuelLitersPerKm: 0.18,
      rewardPointsPerReport: 10,
      rewardPointsPerCompletion: 25,
    },
    modules: moduleLibrary,
    locationOptions,
    reports: seedReports(),
    pilots: seedPilots(),
    workers: seedWorkers(),
    notifications: seedNotifications(),
    leaderboard: seedLeaderboard(),
    routePlans: seedRoutePlans(),
    users: seedUsers(),
    sessions: [],
  };
}

function normalizeState(input, version = 0) {
  const seed = createSeedState();
  const parsed = input && typeof input === "object" ? input : {};

  return {
    ...seed,
    ...parsed,
    modules: parsed.modules ?? moduleLibrary,
    locationOptions: parsed.locationOptions ?? locationOptions,
    reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    pilots: Array.isArray(parsed.pilots) ? parsed.pilots : [],
    workers: Array.isArray(parsed.workers) ? parsed.workers : [],
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    leaderboard: Array.isArray(parsed.leaderboard) ? parsed.leaderboard : [],
    routePlans: Array.isArray(parsed.routePlans) ? parsed.routePlans : [],
    users: Array.isArray(parsed.users) ? parsed.users : seedUsers(),
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    __meta: {
      version: Number.isFinite(Number(parsed.version)) ? Number(parsed.version) : version,
    },
  };
}

function serializeState(state, nextVersion) {
  const { __meta, ...rest } = state;
  return {
    ...rest,
    version: nextVersion,
    updatedAt: nowISO(),
  };
}

class StateConflictError extends Error {
  constructor() {
    super("State changed during update. Retrying.");
    this.name = "StateConflictError";
  }
}

let writeQueue = Promise.resolve();

async function readFileState() {
  try {
    const content = await readFile(statePath, "utf8");
    const parsed = JSON.parse(content);

    if (!parsed || typeof parsed !== "object") {
      return normalizeState(createSeedState(), 0);
    }

    return normalizeState(parsed, Number(parsed.version) || 0);
  } catch {
    return normalizeState(createSeedState(), 0);
  }
}

async function persistFileState(state) {
  await mkdir(dataDir, { recursive: true });
  const payload = serializeState(state, Number(state.__meta?.version || 0));
  await writeFile(statePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function readMongoState() {
  const db = await getMongoDb();
  const collection = db.collection("app_state");
  const existing = await collection.findOne({ _id: "primary" });

  if (!existing) {
    const seed = normalizeState(createSeedState(), 1);
    await collection.insertOne({
      _id: "primary",
      ...serializeState(seed, 1),
      createdAt: nowISO(),
    });
    return seed;
  }

  return normalizeState(existing, Number(existing.version) || 1);
}

async function persistMongoState(state) {
  const db = await getMongoDb();
  const collection = db.collection("app_state");
  const expectedVersion = Number(state.__meta?.version || 0);
  const nextVersion = expectedVersion + 1;
  const result = await collection.replaceOne(
    { _id: "primary", version: expectedVersion },
    {
      _id: "primary",
      ...serializeState(state, nextVersion),
      createdAt: state.createdAt ?? nowISO(),
    },
    { upsert: expectedVersion === 0 }
  );

  if (!result.matchedCount && !result.upsertedCount) {
    throw new StateConflictError();
  }

  state.__meta = { version: nextVersion };
}

async function readRawState() {
  if (getConfiguredStorageDriver() === "mongodb") {
    try {
      return await readMongoState();
    } catch {
      return readFileState();
    }
  }

  return readFileState();
}

async function persistState(state) {
  if (getConfiguredStorageDriver() === "mongodb") {
    try {
      return await persistMongoState(state);
    } catch (error) {
      if (error instanceof StateConflictError) {
        throw error;
      }

      return persistFileState(state);
    }
  }

  return persistFileState(state);
}

export async function getState() {
  return readRawState();
}

async function runMutation(mutator, maxAttempts = 4) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const state = await readRawState();
    const result = await mutator(state);

    try {
      await persistState(state);
      return result;
    } catch (error) {
      if (error instanceof StateConflictError && attempt < maxAttempts) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not persist the latest state.");
}

export async function mutateState(mutator) {
  const job = writeQueue.then(() => runMutation(mutator));

  writeQueue = job.then(
    () => undefined,
    () => undefined
  );

  return job;
}

function addNotification(state, notification) {
  state.notifications.unshift({
    id: `note-${randomUUID()}`,
    read: false,
    createdAt: nowISO(),
    ...notification,
  });
}

function updateLeaderboard(state, location, points, badge) {
  const label = location.ward || location.label || "Ward 00";
  const entryId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  let entry = state.leaderboard.find((item) => item.id === entryId || item.label === label);

  if (!entry) {
    entry = {
      id: entryId,
      label,
      points: 0,
      badges: [],
      completedReports: 0,
    };
    state.leaderboard.push(entry);
  }

  entry.points = (entry.points ?? 0) + points;
  if (badge && !entry.badges.includes(badge)) {
    entry.badges = [...entry.badges, badge];
  }

  if (points > 0) {
    entry.completedReports = (entry.completedReports ?? 0) + 1;
  }

  return entry;
}

function summarizeWorkers(state) {
  return state.workers.map((worker) => {
    const activeReport = state.reports.find((report) => report.id === worker.currentReportId) ?? null;
    return {
      ...worker,
      activeReport,
    };
  });
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status ?? "active",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function pruneExpiredSessions(state) {
  const now = Date.now();
  state.sessions = state.sessions.filter((session) => {
    const expiry = Date.parse(session.expiresAt);
    return Number.isFinite(expiry) && expiry > now;
  });
}

export async function listPilots() {
  const state = await getState();
  return [...state.pilots].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function authenticateUser(email, password) {
  const state = await getState();
  const normalizedEmail = normalizeString(email);
  const user = state.users.find((item) => normalizeString(item.email) === normalizedEmail);

  if (!user || user.status === "disabled") {
    return null;
  }

  const expectedHash = Buffer.from(user.passwordHash, "hex");
  const candidateHash = Buffer.from(hashPassword(password, user.passwordSalt), "hex");
  if (expectedHash.length !== candidateHash.length || !timingSafeEqual(expectedHash, candidateHash)) {
    return null;
  }

  return sanitizeUser(user);
}

export async function createUserSession(userId, metadata = {}) {
  return mutateState(async (state) => {
    pruneExpiredSessions(state);

    const user = state.users.find((item) => item.id === userId);
    if (!user) {
      return null;
    }

    const issuedAt = nowISO();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    const session = {
      id: `session-${randomUUID()}`,
      userId: user.id,
      createdAt: issuedAt,
      updatedAt: issuedAt,
      expiresAt,
      userAgent: metadata.userAgent ?? "",
      ipAddress: metadata.ipAddress ?? "",
    };

    state.sessions.unshift(session);
    user.updatedAt = issuedAt;
    return {
      session,
      user: sanitizeUser(user),
    };
  });
}

export async function getSessionById(sessionId) {
  if (!sessionId) {
    return null;
  }

  const state = await getState();
  pruneExpiredSessions(state);

  const session = state.sessions.find((item) => item.id === sessionId);
  if (!session) {
    return null;
  }

  const user = state.users.find((item) => item.id === session.userId);
  if (!user) {
    return null;
  }

  return {
    session,
    user: sanitizeUser(user),
  };
}

export async function deleteSession(sessionId) {
  if (!sessionId) {
    return false;
  }

  return mutateState(async (state) => {
    const nextSessions = state.sessions.filter((item) => item.id !== sessionId);
    const removed = nextSessions.length !== state.sessions.length;
    state.sessions = nextSessions;
    return removed;
  });
}

export async function createPilotRequest(input) {
  return mutateState(async (state) => {
    const record = {
      id: `pilot-${randomUUID()}`,
      name: input.name,
      email: input.email,
      company: input.company,
      goal: input.goal,
      status: "new",
      source: input.source ?? "web",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      notes: input.notes ?? "",
    };

    state.pilots.unshift(record);
    addNotification(state, {
      type: "pilot",
      title: "New pilot request",
      body: `${record.company} requested a pilot for EcoRoute AI.`,
      relatedId: record.id,
    });

    return record;
  });
}

export async function listReports(filters = {}) {
  const state = await getState();
  let reports = [...state.reports].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : String(filters.status).split(",");
    const normalized = statuses.map((status) => normalizeString(status)).filter(Boolean);
    reports = reports.filter((report) => normalized.includes(normalizeString(report.status)));
  }

  if (filters.category) {
    const normalized = normalizeCategory(filters.category);
    reports = reports.filter((report) => normalizeCategory(report.category) === normalized);
  }

  if (filters.limit) {
    const limit = Number(filters.limit);
    if (Number.isFinite(limit) && limit > 0) {
      reports = reports.slice(0, limit);
    }
  }

  return reports;
}

export async function getReportById(reportId) {
  const state = await getState();
  return state.reports.find((report) => report.id === reportId) ?? null;
}

export async function createReport(input) {
  return mutateState(async (state) => {
    const draft = enrichReportDraft(input, state.reports);
    const record = {
      id: `report-${randomUUID()}`,
      reporterName: input.reporterName,
      contact: input.contact ?? "",
      category: draft.category,
      severity: draft.severity,
      description: input.description ?? "",
      source: input.source ?? "web",
      status: draft.status,
      title: draft.title,
      location: draft.location,
      locationLabel: draft.location.label,
      ward: draft.location.ward,
      imageUrl: input.imageUrl ?? null,
      videoUrl: input.videoUrl ?? null,
      proofUrl: input.proofUrl ?? null,
      ai: draft.ai,
      duplicateOf: draft.duplicateOf,
      duplicateScore: draft.duplicateScore,
      priorityScore: draft.priorityScore,
      assignedWorkerId: input.assignedWorkerId ?? null,
      cleanupProofUrl: null,
      notes: input.notes ?? "",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      resolvedAt: null,
      history: [
        {
          at: nowISO(),
          action: "created",
          detail: "Report submitted through the EcoRoute intake flow.",
        },
      ],
    };

    if (record.duplicateOf) {
      record.history.push({
        at: nowISO(),
        action: "duplicate",
        detail: `Potential duplicate of ${record.duplicateOf}`,
      });
    }

    state.reports.unshift(record);
    updateLeaderboard(state, record.location, record.status === "duplicate" ? 0 : 10, record.status === "urgent" ? "Eco Warrior" : null);
    addNotification(state, {
      type: "report",
      title: record.status === "urgent" ? "Urgent waste report" : "New waste report",
      body: `${record.title} has been added to the live queue.`,
      relatedId: record.id,
    });

    return record;
  });
}

export async function updateReport(reportId, actionInput = {}) {
  return mutateState(async (state) => {
    const report = state.reports.find((item) => item.id === reportId);
    if (!report) {
      return null;
    }

    const action = normalizeString(actionInput.action ?? "update");

    if (action === "assign") {
      report.assignedWorkerId = actionInput.workerId ?? report.assignedWorkerId ?? null;
      report.status = "assigned";
      report.updatedAt = nowISO();
      report.history.push({
        at: nowISO(),
        action: "assigned",
        detail: `Assigned to ${actionInput.workerId ?? "a worker"}.`,
      });
      addNotification(state, {
        type: "dispatch",
        title: "Report assigned",
        body: `${report.title} was assigned to a field crew.`,
        relatedId: report.id,
      });
      return report;
    }

    if (action === "start") {
      report.status = "in-progress";
      report.updatedAt = nowISO();
      report.history.push({
        at: nowISO(),
        action: "started",
        detail: "Cleanup started in the field.",
      });
      addNotification(state, {
        type: "field",
        title: "Cleanup started",
        body: `${report.title} is now in progress.`,
        relatedId: report.id,
      });
      return report;
    }

    if (action === "complete" || action === "resolve") {
      report.status = "resolved";
      report.cleanupProofUrl = actionInput.cleanupProofUrl ?? report.cleanupProofUrl ?? null;
      report.resolvedAt = nowISO();
      report.updatedAt = nowISO();
      report.history.push({
        at: nowISO(),
        action: "resolved",
        detail: actionInput.notes ?? "Cleanup completed and verified.",
      });
      addNotification(state, {
        type: "cleanup",
        title: "Cleanup completed",
        body: `${report.title} has been resolved.`,
        relatedId: report.id,
      });

      const points = state.settings.rewardPointsPerCompletion ?? 25;
      updateLeaderboard(state, report.location, points, "Clean City Hero");

      const worker = report.assignedWorkerId
        ? state.workers.find((item) => item.id === report.assignedWorkerId)
        : null;
      if (worker) {
        worker.completedToday = (worker.completedToday ?? 0) + 1;
        worker.status = "available";
        worker.currentTask = "Available";
        worker.currentReportId = null;
        worker.updatedAt = nowISO();
      }

      return report;
    }

    if (action === "reopen") {
      report.status = "pending";
      report.updatedAt = nowISO();
      report.history.push({
        at: nowISO(),
        action: "reopened",
        detail: "Report reopened for review.",
      });
      return report;
    }

    report.notes = actionInput.notes ?? report.notes ?? "";
    if (actionInput.status) {
      report.status = normalizeString(actionInput.status);
    }
    if (actionInput.workerId !== undefined) {
      report.assignedWorkerId = actionInput.workerId;
    }
    if (actionInput.cleanupProofUrl !== undefined) {
      report.cleanupProofUrl = actionInput.cleanupProofUrl;
    }
    report.updatedAt = nowISO();
    report.history.push({
      at: nowISO(),
      action: "updated",
      detail: actionInput.notes ?? "Report updated.",
    });
    return report;
  });
}

export async function listWorkers() {
  const state = await getState();
  return summarizeWorkers(state);
}

export async function getWorkerById(workerId) {
  const state = await getState();
  return summarizeWorkers(state).find((worker) => worker.id === workerId) ?? null;
}

export async function updateWorker(workerId, updates = {}) {
  return mutateState(async (state) => {
    const worker = state.workers.find((item) => item.id === workerId);
    if (!worker) {
      return null;
    }

    if (updates.status) {
      worker.status = normalizeString(updates.status);
    }
    if (updates.currentTask !== undefined) {
      worker.currentTask = updates.currentTask;
    }
    if (updates.currentReportId !== undefined) {
      worker.currentReportId = updates.currentReportId;
    }
    if (updates.routePlanId !== undefined) {
      worker.routePlanId = updates.routePlanId;
    }
    if (updates.zone !== undefined) {
      worker.zone = updates.zone;
    }
    if (updates.vehicle !== undefined) {
      worker.vehicle = updates.vehicle;
    }
    worker.updatedAt = nowISO();
    return worker;
  });
}

export async function listNotifications() {
  const state = await getState();
  return [...state.notifications].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function createNotification(input) {
  return mutateState(async (state) => {
    const notification = {
      id: `note-${randomUUID()}`,
      type: input.type ?? "info",
      title: input.title,
      body: input.body,
      relatedId: input.relatedId ?? null,
      createdAt: nowISO(),
      read: false,
    };
    state.notifications.unshift(notification);
    return notification;
  });
}

export async function listLeaderboard() {
  const state = await getState();
  return [...state.leaderboard].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
}

export async function optimizeRoute(input = {}) {
  return mutateState(async (state) => {
    const reportIds = Array.isArray(input.reportIds) ? input.reportIds : null;
    const selectedReports = reportIds && reportIds.length
      ? state.reports.filter((report) => reportIds.includes(report.id))
      : state.reports.filter((report) => !["resolved", "completed", "duplicate"].includes(report.status));

    const routePlan = buildRoutePlan(selectedReports, {
      startLocation: input.startLocation ?? getZoneById("north-depot"),
      avgSpeedKmh: input.avgSpeedKmh ?? state.settings.avgSpeedKmh,
      fuelLitersPerKm: input.fuelLitersPerKm ?? state.settings.fuelLitersPerKm,
      stopTimeMinutes: input.stopTimeMinutes ?? 8,
    });

    const record = {
      id: `route-${randomUUID()}`,
      name: input.name ?? "Auto-generated route",
      createdAt: nowISO(),
      status: "active",
      ...routePlan,
      reportIds: routePlan.stops.map((stop) => stop.reportId),
    };

    state.routePlans.unshift(record);

    addNotification(state, {
      type: "route",
      title: "Route optimized",
      body: `Generated a ${record.routeCount}-stop route with ${record.totals.efficiencyScore}% efficiency.`,
      relatedId: record.id,
    });

    return record;
  });
}

export async function getDashboardData() {
  const state = await getState();
  return buildDashboardSnapshot(state);
}

export async function getHealthData() {
  const dashboard = await getDashboardData();
  const storage = getStorageStatus();
  return {
    status: "ok",
    service: "EcoRoute AI backend",
    storage,
    timestamp: nowISO(),
    totals: dashboard.totals,
    operations: dashboard.operations,
  };
}
