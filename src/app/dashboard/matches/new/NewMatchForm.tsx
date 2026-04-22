"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createMatchAction } from "@/lib/matches";
import { displayName, initials } from "@/lib/utils";

type Player = { id: string; name: string | null; email: string | null };

export function NewMatchForm({ players }: { players: Player[] }) {
  const router = useRouter();
  const [opponentId, setOpponentId] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState<string>(() => defaultDate());
  const [location, setLocation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await createMatchAction(fd);
      if (res.ok) {
        router.push(`/dashboard/matches/${res.matchId}`);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="surface rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <label className="label">Rival</label>
        {players.length === 0 ? (
          <p className="text-sm text-white/55">
            Todavía no hay otros jugadores registrados. Invita a alguien a ingresar.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {players.map((p, i) => {
              const selected = opponentId === p.id;
              return (
                <motion.button
                  type="button"
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOpponentId(p.id)}
                  className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition ${
                    selected
                      ? "border-ball bg-ball/10 shadow-glow"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-full grid place-items-center text-xs font-semibold ${
                      selected
                        ? "bg-ball text-ink"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {initials(p)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{displayName(p)}</div>
                    {p.email && (
                      <div className="text-[10px] text-white/40 truncate">{p.email}</div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
        <input type="hidden" name="opponentId" value={opponentId} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="scheduledAt" className="label">
            Fecha y hora
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            className="field"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="location" className="label">
            Cancha (opcional)
          </label>
          <input
            id="location"
            name="location"
            type="text"
            maxLength={120}
            placeholder="Club, cancha #2"
            className="field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
        <p className="text-xs text-white/40">
          Se cuenta contra tu cupo mensual al confirmar.
        </p>
        <button
          type="submit"
          disabled={pending || !opponentId}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Agendando…" : "Agendar partido →"}
        </button>
      </div>
    </form>
  );
}

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(19, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
