import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateEs(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function monthKey(date: Date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function startOfMonthUTC(date: Date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

export function startOfNextMonthUTC(date: Date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}

export const MATCHES_PER_MONTH = 4;

// Tournament first-play date. Matches scheduled before this are rejected.
// Shift this forward if the start needs to move; everything else derives from it.
export const SEASON_START_UTC = new Date(Date.UTC(2026, 4, 1, 0, 0, 0, 0));

// The [start, end) month window against which a user's monthly quota is
// counted. Before the season starts, the window is the season's first
// month — so scheduling in April for a May match counts against May's quota,
// not against an irrelevant April one.
export function currentQuotaWindow(now: Date = new Date()) {
  const preSeason = now.getTime() < SEASON_START_UTC.getTime();
  const start = preSeason ? SEASON_START_UTC : startOfMonthUTC(now);
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
  return { start, end, preSeason };
}

export function displayName(user: { name?: string | null; email?: string | null }) {
  if (user.name && user.name.trim().length > 0) return user.name;
  if (user.email) return user.email.split("@")[0];
  return "Jugador";
}

export function initials(user: { name?: string | null; email?: string | null }) {
  const src = user.name || user.email || "??";
  const cleaned = src.replace(/[^a-zA-Z\s]/g, " ").trim();
  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || src[0]?.toUpperCase() || "?";
}
