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

// Returns the [start, end) scheduledAt window that attributes to the same
// monthly quota as `date`. Any match scheduled before SEASON_START_UTC is
// attributed to the season's first month (so an April-scheduled match
// counts against May's quota). Pass `now` to get the window for the
// current user's quota; pass a scheduledAt value to get the window for
// the quota a specific match would consume.
export function quotaWindowFor(date: Date = new Date()) {
  const preSeason = date.getTime() < SEASON_START_UTC.getTime();
  const seasonMonthStart = startOfMonthUTC(SEASON_START_UTC);
  const seasonMonthEnd = startOfNextMonthUTC(SEASON_START_UTC);

  if (preSeason) {
    return {
      // Epoch lower bound catches any pre-season date.
      start: new Date(0),
      end: seasonMonthEnd,
      attributedTo: seasonMonthStart,
      preSeason: true,
    };
  }

  const monthStart = startOfMonthUTC(date);
  const monthEnd = startOfNextMonthUTC(date);
  const isFirstSeasonMonth = monthStart.getTime() === seasonMonthStart.getTime();

  return {
    // Once we're in the first season month, pre-season matches roll into
    // this window (they were attributed here).
    start: isFirstSeasonMonth ? new Date(0) : monthStart,
    end: monthEnd,
    attributedTo: monthStart,
    preSeason: false,
  };
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
