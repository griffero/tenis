import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MATCHES_PER_MONTH,
  attributeMatchesToQuotaMonths,
  currentQuotaMonth,
  isPreSeason,
  monthKeyUTC,
} from "@/lib/utils";
import { NewMatchForm } from "./NewMatchForm";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata = { title: "Agendar partido · Tenis" };

export default async function NewMatchPage() {
  const session = await auth();
  const userId = session!.user.id;

  const now = new Date();
  const currentMonth = currentQuotaMonth(now);
  const preSeason = isPreSeason(now);

  const [players, userScheduled] = await Promise.all([
    prisma.user.findMany({
      where: { NOT: { id: userId } },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.match.findMany({
      where: { schedulerId: userId, status: { in: ["SCHEDULED", "COMPLETED"] } },
      select: { id: true, scheduledAt: true, createdAt: true },
    }),
  ]);

  const { perMonth } = attributeMatchesToQuotaMonths(userScheduled);
  const used = perMonth.get(monthKeyUTC(currentMonth)) ?? 0;
  const remaining = Math.max(0, MATCHES_PER_MONTH - used);
  const quotaLabel = new Intl.DateTimeFormat("es-CL", { month: "long" }).format(currentMonth);

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
            {preSeason ? (
              <>
                El torneo parte el <strong className="text-white">1 de mayo</strong>. Tienes{" "}
                <strong className="text-white">{remaining}</strong> de {MATCHES_PER_MONTH} partidos
                para {quotaLabel} — lo que agendes para abril también cuenta acá.
              </>
            ) : remaining > 0 ? (
              <>
                Te quedan <strong className="text-white">{remaining}</strong> de {MATCHES_PER_MONTH}{" "}
                partidos para {quotaLabel}. Si llenas el mes, los extra caen al siguiente.
              </>
            ) : (
              <>
                Ya llenaste tu cupo de {quotaLabel}. Los próximos partidos que agendes caen
                automáticamente al mes siguiente con cupo libre.
              </>
            )}
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.08}>
        <NewMatchForm players={players} />
      </RevealOnScroll>
    </div>
  );
}
