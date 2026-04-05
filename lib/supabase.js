const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "") || "";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim() || "";
const schema = process.env.SUPABASE_SCHEMA?.trim() || "public";

function getCache() {
  if (!globalThis.__ecorouteSupabaseCache) {
    globalThis.__ecorouteSupabaseCache = {
      failed: false,
      lastError: "",
    };
  }

  return globalThis.__ecorouteSupabaseCache;
}

function getHeaders(prefer = "") {
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/json",
    "Accept-Profile": schema,
    "Content-Profile": schema,
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  return headers;
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

async function request(table, { method = "GET", query = "", body, prefer = "" } = {}) {
  if (!hasSupabaseStorage()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const cache = getCache();
  const endpoint = `${url}/rest/v1/${table}${query ? `?${query}` : ""}`;
  const init = {
    method,
    headers: getHeaders(prefer),
    cache: "no-store",
  };

  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, init);
  const text = await response.text();
  let data = [];

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.message) ||
      (typeof data === "object" && data?.error_description) ||
      response.statusText ||
      "Supabase request failed.";
    cache.failed = true;
    cache.lastError = message;
    throw new Error(message);
  }

  cache.failed = false;
  cache.lastError = "";
  return data;
}

export function hasSupabaseStorage() {
  return Boolean(url && serviceRoleKey);
}

export function getConfiguredStorageDriver() {
  const cache = getCache();
  return hasSupabaseStorage() && !cache.failed ? "supabase" : "file";
}

export function getStorageStatus() {
  const cache = getCache();
  return {
    configuredDriver: hasSupabaseStorage() ? "supabase" : "file",
    activeDriver: getConfiguredStorageDriver(),
    durable: getConfiguredStorageDriver() === "supabase",
    fallbackActive: cache.failed,
    lastError: cache.lastError || "",
  };
}

export async function selectSupabaseRows(table, { select = "*", filters = {}, limit } = {}) {
  const query = buildQuery({
    select,
    ...filters,
    ...(limit ? { limit } : {}),
  });

  const data = await request(table, { query });
  return Array.isArray(data) ? data : [];
}

export async function insertSupabaseRow(table, value, { upsert = false } = {}) {
  const prefer = upsert ? "resolution=merge-duplicates,return=representation" : "return=representation";
  const data = await request(table, {
    method: "POST",
    body: value,
    prefer,
  });

  return Array.isArray(data) ? data[0] ?? null : data;
}

export async function updateSupabaseRows(table, value, { filters = {} } = {}) {
  const query = buildQuery(filters);
  const data = await request(table, {
    method: "PATCH",
    query,
    body: value,
    prefer: "return=representation",
  });

  return Array.isArray(data) ? data : [];
}

export async function deleteSupabaseRows(table, { filters = {} } = {}) {
  const query = buildQuery(filters);
  const data = await request(table, {
    method: "DELETE",
    query,
    prefer: "return=representation",
  });

  return Array.isArray(data) ? data : [];
}
