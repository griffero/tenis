import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MATCHES_PER_MONTH,
  attributeMatchesToQuotaMonths,
  currentQuotaMonth,
  displayName,
  isPreSeason,
  monthKeyUTC,
} from "@/lib/utils";
import { MonthlyQuota } from "@/components/MonthlyQuota";
import { MatchCard } from "@/components/MatchCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default async function DashboardHome() {
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const currentMonth = currentQuotaMonth(now);
  const preSeason = isPreSeason(now);

  const [userScheduled, upcoming, recent, rank] = await Promise.all([
    prisma.match.findMany({
      where: {
        schedulerId: userId,
        status: { in: ["SCHEDULED", "COMPLETED"] },
      },
      select: { id: true, scheduledAt: true, createdAt: true },
    }),
    prisma.match.findMany({
      where: {
        status: "SCHEDULED",
        OR: [{ homeId: userId }, { awayId: userId }],
        scheduledAt: { gte: now },
      },
      orderBy: { scheduledAt: "asc" },
      take: 4,
      include: { home: true, away: true, scheduler: true, winner: true },
    }),
    prisma.match.findMany({
      where: {
        status: "COMPLETED",
        OR: [{ homeId: userId }, { awayId: userId }],
      },
      orderBy: { scheduledAt: "desc" },
      take: 3,
      include: { home: true, away: true, scheduler: true, winner: true },
    }),
    computeMyRank(userId),
  ]);

  const { perMonth } = attributeMatchesToQuotaMonths(userScheduled);
  const scheduledThisMonth = perMonth.get(monthKeyUTC(currentMonth)) ?? 0;
  const remaining = Math.max(0, MATCHES_PER_MONTH - scheduledThisMonth);
  const name = displayName(session!.user);
  const quotaLabel = new Intl.DateTimeFormat("es-CL", { month: "long" }).format(currentMonth);

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-white/50">
              {preSeason
                ? "Pretemporada"
                : new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(now)}
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-1">
              Hola, <span className="text-ball">{name}</span>.
            </h1>
            <p className="mt-2 text-white/60">
              {preSeason ? (
                <>
                  El torneo parte el <strong className="text-white">1 de mayo</strong>. Tienes{" "}
                  <strong className="text-white">{remaining}</strong>{" "}
                  {remaining === 1 ? "partido libre" : "partidos libres"} para {quotaLabel} —
                  si juegas en abril, también cuenta acá.
                </>
              ) : (
                <>
                  Te quedan <strong className="text-white">{remaining}</strong>{" "}
                  {remaining === 1 ? "partido" : "partidos"} en {quotaLabel}.
                  {remaining === 0 && " Los próximos caen al mes siguiente."}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/matches/new" className="btn-primary">
              + Agendar partido
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      <div className="grid gap-6 md:grid-cols-3">
        <RevealOnScroll delay={0.05} className="md:col-span-2">
          <div className="surface rounded-3xl p-6 md:p-8">
            <h2 className="text-sm uppercase tracking-[0.14em] text-white/50 mb-4">
              {preSeason ? `Cupo de ${quotaLabel}` : "Cupo mensual"}
            </h2>
            <MonthlyQuota used={Math.min(scheduledThisMonth, MATCHES_PER_MONTH)} total={MATCHES_PER_MONTH} />
            <p className="mt-5 text-sm text-white/55">
              {preSeason
                ? `El torneo arranca el 1 de mayo. Los partidos que juegues en abril se cuentan contra el cupo de ${quotaLabel}.`
                : `Cada jugador programa ${MATCHES_PER_MONTH} partidos por mes. Si agendas de más, los extra caen al mes siguiente.`}
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="surface rounded-3xl p-6 h-full">
            <h2 className="text-sm uppercase tracking-[0.14em] text-white/50 mb-3">
              Tu posición
            </h2>
            {rank ? (
              <div>
                <div className="text-5xl font-bold tracking-tight">
                  #{rank.position}
                  <span className="text-lg text-white/40 font-normal ml-1.5">
                    / {rank.total}
                  </span>
                </div>
                <div className="mt-2 text-sm text-white/55">
                  {rank.wins} G · {rank.losses} P · {rank.points} pts
                </div>
                <Link
                  href="/dashboard/leaderboard"
                  className="inline-block mt-5 text-sm text-ball hover:underline"
                >
                  Ver ranking →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-white/55">
                Todavía no jugaste partidos completados. ¡Arranca!
              </p>
            )}
          </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={0.1}>
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-semibold">Próximos partidos</h2>
            <Link href="/dashboard/matches" className="text-sm text-white/50 hover:text-white">
              Ver todos →
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="surface rounded-2xl px-6 py-10 text-center text-white/50 text-sm">
              No tienes partidos agendados.{" "}
              <Link href="/dashboard/matches/new" className="text-ball hover:underline">
                Agenda uno
              </Link>
              .
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {upcoming.map((m, i) => (
                <MatchCard key={m.id} match={m} meId={userId} index={i} />
              ))}
            </div>
          )}
        </section>
      </RevealOnScroll>

      {recent.length > 0 && (
        <RevealOnScroll delay={0.1}>
          <section>
            <h2 className="text-xl font-semibold mb-4">Resultados recientes</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {recent.map((m, i) => (
                <MatchCard key={m.id} match={m} meId={userId} index={i} compact />
              ))}
            </div>
          </section>
        </RevealOnScroll>
      )}
    </div>
  );
}

async function computeMyRank(userId: string) {
  const all = await prisma.match.findMany({
    where: { status: "COMPLETED" },
    select: { homeId: true, awayId: true, winnerId: true },
  });
  if (all.length === 0) return null;
  const agg = new Map<string, { wins: number; losses: number }>();
  for (const m of all) {
    if (!m.winnerId) continue;
    const loserId = m.winnerId === m.homeId ? m.awayId : m.homeId;
    const w = agg.get(m.winnerId) ?? { wins: 0, losses: 0 };
    w.wins += 1;
    agg.set(m.winnerId, w);
    const l = agg.get(loserId) ?? { wins: 0, losses: 0 };
    l.losses += 1;
    agg.set(loserId, l);
  }
  const ranked = [...agg.entries()]
    .map(([id, v]) => ({ id, ...v, points: v.wins * 3 - v.losses * 0 }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  const idx = ranked.findIndex((r) => r.id === userId);
  if (idx < 0) return null;
  return {
    position: idx + 1,
    total: ranked.length,
    wins: ranked[idx].wins,
    losses: ranked[idx].losses,
    points: ranked[idx].points,
  };
}
