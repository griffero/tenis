"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TennisBall } from "./TennisBall";
import { Court } from "./Court";
import { BouncingBalls } from "./BouncingBalls";
import { AnimatedCounter } from "./AnimatedCounter";

export function Landing({
  isAuthed,
  preSeason,
  stats,
}: {
  isAuthed: boolean;
  preSeason: boolean;
  stats: { players: number; matches: number; completed: number };
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const ctaHref = isAuthed ? "/dashboard" : "/login";

  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[100svh] px-6 pt-8 md:pt-14 pb-24">
        <BouncingBalls count={8} />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <TennisBall size={34} spin />
            <span className="font-semibold tracking-tight">Tenis <span className="text-ball">Championship</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href={ctaHref} className="btn-ghost">
              {isAuthed ? "Dashboard" : "Ingresar"}
            </Link>
          </div>
        </nav>

        <motion.div style={{ y, scale }} className="relative z-10 mx-auto mt-10 md:mt-24 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2 mb-5"
          >
            <span className="pill">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-ball animate-ping" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-ball" />
              </span>
              {preSeason ? "Arranca el 1 de mayo" : "Temporada abierta"}
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09 } },
            }}
          >
            {[
              ["Juega.", "text-white"],
              ["Agenda.", "text-white/90"],
              ["Sube al ranking.", "text-shimmer"],
            ].map(([text, cls], i) => (
              <motion.span
                key={i}
                className={`block ${cls}`}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] },
                  },
                }}
              >
                {text}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 max-w-xl text-lg text-white/70 leading-relaxed"
          >
            {preSeason ? (
              <>
                Arrancamos el <strong className="text-white">1 de mayo</strong>. Cada jugador
                programa <strong className="text-white">4 partidos por mes</strong>, sin grupos
                de WhatsApp ni planillas.
              </>
            ) : (
              <>
                Cada jugador programa <strong className="text-white">4 partidos por mes</strong>.
                Sin grupos de WhatsApp, sin planillas. El torneo corre solo.
              </>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href={ctaHref} className="btn-primary text-base group">
              <span>{isAuthed ? "Ir al dashboard" : "Empezar a jugar"}</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <span className="text-sm text-white/50">
              Login con tu mail · sin contraseñas
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-20 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl"
          >
            <StatCard label="Jugadores" value={stats.players} accent="text-ball" />
            <StatCard label="Partidos" value={stats.matches} />
            <StatCard label="Completados" value={stats.completed} />
          </motion.div>
        </motion.div>

        {/* Floating ball next to hero */}
        <motion.div
          className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.div
            animate={{ y: [0, -24, 0], rotate: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <TennisBall size={260} spin />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl"
          >
            Un sistema sencillo.{" "}
            <span className="text-white/50">Cuatro partidos cada mes. Todos contra todos.</span>
          </motion.h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Feature
              index={0}
              title="Agenda tus partidos"
              body="Elige rival, fecha y cancha. Recibes confirmaciones por mail."
              icon={<CalendarIcon />}
            />
            <Feature
              index={1}
              title="Carga resultados"
              body="Set por set. El ranking se recalcula en vivo."
              icon={<ScoreIcon />}
            />
            <Feature
              index={2}
              title="4 por mes, siempre"
              body="Cupo justo. Cada jugador programa exactamente 4 partidos mensuales."
              icon={<TrophyIcon />}
            />
          </div>
        </div>
      </section>

      {/* Court showcase */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">
              La cancha, <span className="text-ball">en tu bolsillo</span>.
            </h3>
            <p className="mt-6 text-white/65 leading-relaxed max-w-lg">
              Visualizaciones animadas, resultados en tiempo real, y un ranking
              que se actualiza con cada punto que cargas.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <Court className="w-full rounded-3xl border border-white/5 shadow-2xl" />
            <motion.div
              className="absolute"
              initial={{ x: 40, y: 40 }}
              animate={{
                x: [40, 420, 60, 380, 40],
                y: [40, 80, 250, 120, 40],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <TennisBall size={28} spin />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-4xl surface rounded-3xl px-8 py-14 md:py-20 text-center overflow-hidden relative noise">
          <div className="absolute inset-0 court-pattern opacity-60" />
          <div className="relative">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              ¿Listo para <span className="text-shimmer">saltar a la cancha</span>?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-5 text-white/60"
            >
              Ingresa con tu mail, agenda tu primer partido y empieza a sumar puntos.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-10 flex justify-center"
            >
              <Link href={ctaHref} className="btn-primary text-base">
                {isAuthed ? "Ir al dashboard" : "Entrar al torneo"} →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-xs text-white/40">
        Tenis Championship · hecho con ♥ y muchos overheads
      </footer>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="surface rounded-2xl p-5">
      <div className={`text-3xl md:text-4xl font-semibold tracking-tight ${accent ?? "text-white"}`}>
        <AnimatedCounter value={value} />
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-white/50">{label}</div>
    </div>
  );
}

function Feature({
  index,
  title,
  body,
  icon,
}: {
  index: number;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className="surface rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ball/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
      <div className="relative">
        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ball/15 text-ball">
          {icon}
        </div>
        <div className="text-lg font-semibold">{title}</div>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function ScoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM4 5h3v3a3 3 0 0 1-3-3Zm16 0h-3v3a3 3 0 0 0 3-3Z" />
    </svg>
  );
}
