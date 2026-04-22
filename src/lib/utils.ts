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

// The quota month a user is currently playing under. Before the season
// starts, we're already operating against the season's first month.
export function currentQuotaMonth(now: Date = new Date()) {
  if (now.getTime() < SEASON_START_UTC.getTime()) return startOfMonthUTC(SEASON_START_UTC);
  return startOfMonthUTC(now);
}

export function isPreSeason(now: Date = new Date()) {
  return now.getTime() < SEASON_START_UTC.getTime();
}

export function monthKeyUTC(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Attributes each of a user's non-cancelled matches to a quota month,
// spilling overflow forward. Rules:
//   - Pre-season scheduledAt is clamped to the season's first month.
//   - Matches are processed in createdAt order; each lands on the
//     earliest month >= its natural month that still has capacity.
//     createdAt order keeps "the one I just added is the one that
//     spills" intuitive, and lets existing matches stay put when later
//     ones are added.
//   - Fully deterministic — cancellations naturally let later matches
//     roll back when the function is re-run on the remaining set.
// Returns per-match attribution and per-month counts (month keys from
// monthKeyUTC). Never rejects: with an infinite month line, overflow
// always finds a home.
export function attributeMatchesToQuotaMonths(
  matches: Array<{ id: string; scheduledAt: Date; createdAt: Date }>,
  capacity: number = MATCHES_PER_MONTH,
) {
  const sorted = [...matches].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
  const seasonFirstMonth = startOfMonthUTC(SEASON_START_UTC);
  const perMonth = new Map<string, number>();
  const perMatch = new Map<string, Date>();

  for (const m of sorted) {
    const natural = startOfMonthUTC(m.scheduledAt);
    let target =
      natural.getTime() < seasonFirstMonth.getTime() ? new Date(seasonFirstMonth) : natural;
    // Guard against pathological input — capacity=0 or millions of matches.
    for (let steps = 0; steps < 240; steps++) {
      const key = monthKeyUTC(target);
      const count = perMonth.get(key) ?? 0;
      if (count < capacity) {
        perMonth.set(key, count + 1);
        perMatch.set(m.id, target);
        break;
      }
      target = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 1));
    }
  }

  return { perMatch, perMonth };
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
