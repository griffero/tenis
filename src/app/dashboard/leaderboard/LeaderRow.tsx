"use client";
import { motion } from "framer-motion";

export function LeaderRow({
  position,
  me,
  name,
  initials,
  played,
  wins,
  losses,
  points,
  index,
}: {
  position: number;
  me: boolean;
  name: string;
  initials: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  index: number;
}) {
  const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className={`grid grid-cols-[40px_1fr_60px_60px_72px] md:grid-cols-[50px_1fr_80px_80px_80px_96px] gap-3 px-5 py-3.5 items-center border-b border-white/5 last:border-0 transition-colors ${
        me ? "bg-ball/5" : "hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-mono ${position <= 3 ? "text-ball" : "text-white/40"}`}>
          {String(position).padStart(2, "0")}
        </span>
        {medal && <span className="text-base leading-none">{medal}</span>}
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`h-9 w-9 rounded-full grid place-items-center text-xs font-semibold flex-shrink-0 ${
            me
              ? "bg-ball text-ink shadow-glow"
              : position === 1
                ? "bg-gradient-to-br from-ball/40 to-ball/10 text-ball border border-ball/30"
                : "bg-white/5 text-white/70 border border-white/10"
          }`}
        >
          {initials}
        </div>
        <div className="truncate text-sm font-medium">
          {name}
          {me && <span className="ml-2 text-[10px] uppercase tracking-widest text-ball">tú</span>}
        </div>
      </div>
      <div className="text-center text-sm text-white/60 hidden md:block">{played}</div>
      <div className="text-center text-sm">{wins}</div>
      <div className="text-center text-sm text-white/60">{losses}</div>
      <div className="text-right font-mono text-lg">
        <span className={position <= 3 ? "text-ball" : "text-white"}>{points}</span>
      </div>
    </motion.div>
  );
}
