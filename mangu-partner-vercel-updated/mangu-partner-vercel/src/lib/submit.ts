const PENDING_KEY = "mangu_pending";
const THANKS_KEY = "mangu_thanks";

export type Payload = Record<string, unknown> & { submissionId: string; registrantType: "mechanic" | "fleet" };

function endpoint(): string {
  return ((import.meta.env as Record<string, string | undefined>)["VITE_SHEET_ENDPOINT"] ?? "").trim();
}

function readPending(): Payload[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [v];
  } catch {
    return [];
  }
}
function writePending(items: Payload[]) {
  if (items.length) localStorage.setItem(PENDING_KEY, JSON.stringify(items));
  else localStorage.removeItem(PENDING_KEY);
}

async function post(p: Payload) {
  const url = endpoint();
  if (!url) throw new Error("Missing VITE_SHEET_ENDPOINT");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000); // weak data: give up after 10s, keep it queued
  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(p),
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Queues the payload, tries to send it. Returns true if sent, false if kept for later. */
export async function submitPayload(p: Payload): Promise<boolean> {
  const list = readPending().filter((x) => x.submissionId !== p.submissionId);
  writePending([...list, p]);
  if (typeof navigator !== "undefined" && !navigator.onLine) return false;
  try {
    await post(p);
    writePending(readPending().filter((x) => x.submissionId !== p.submissionId));
    return true;
  } catch {
    return false;
  }
}

let flushing = false;
export async function flushPending() {
  if (flushing || !navigator.onLine) return;
  flushing = true;
  try {
    for (const p of readPending()) {
      try {
        await post(p);
        writePending(readPending().filter((x) => x.submissionId !== p.submissionId));
      } catch {
        break;
      }
    }
  } finally {
    flushing = false;
  }
}

export function startRetryLoop() {
  flushPending();
  window.addEventListener("online", flushPending);
  return () => window.removeEventListener("online", flushPending);
}

export function nairobiISO(d = new Date()): string {
  // Africa/Nairobi is UTC+3 all year (no daylight saving).
  const t = new Date(d.getTime() + 3 * 3600 * 1000).toISOString().replace("Z", "");
  return `${t.slice(0, 19)}+03:00`;
}

export function getUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const q = new URLSearchParams(window.location.search);
    q.forEach((v, k) => {
      if (k.startsWith("utm_")) out[k] = v;
    });
    if (Object.keys(out).length) sessionStorage.setItem("mangu_utm", JSON.stringify(out));
    else return JSON.parse(sessionStorage.getItem("mangu_utm") || "{}");
  } catch {
    /* ignore */
  }
  return out;
}

export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export type ThanksState = { firstName: string; company?: string; type: "mechanic" | "fleet"; offline: boolean };
export const setThanks = (s: ThanksState) => sessionStorage.setItem(THANKS_KEY, JSON.stringify(s));
export const getThanks = (): ThanksState | null => {
  try {
    return JSON.parse(sessionStorage.getItem(THANKS_KEY) || "null");
  } catch {
    return null;
  }
};
