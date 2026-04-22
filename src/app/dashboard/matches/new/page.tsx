import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MATCHES_PER_MONTH, currentQuotaWindow } from "@/lib/utils";
import { NewMatchForm } from "./NewMatchForm";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata = { title: "Agendar partido · Tenis" };

export default async function NewMatchPage() {
  const session = await auth();
  const userId = session!.user.id;

  const quota = currentQuotaWindow();
  const [players, used] = await Promise.all([
    prisma.user.findMany({
      where: { NOT: { id: userId } },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.match.count({
      where: {
        schedulerId: userId,
        status: { in: ["SCHEDULED", "COMPLETED"] },
        scheduledAt: { gte: quota.start, lt: quota.end },
      },
    }),
  ]);

  const remaining = Math.max(0, MATCHES_PER_MONTH - used);
  const quotaLabel = new Intl.DateTimeFormat("es-CL", { month: "long" }).format(quota.start);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <RevealOnScroll>
        <div>
          <Link
            href="/dashboard/matches"
            className="text-sm text-white/50 hover:text-white/80 transition"
          >
            ← Partidos
          </Link>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Agendar partido
          </h1>
          <p className="mt-2 text-white/55 text-sm">
            {quota.preSeason ? (
              <>
                El torneo parte el <strong className="text-white">1 de mayo</strong>. Tienes{" "}
                <strong className="text-white">{remaining}</strong> de {MATCHES_PER_MONTH} partidos
                para {quotaLabel}.
              </>
            ) : (
              <>
                Te quedan <strong className="text-white">{remaining}</strong> de {MATCHES_PER_MONTH}{" "}
                partidos para {quotaLabel}.
              </>
            )}
          </p>
        </div>
      </RevealOnScroll>

      {remaining === 0 ? (
        <div className="surface rounded-3xl px-6 py-16 text-center">
          <div className="text-5xl mb-4">🎾</div>
          <h2 className="text-xl font-semibold">Agendaste tus 4 partidos del mes</h2>
          <p className="mt-2 text-white/55 text-sm">
            El cupo se renueva el día 1. Mientras tanto, ¡a jugar!
          </p>
          <Link href="/dashboard/matches" className="btn-ghost mt-6 inline-flex">
            Ver mis partidos
          </Link>
        </div>
      ) : (
        <RevealOnScroll delay={0.08}>
          <NewMatchForm players={players} />
        </RevealOnScroll>
      )}
    </div>
  );
}
