export const DEFAULT_ZONE_ID = "connaught-place";
export const DEFAULT_DEPOT_ID = "okhla-mrf-depot";

export const cityProfile = {
  id: "delhi",
  name: "Delhi",
  displayName: "Delhi Waste Command Grid",
  jurisdiction: "National Capital Territory of Delhi",
  controlRoom: "Delhi Civic Control Room",
  center: {
    latitude: 28.6139,
    longitude: 77.209,
  },
  responseTargetMinutes: 18,
  defaultZoneId: DEFAULT_ZONE_ID,
  defaultDepotId: DEFAULT_DEPOT_ID,
  coverage: [
    "Connaught Place",
    "Chandni Chowk",
    "Lajpat Nagar",
    "Okhla Industrial Area",
    "Mayur Vihar",
    "Rohini",
    "Dwarka",
  ],
};

export const cityZones = [
  {
    id: "connaught-place",
    label: "Connaught Place",
    ward: "New Delhi Circle",
    district: "Central Delhi",
    latitude: 28.6315,
    longitude: 77.2167,
    type: "reporting",
  },
  {
    id: "chandni-chowk",
    label: "Chandni Chowk",
    ward: "Old Delhi",
    district: "Central Delhi",
    latitude: 28.6562,
    longitude: 77.2303,
    type: "reporting",
  },
  {
    id: "lajpat-nagar",
    label: "Lajpat Nagar",
    ward: "South Delhi",
    district: "South East Delhi",
    latitude: 28.5677,
    longitude: 77.2431,
    type: "reporting",
  },
  {
    id: "okhla-industrial-area",
    label: "Okhla Industrial Area",
    ward: "South East Delhi",
    district: "South East Delhi",
    latitude: 28.5269,
    longitude: 77.2734,
    type: "reporting",
  },
  {
    id: "mayur-vihar-phase-1",
    label: "Mayur Vihar Phase 1",
    ward: "East Delhi",
    district: "East Delhi",
    latitude: 28.6077,
    longitude: 77.296,
    type: "reporting",
  },
  {
    id: "rohini-sector-18",
    label: "Rohini Sector 18",
    ward: "North West Delhi",
    district: "North West Delhi",
    latitude: 28.7391,
    longitude: 77.1187,
    type: "reporting",
  },
  {
    id: "dwarka-sector-6",
    label: "Dwarka Sector 6",
    ward: "South West Delhi",
    district: "South West Delhi",
    latitude: 28.5924,
    longitude: 77.0461,
    type: "reporting",
  },
  {
    id: "okhla-mrf-depot",
    label: "Okhla MRF Depot",
    ward: "South East Delhi",
    district: "South East Delhi",
    latitude: 28.5285,
    longitude: 77.2745,
    type: "depot",
  },
];

export const locationOptions = cityZones.filter((zone) => zone.type !== "depot").map((zone) => ({
  id: zone.id,
  label: zone.label,
  ward: zone.ward,
  district: zone.district,
}));

export function getDelhiRegionData(live = {}) {
  return {
    id: cityProfile.id,
    name: cityProfile.name,
    displayName: cityProfile.displayName,
    jurisdiction: cityProfile.jurisdiction,
    controlRoom: cityProfile.controlRoom,
    center: cityProfile.center,
    responseTargetMinutes: cityProfile.responseTargetMinutes,
    defaults: {
      locationId: DEFAULT_ZONE_ID,
      depotId: DEFAULT_DEPOT_ID,
    },
    coverage: cityProfile.coverage,
    reportingZones: locationOptions,
    zones: cityZones,
    live,
  };
}

export const wasteCategories = [
  { value: "plastic", label: "Plastic" },
  { value: "organic", label: "Organic" },
  { value: "hazardous", label: "Hazardous" },
  { value: "e-waste", label: "E-Waste" },
];

export const severityOptions = [
  { value: "1", label: "Low" },
  { value: "2", label: "Minor" },
  { value: "3", label: "Medium" },
  { value: "4", label: "High" },
  { value: "5", label: "Critical" },
];

export const reportStatusOptions = [
  "pending",
  "triaged",
  "assigned",
  "in-progress",
  "resolved",
  "completed",
  "duplicate",
];

export function normalizeString(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function slugify(value) {
  return normalizeString(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toFiniteNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return Number.NaN;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

export function parseSeverity(input, fallback = 3) {
  if (typeof input === "number" && Number.isFinite(input)) {
    return clampNumber(Math.round(input), 1, 5);
  }

  const numeric = Number(input);
  if (Number.isFinite(numeric)) {
    return clampNumber(Math.round(numeric), 1, 5);
  }

  const map = {
    low: 1,
    minor: 2,
    medium: 3,
    high: 4,
    critical: 5,
    urgent: 5,
  };

  return map[normalizeString(input)] ?? fallback;
}

export function normalizeCategory(input) {
  const value = normalizeString(input);
  if (!value) {
    return "plastic";
  }

  if (value.includes("organic")) return "organic";
  if (value.includes("hazard") || value.includes("chemical")) return "hazardous";
  if (value.includes("e-waste") || value.includes("ewaste") || value.includes("electronic")) return "e-waste";
  if (value.includes("plastic")) return "plastic";

  return "plastic";
}

export function getZoneById(id) {
  const zoneId = normalizeString(id);
  return cityZones.find((zone) => zone.id === zoneId) ?? cityZones[0];
}

export function getZoneByLabel(label) {
  const normalized = normalizeString(label);
  return (
    cityZones.find((zone) => zone.label.toLowerCase() === normalized) ??
    cityZones.find((zone) => normalizeString(zone.label).includes(normalized)) ??
    cityZones.find((zone) => normalizeString(zone.id) === normalized) ??
    cityZones[0]
  );
}

export function resolveLocation(input) {
  if (!input) {
    return { ...getZoneById(DEFAULT_ZONE_ID) };
  }

  if (typeof input === "string") {
    return { ...getZoneByLabel(input) };
  }

  if (typeof input === "object") {
    if (input.locationId || input.zoneId || input.id) {
      return { ...getZoneById(input.locationId ?? input.zoneId ?? input.id) };
    }

    const latitude = toFiniteNumber(input.latitude ?? input.lat ?? input.coords?.latitude);
    const longitude = toFiniteNumber(input.longitude ?? input.lng ?? input.coords?.longitude);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      const label = input.label || input.locationLabel || input.name || "Custom location";
      return {
        id: input.locationId ?? (slugify(label) || "custom-location"),
        label,
        ward: input.ward || input.area || "Ward 00",
        latitude,
        longitude,
      };
    }

    if (input.locationLabel || input.label || input.name) {
      const zone = getZoneByLabel(input.locationLabel ?? input.label ?? input.name);
      return { ...zone };
    }
  }

  return { ...getZoneById(DEFAULT_ZONE_ID) };
}

export function haversineKm(a, b) {
  const lat1 = toFiniteNumber(a.latitude ?? a.lat);
  const lon1 = toFiniteNumber(a.longitude ?? a.lng);
  const lat2 = toFiniteNumber(b.latitude ?? b.lat);
  const lon2 = toFiniteNumber(b.longitude ?? b.lng);

  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) {
    return 0;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * r * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function detectWasteType(category, description) {
  const normalizedCategory = normalizeCategory(category);
  const text = normalizeString(description);

  const keywordMap = [
    { type: "hazardous", keywords: ["spill", "chemical", "acid", "paint", "battery"], confidence: 0.96 },
    { type: "e-waste", keywords: ["battery", "charger", "cable", "device", "electronic"], confidence: 0.93 },
    { type: "organic", keywords: ["food", "food waste", "vegetable", "leaf", "garden"], confidence: 0.91 },
    { type: "plastic", keywords: ["plastic", "bottle", "packaging", "wrapper", "bag"], confidence: 0.95 },
  ];

  for (const entry of keywordMap) {
    if (text && entry.keywords.some((keyword) => text.includes(keyword))) {
      return { wasteType: entry.type, confidence: entry.confidence };
    }
  }

  const categoryConfidence = {
    plastic: 0.92,
    organic: 0.9,
    hazardous: 0.95,
    "e-waste": 0.91,
  };

  return {
    wasteType: normalizedCategory,
    confidence: categoryConfidence[normalizedCategory] ?? 0.88,
  };
}

export function computeSeverityScore(input) {
  const parsed = parseSeverity(input, 3);
  return clampNumber(parsed, 1, 5);
}

export function detectDuplicateReport(candidate, reports) {
  const candidateLocation = resolveLocation(candidate.location ?? candidate);
  const candidateCategory = normalizeCategory(candidate.category);
  const candidateLabel = normalizeString(candidateLocation.label);

  let bestMatch = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const report of reports) {
    if (!report || report.status === "resolved" || report.status === "completed" || report.status === "duplicate") {
      continue;
    }

    const location = resolveLocation(report.location ?? report);
    const sameCategory = normalizeCategory(report.category) === candidateCategory;
    const distance = haversineKm(candidateLocation, location);
    const sameLabel =
      candidateLabel &&
      (candidateLabel === normalizeString(location.label) ||
        candidateLabel === normalizeString(report.locationLabel ?? report.location?.label));

    if (sameCategory && (distance <= 0.35 || sameLabel)) {
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = report;
      }
    }
  }

  if (!bestMatch) {
    return { duplicateOf: null, duplicateScore: 0 };
  }

  const duplicateScore = clampNumber(1 - bestDistance / 0.35, 0.25, 0.98);

  return {
    duplicateOf: bestMatch.id,
    duplicateScore,
  };
}

export function buildReportPriority(report) {
  const severity = computeSeverityScore(report.severity);
  const ageHours = Number.isFinite(Date.parse(report.createdAt))
    ? Math.max(0, (Date.now() - Date.parse(report.createdAt)) / 3_600_000)
    : 0;
  const statusBoost = {
    pending: 12,
    triaged: 16,
    assigned: 18,
    "in-progress": 20,
    urgent: 28,
  }[report.status] ?? 8;
  const categoryBoost = {
    hazardous: 22,
    "e-waste": 14,
    organic: 8,
    plastic: 10,
  }[normalizeCategory(report.category)] ?? 8;

  return Math.round(severity * 100 + ageHours * 6 + statusBoost + categoryBoost);
}

export function enrichReportDraft(input, existingReports = []) {
  const category = normalizeCategory(input.category);
  const severity = computeSeverityScore(input.severity ?? category);
  const location = resolveLocation(input.location ?? input.locationId ?? input.locationLabel ?? input);
  const ai = detectWasteType(category, input.description);
  const duplicate = detectDuplicateReport({ ...input, category, location }, existingReports);
  const title =
    input.title ||
    `${category === "e-waste" ? "E-waste" : category[0].toUpperCase() + category.slice(1)} report at ${location.label}`;
  const status = duplicate.duplicateOf ? "duplicate" : severity >= 5 ? "urgent" : severity >= 4 ? "triaged" : "pending";

  return {
    title,
    category,
    severity,
    location,
    ai,
    duplicateOf: duplicate.duplicateOf,
    duplicateScore: duplicate.duplicateScore,
    status,
    priorityScore: buildReportPriority({
      ...input,
      category,
      severity,
      status,
      createdAt: input.createdAt ?? new Date().toISOString(),
    }),
  };
}

export function buildRoutePlan(reports, options = {}) {
  const candidateReports = reports
    .filter((report) => !["resolved", "completed", "duplicate"].includes(report.status))
    .map((report) => ({
      ...report,
      location: resolveLocation(report.location ?? report),
      priorityScore: report.priorityScore ?? buildReportPriority(report),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const startLocation = resolveLocation(options.startLocation ?? options.depot ?? cityZones.find((zone) => zone.id === DEFAULT_DEPOT_ID));
  const avgSpeedKmh = Number(options.avgSpeedKmh) > 0 ? Number(options.avgSpeedKmh) : 18;
  const fuelLitersPerKm = Number(options.fuelLitersPerKm) > 0 ? Number(options.fuelLitersPerKm) : 0.18;
  const stopTimeMinutes = Number(options.stopTimeMinutes) > 0 ? Number(options.stopTimeMinutes) : 8;
  const remaining = [...candidateReports];
  const stops = [];
  let current = startLocation;
  let totalDistanceKm = 0;
  let totalMinutes = 0;

  while (remaining.length) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestDistance = 0;

    for (let index = 0; index < remaining.length; index += 1) {
      const report = remaining[index];
      const distance = haversineKm(current, report.location);
      const score = report.priorityScore * 12 - distance * 9;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
        bestDistance = distance;
      }
    }

    const next = remaining.splice(bestIndex, 1)[0];
    const travelMinutes = (bestDistance / avgSpeedKmh) * 60;
    totalDistanceKm += bestDistance;
    totalMinutes += travelMinutes + stopTimeMinutes;

    stops.push({
      reportId: next.id,
      title: next.title,
      category: next.category,
      severity: next.severity,
      priorityScore: next.priorityScore,
      location: next.location,
      distanceFromPreviousKm: Number(bestDistance.toFixed(2)),
      etaMinutes: Math.round(totalMinutes),
      ward: next.location.ward,
      status: next.status,
    });

    current = next.location;
  }

  const routeCount = stops.length;
  const efficiencyScore = clampNumber(Math.round(100 - totalDistanceKm * 1.8 + routeCount * 2), 55, 99);

  return {
    algorithm: "priority-nearest-neighbor",
    generatedAt: new Date().toISOString(),
    startLocation,
    stopTimeMinutes,
    avgSpeedKmh,
    routeCount,
    stops,
    totals: {
      distanceKm: Number(totalDistanceKm.toFixed(2)),
      estimatedMinutes: Math.round(totalMinutes),
      fuelLiters: Number((totalDistanceKm * fuelLitersPerKm).toFixed(2)),
      efficiencyScore,
    },
  };
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function countByKey(items, selector) {
  const counts = new Map();
  for (const item of items) {
    const key = selector(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function isoDay(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export function buildDashboardSnapshot(state) {
  const reports = state.reports ?? [];
  const workers = state.workers ?? [];
  const notifications = state.notifications ?? [];
  const leaderboard = state.leaderboard ?? [];
  const routePlans = state.routePlans ?? [];
  const today = isoDay(new Date());
  const openReports = reports.filter((report) => !["resolved", "completed", "duplicate"].includes(report.status));
  const urgentReports = reports.filter((report) => ["urgent"].includes(report.status) || computeSeverityScore(report.severity) >= 4);
  const completedReports = reports.filter((report) => ["resolved", "completed"].includes(report.status));
  const todayCompleted = completedReports.filter((report) => isoDay(report.updatedAt ?? report.resolvedAt ?? report.createdAt) === today);
  const responseMinutes = completedReports
    .map((report) => {
      const start = Date.parse(report.createdAt);
      const end = Date.parse(report.resolvedAt ?? report.updatedAt ?? report.createdAt);
      return Number.isFinite(start) && Number.isFinite(end) ? Math.max(0, (end - start) / 60000) : 0;
    })
    .filter((value) => value > 0);
  const responseByZone = countByKey(reports, (report) => resolveLocation(report.location ?? report).label);
  const hotspotEntries = [...responseByZone.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const routePlan = routePlans[0] ?? null;

  return {
    city: cityProfile.name,
    region: {
      id: cityProfile.id,
      name: cityProfile.displayName,
      controlRoom: cityProfile.controlRoom,
      center: cityProfile.center,
    },
    updatedAt: new Date().toISOString(),
    totals: {
      reports: reports.length,
      openReports: openReports.length,
      urgentReports: urgentReports.length,
      completedReports: completedReports.length,
      workers: workers.length,
      activeWorkers: workers.filter((worker) => worker.status !== "off-duty").length,
    },
    operations: {
      averageResponseMinutes: Number(average(responseMinutes).toFixed(1)),
      completionRate: reports.length ? Number(((completedReports.length / reports.length) * 100).toFixed(1)) : 0,
      todayCompleted: todayCompleted.length,
      unresolvedQueue: openReports.length,
      routeEfficiency: routePlan?.totals?.efficiencyScore ?? 0,
    },
    hotspots: hotspotEntries,
    recentReports: [...reports]
      .sort((a, b) => Date.parse(b.updatedAt ?? b.createdAt) - Date.parse(a.updatedAt ?? a.createdAt))
      .slice(0, 6),
    notifications: [...notifications]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 8),
    workers: [...workers].sort((a, b) => (b.completedToday ?? 0) - (a.completedToday ?? 0)),
    leaderboard: [...leaderboard].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)).slice(0, 6),
    routePlan,
    modules: state.modules ?? [],
  };
}
