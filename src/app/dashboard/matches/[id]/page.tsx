import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelMatchAction } from "@/lib/matches";
import { displayName, formatDateEs, initials } from "@/lib/utils";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Court } from "@/components/Court";
import { ScoreEntry } from "./ScoreEntry";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session!.user.id;
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: { home: true, away: true, scheduler: true, winner: true },
  });
  if (!match) notFound();

  const meIsParticipant = match.homeId === userId || match.awayId === userId;
  const canCancel = match.schedulerId === userId && match.status === "SCHEDULED";
  const canScore = meIsParticipant && match.status === "SCHEDULED";
  const score = match.scoreJson
    ? (JSON.parse(match.scoreJson) as Array<{ home: number; away: number }>)
    : null;

  async function doCancel() {
    "use server";
    await cancelMatchAction(id);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <RevealOnScroll>
        <Link
          href="/dashboard/matches"
          className="text-sm text-white/50 hover:text-white/80 transition"
        >
          ← Partidos
        </Link>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="surface rounded-3xl overflow-hidden">
          <div className="relative">
            <Court className="w-full h-44 md:h-56" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/60">
                  {formatDateEs(match.scheduledAt)}
                </div>
                <div className="text-sm text-white/80">
                  {match.location ?? "Cancha a definir"}
                </div>
              </div>
              <StatusPill status={match.status} />
            </div>
          </div>

          <div className="px-6 md:px-10 py-8">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <Side user={match.home} winner={match.winnerId === match.homeId} />
              <div className="text-xl font-mono text-white/40">vs</div>
              <Side user={match.away} winner={match.winnerId === match.awayId} alignRight />
            </div>

            {score && (
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {score.map((s, i) => {
                  const homeWon = s.home > s.away;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 px-5 py-4 text-center min-w-[96px]"
                    >
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                        Set {i + 1}
                      </div>
                      <div className="mt-1 text-xl font-mono">
                        <span className={homeWon ? "text-ball" : "text-white/70"}>{s.home}</span>
                        <span className="text-white/30 mx-2">–</span>
                        <span className={!homeWon ? "text-ball" : "text-white/70"}>{s.away}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </RevealOnScroll>

      {canScore && (
        <RevealOnScroll delay={0.1}>
          <ScoreEntry
            matchId={match.id}
            homeName={displayName(match.home)}
            awayName={displayName(match.away)}
          />
        </RevealOnScroll>
      )}

      {canCancel && (
        <RevealOnScroll delay={0.15}>
          <form action={doCancel} className="surface rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">¿Se canceló el partido?</div>
              <div className="text-xs text-white/50">
                Solo tú (quien lo agendó) puedes cancelarlo.
              </div>
            </div>
            <button className="btn-danger">Cancelar partido</button>
          </form>
        </RevealOnScroll>
      )}

      <div className="text-center text-xs text-white/35">
        Agendado por {displayName(match.scheduler)}
      </div>
    </div>
  );
}

function Side({
  user,
  winner,
  alignRight,
}: {
  user: { name: string | null; email: string | null };
  winner: boolean;
  alignRight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 ${alignRight ? "flex-row-reverse text-right" : ""}`}>
      <div
        className={`h-14 w-14 rounded-2xl grid place-items-center text-sm font-semibold flex-shrink-0 ${
          winner ? "bg-ball text-ink shadow-glow" : "bg-white/8 text-white/75 border border-white/10"
        }`}
      >
        {initials(user)}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
          {winner ? "🏆 Ganador" : "Jugador"}
        </div>
        <div className="text-lg font-medium truncate">{displayName(user)}</div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "SCHEDULED")
    return (
      <span className="pill bg-ball/10 border-ball/30 text-ball">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-ball animate-ping" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-ball" />
        </span>
        Agendado
      </span>
    );
  if (status === "COMPLETED") return <span className="pill">Completado</span>;
  return <span className="pill">Cancelado</span>;
}
