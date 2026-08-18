import {
  REGIONAL_SOURCES,
  REGIONAL_TENDERS,
  SEED_ACTIVITY,
  SEED_SOURCES,
  SEED_TENDERS,
} from './seed';
import type { ActivityItem, NewSourceInput, Source, Tender } from './types';

/**
 * Tender Watch backend. The original deployment exposes a CORS-open JSON API;
 * we keep talking to it so the shared team watchlist stays in sync, and fall
 * back to the embedded snapshot when it cannot be reached.
 */
const API_BASE = 'https://x1efw6-758qavg9l-arcadawebapps8.vercel.app/api';

/** Regional seed items use ids 100–999; locally-created items use epoch ids. */
const REGIONAL_ID_MIN = 100;
const LOCAL_ID_MIN = 1_000_000;

const KEY_LOCAL_SOURCES = 'tenderwatch.localSources.v1';
const KEY_REMOVED_REGIONAL = 'tenderwatch.removedRegional.v1';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...init,
    });
    if (!res.ok) {
      let message = 'Request failed';
      try {
        const body = (await res.json()) as { error?: string } | null;
        if (body?.error) message = body.error;
      } catch {
        /* non-JSON error body */
      }
      throw new Error(message);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export interface LoadResult<T> {
  data: T;
  /** True when the data came from the live backend. */
  live: boolean;
}

export async function loadTenders(): Promise<LoadResult<Tender[]>> {
  let remote: Tender[] | null = null;
  try {
    remote = await apiFetch<Tender[]>('/tenders');
  } catch {
    remote = null;
  }
  const base = remote ?? SEED_TENDERS;
  const knownRefs = new Set(base.map((t) => t.ref_number));
  const merged = [
    ...base,
    ...REGIONAL_TENDERS.filter((t) => !knownRefs.has(t.ref_number)),
  ];
  merged.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  return { data: merged, live: remote !== null };
}

export async function loadSources(): Promise<LoadResult<Source[]>> {
  let remote: Source[] | null = null;
  try {
    remote = await apiFetch<Source[]>('/sources');
  } catch {
    remote = null;
  }
  const base = remote ?? SEED_SOURCES;
  const removedRegional = readJSON<number[]>(KEY_REMOVED_REGIONAL, []);
  const localSources = readJSON<Source[]>(KEY_LOCAL_SOURCES, []);
  const knownNames = new Set(base.map((s) => s.name.trim().toLowerCase()));
  const regional = REGIONAL_SOURCES.filter(
    (s) =>
      !removedRegional.includes(s.id) &&
      !knownNames.has(s.name.trim().toLowerCase()),
  );
  return { data: [...base, ...regional, ...localSources], live: remote !== null };
}

export async function loadActivity(): Promise<LoadResult<ActivityItem[]>> {
  try {
    const data = await apiFetch<ActivityItem[]>('/activity');
    return { data, live: true };
  } catch {
    return { data: SEED_ACTIVITY, live: false };
  }
}

/**
 * Add a source. Goes to the shared backend when possible; otherwise the
 * source is stored locally so the watchlist still grows offline.
 */
export async function addSource(
  input: NewSourceInput,
): Promise<{ source: Source; live: boolean }> {
  try {
    const saved = await apiFetch<Source>('/sources', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return { source: saved, live: true };
  } catch {
    const source: Source = {
      ...input,
      id: Date.now(),
      verified: false,
      created_at: new Date().toISOString(),
    };
    const local = readJSON<Source[]>(KEY_LOCAL_SOURCES, []);
    writeJSON(KEY_LOCAL_SOURCES, [...local, source]);
    return { source, live: false };
  }
}

/**
 * Remove a source. Backend-managed sources are deleted via the API;
 * regional seed items and locally-stored sources are removed on-device.
 */
export async function removeSource(
  source: Source,
): Promise<{ live: boolean; localOnly: boolean }> {
  if (source.id >= LOCAL_ID_MIN) {
    const local = readJSON<Source[]>(KEY_LOCAL_SOURCES, []);
    writeJSON(
      KEY_LOCAL_SOURCES,
      local.filter((s) => s.id !== source.id),
    );
    return { live: false, localOnly: true };
  }
  if (source.id >= REGIONAL_ID_MIN) {
    const removed = readJSON<number[]>(KEY_REMOVED_REGIONAL, []);
    if (!removed.includes(source.id)) {
      writeJSON(KEY_REMOVED_REGIONAL, [...removed, source.id]);
    }
    return { live: false, localOnly: true };
  }
  await apiFetch('/sources', {
    method: 'DELETE',
    body: JSON.stringify({ id: source.id }),
  });
  return { live: true, localOnly: false };
}
