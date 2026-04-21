"use client";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reportResultAction } from "@/lib/matches";

type Set = { home: number; away: number };

export function ScoreEntry({
  matchId,
  homeName,
  awayName,
}: {
  matchId: string;
  homeName: string;
  awayName: string;
}) {
  const [sets, setSets] = useState<Set[]>([{ home: 6, away: 4 }, { home: 4, away: 6 }, { home: 6, away: 3 }]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function update(i: number, side: "home" | "away", value: number) {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, [side]: value } : s)));
  }
  function addSet() {
    if (sets.length >= 5) return;
    setSets((s) => [...s, { home: 0, away: 0 }]);
  }
  function removeSet() {
    if (sets.length <= 1) return;
    setSets((s) => s.slice(0, -1));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.append("matchId", matchId);
    fd.append("sets", JSON.stringify(sets));
    start(async () => {
      const res = await reportResultAction(fd);
      if (!res.ok) setError(res.error);
    });
  }

  const homeSets = sets.filter((s) => s.home > s.away).length;
  const awaySets = sets.filter((s) => s.away > s.home).length;

  return (
    <form onSubmit={submit} className="surface rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Cargar resultado</h2>
        <p className="mt-1 text-sm text-white/55">Sets ganados: un jugador necesita más sets que el otro.</p>
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-white/50">
        <span className="flex-1 truncate">{homeName}</span>
        <span className="px-2">set</span>
        <span className="flex-1 truncate text-right">{awayName}</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {sets.map((s, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center"
            >
              <NumberPicker value={s.home} onChange={(v) => update(i, "home", v)} />
              <div className="text-white/40 font-mono text-sm w-6 text-center">{i + 1}</div>
              <NumberPicker value={s.away} onChange={(v) => update(i, "away", v)} alignRight />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-3 text-sm">
        <button type="button" onClick={removeSet} className="btn-ghost" disabled={sets.length <= 1}>
          − Quitar set
        </button>
        <button type="button" onClick={addSet} className="btn-ghost" disabled={sets.length >= 5}>
          + Agregar set
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.14em] text-white/50">Global</div>
        <div className="text-2xl font-mono">
          <span className={homeSets > awaySets ? "text-ball" : "text-white/70"}>{homeSets}</span>
          <span className="text-white/30 mx-2">–</span>
          <span className={awaySets > homeSets ? "text-ball" : "text-white/70"}>{awaySets}</span>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
        >
          {error}
        </motion.div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Guardando…" : "Guardar resultado"}
      </button>
    </form>
  );
}

function NumberPicker({
  value,
  onChange,
  alignRight,
}: {
  value: number;
  onChange: (v: number) => void;
  alignRight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${alignRight ? "justify-end" : ""}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
      >
        −
      </button>
      <div className="min-w-[48px] text-center text-2xl font-mono">{value}</div>
      <button
        type="button"
        onClick={() => onChange(Math.min(7, value + 1))}
        className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
      >
        +
      </button>
    </div>
  );
}
