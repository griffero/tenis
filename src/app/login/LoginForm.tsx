"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { TennisBall } from "@/components/TennisBall";
import { BouncingBalls } from "@/components/BouncingBalls";

export function LoginForm({
  action,
  error,
}: {
  action: (data: FormData) => Promise<void>;
  error?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await action(fd);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BouncingBalls count={4} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-full max-w-md surface rounded-3xl p-8 md:p-10 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <TennisBall size={60} spin />
          </motion.div>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-tight">
          Bienvenido al <span className="text-ball">torneo</span>
        </h1>
        <p className="mt-2 text-center text-sm text-white/55">
          Ingresá tu mail, te mandamos un enlace mágico.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vos@club.com"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner /> Enviando…
              </>
            ) : (
              <>Mandar enlace →</>
            )}
          </motion.button>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              Algo salió mal. Volvé a intentar en unos segundos.
            </motion.p>
          )}
        </form>

        <div className="mt-8 text-center text-xs text-white/40">
          Sin contraseñas. Sin vueltas. Solo tenis.
        </div>
      </motion.div>
    </>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
    </svg>
  );
}
