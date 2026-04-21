"use client";
import { motion } from "framer-motion";

export function MonthlyQuota({ used, total }: { used: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, (used / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-3xl font-semibold">
          {used} <span className="text-white/40 text-xl font-normal">/ {total}</span>
        </div>
        <div className="text-xs uppercase tracking-[0.14em] text-white/50">partidos</div>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < used;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260 }}
              className={`flex-1 h-3 rounded-full ${
                filled ? "bg-ball shadow-glow" : "bg-white/10"
              }`}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="h-[2px] bg-gradient-to-r from-ball/60 to-ball mt-4 rounded-full"
      />
    </div>
  );
}
