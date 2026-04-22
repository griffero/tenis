import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MatchCard } from "@/components/MatchCard";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: "all" | "mine" | "upcoming" }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const params = await searchParams;
  const filter = params.filter ?? "upcoming";

  const now = new Date();
  const where =
    filter === "all"
      ? {}
      : filter === "mine"
        ? { OR: [{ homeId: userId }, { awayId: userId }] }
        : {
            status: "SCHEDULED" as const,
            scheduledAt: { gte: now },
          };

  const matches = await prisma.match.findMany({
    where,
    orderBy: { scheduledAt: filter === "all" ? "desc" : "asc" },
    include: { home: true, away: true, scheduler: true, winner: true },
    take: 60,
  });

  const tabs: Array<{ key: "upcoming" | "mine" | "all"; label: string }> = [
    { key: "upcoming", label: "Próximos" },
    { key: "mine", label: "Mis partidos" },
    { key: "all", label: "Todos" },
  ];

  return (
    <div className="space-y-6">
      <RevealOnScroll>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Partidos</h1>
            <p className="mt-1.5 text-white/55 text-sm">
              Agenda, confirma y carga resultados.
            </p>
          </div>
          <Link href="/dashboard/matches/new" className="btn-primary">
            + Agendar partido
          </Link>
        </div>
      </RevealOnScroll>

      <div className="flex gap-1 bg-white/5 rounded-full p-1 border border-white/5 w-fit">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/matches?filter=${t.key}`}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              t.key === filter ? "bg-ball text-ink shadow-glow" : "text-white/70 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {matches.length === 0 ? (
        <div className="surface rounded-2xl px-6 py-16 text-center text-white/50">
          No hay partidos en esta vista.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((m, i) => (
            <MatchCard key={m.id} match={m} meId={userId} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
