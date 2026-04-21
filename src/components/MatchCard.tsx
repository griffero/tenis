"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { displayName, formatDateEs, initials } from "@/lib/utils";

type MatchWithPlayers = {
  id: string;
  scheduledAt: Date | string;
  location: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  scoreJson: string | null;
  winnerId: string | null;
  homeId: string;
  awayId: string;
  schedulerId: string;
  home: { id: string; name: string | null; email: string | null };
  away: { id: string; name: string | null; email: string | null };
  scheduler: { id: string; name: string | null; email: string | null };
  winner: { id: string; name: string | null; email: string | null } | null;
};

export function MatchCard({
  match,
  meId,
  index = 0,
  compact = false,
}: {
  match: MatchWithPlayers;
  meId: string;
  index?: number;
  compact?: boolean;
}) {
  const meIsHome = match.homeId === meId;
  const score = match.scoreJson ? (JSON.parse(match.scoreJson) as Array<{ home: number; away: number }>) : null;
  const iWon = match.winnerId === meId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/dashboard/matches/${match.id}`}
        className="surface rounded-2xl p-5 block relative overflow-hidden group transition-colors hover:border-ball/25"
      >
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-ball/10 blur-2xl opacity-0 group-hover:opacity-70 transition" />
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/45 mb-3">
            <span>{formatDateEs(match.scheduledAt)}</span>
            <StatusBadge status={match.status} won={match.status === "COMPLETED" ? iWon : null} />
          </div>

          <div className="flex items-center gap-3">
            <Player user={match.home} highlight={meIsHome} />
            <div className="text-sm text-white/40 font-medium mx-1">vs</div>
            <Player user={match.away} highlight={!meIsHome} alignRight />
          </div>

          {score && !compact && (
            <div className="mt-4 flex gap-2 justify-center">
              {score.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.1, type: "spring" }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono border ${
                    s.home > s.away
                      ? "border-ball/40 bg-ball/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {s.home}–{s.away}
                </motion.div>
              ))}
            </div>
          )}

          {match.location && !compact && (
            <div className="mt-3 text-xs text-white/40 flex items-center gap-1.5">
              <PinIcon /> {match.location}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function Player({
  user,
  highlight,
  alignRight,
}: {
  user: { name: string | null; email: string | null };
  highlight?: boolean;
  alignRight?: boolean;
}) {
  return (
    <div className={`flex-1 flex items-center gap-2.5 ${alignRight ? "flex-row-reverse text-right" : ""}`}>
      <div
        className={`h-9 w-9 rounded-full grid place-items-center text-xs font-semibold flex-shrink-0 ${
          highlight
            ? "bg-ball text-ink shadow-glow"
            : "bg-white/5 text-white/70 border border-white/10"
        }`}
      >
        {initials(user)}
      </div>
      <div className="min-w-0">
        <div className={`text-sm truncate ${highlight ? "text-white font-medium" : "text-white/75"}`}>
          {displayName(user)}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, won }: { status: string; won: boolean | null }) {
  if (status === "SCHEDULED") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-ball animate-ping" />
          <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-ball" />
        </span>
        Agendado
      </span>
    );
  }
  if (status === "COMPLETED") {
    return (
      <span className={won ? "text-ball" : "text-white/50"}>
        {won ? "Ganaste" : "Perdiste"}
      </span>
    );
  }
  return <span className="text-white/40">Cancelado</span>;
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s-7-8.5-7-13a7 7 0 1 1 14 0c0 4.5-7 13-7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
