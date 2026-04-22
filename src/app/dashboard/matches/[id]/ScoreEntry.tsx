"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { reportResultAction } from "@/lib/matches";

// Keep in sync with GAMES_TO_WIN in src/lib/matches.ts.
const GAMES_TO_WIN = 9;

export function ScoreEntry({
  matchId,
  homeName,
  awayName,
}: {
  matchId: string;
  homeName: string;
  awayName: string;
}) {
  const [home, setHome] = useState(GAMES_TO_WIN);
  const [away, setAway] = useState(6);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.append("matchId", matchId);
    fd.append("sets", JSON.stringify([{ home, away }]));
    start(async () => {
      const res = await reportResultAction(fd);
      if (!res.ok) setError(res.error);
    });
  }

  const winnerSide: "home" | "away" | null =
    home === away ? null : home > away ? "home" : "away";

  return (
    <form onSubmit={submit} className="surface rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Cargar resultado</h2>
        <p className="mt-1 text-sm text-white/55">
          Set único a {GAMES_TO_WIN} games. En 8-8 se define con tiebreak ({GAMES_TO_WIN}-8).
        </p>
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-white/50">
        <span className="flex-1 truncate">{homeName}</span>
        <span className="px-2">set</span>
        <span className="flex-1 truncate text-right">{awayName}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <NumberPicker
          value={home}
          onChange={setHome}
          highlight={winnerSide === "home"}
        />
        <div className="text-white/40 font-mono text-sm w-6 text-center">–</div>
        <NumberPicker
          value={away}
          onChange={setAway}
          highlight={winnerSide === "away"}
          alignRight
        />
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
  highlight,
  alignRight,
}: {
  value: number;
  onChange: (v: number) => void;
  highlight?: boolean;
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
      <div
        className={`min-w-[48px] text-center text-2xl font-mono transition-colors ${
          highlight ? "text-ball" : "text-white"
        }`}
      >
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(GAMES_TO_WIN, value + 1))}
        className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
      >
        +
      </button>
    </div>
  );
}
