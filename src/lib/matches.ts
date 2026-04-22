"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { attributeMatchesToQuotaMonths, monthKeyUTC } from "@/lib/utils";

const createSchema = z.object({
  opponentId: z.string().min(1, "Elige un rival"),
  scheduledAt: z
    .string()
    .min(1, "Elige fecha y hora")
    .transform((v) => new Date(v))
    .refine((d) => !Number.isNaN(d.getTime()), "Fecha inválida")
    .refine((d) => d.getTime() > Date.now() - 1000 * 60 * 5, "La fecha debe ser futura"),
  location: z.string().max(120).optional().nullable(),
});

export type CreateResult =
  | { ok: true; matchId: string; attributedMonth: string }
  | { ok: false; error: string };

export async function createMatchAction(formData: FormData): Promise<CreateResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "No autenticado" };
  const userId = session.user.id;

  const parsed = createSchema.safeParse({
    opponentId: formData.get("opponentId"),
    scheduledAt: formData.get("scheduledAt"),
    location: formData.get("location"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const { opponentId, scheduledAt, location } = parsed.data;
  if (opponentId === userId) return { ok: false, error: "No puedes jugar contra ti mismo" };

  const opponent = await prisma.user.findUnique({ where: { id: opponentId } });
  if (!opponent) return { ok: false, error: "Rival no encontrado" };

  const match = await prisma.match.create({
    data: {
      schedulerId: userId,
      homeId: userId,
      awayId: opponentId,
      scheduledAt,
      location: location ?? null,
    },
  });

  // Monthly quota now spills forward — a match scheduled into a full month
  // lands on the next month with capacity. Attribution is recomputed from
  // scratch against the user's full non-cancelled set, so cancellations
  // naturally compact the later entries back.
  const userMatches = await prisma.match.findMany({
    where: { schedulerId: userId, status: { in: ["SCHEDULED", "COMPLETED"] } },
    select: { id: true, scheduledAt: true, createdAt: true },
  });
  const { perMatch } = attributeMatchesToQuotaMonths(userMatches);
  const attributed = perMatch.get(match.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/matches");
  return {
    ok: true,
    matchId: match.id,
    attributedMonth: attributed ? monthKeyUTC(attributed) : "",
  };
}

// One set to 9 games (escalerilla / ladder format). Tiebreak at 8-8 is
// counted as 9-8, so loser games can go up to 8. Winner must reach 9.
const GAMES_TO_WIN = 9;

const scoreSchema = z.object({
  matchId: z.string(),
  sets: z
    .array(
      z.object({
        home: z.number().int().min(0).max(GAMES_TO_WIN),
        away: z.number().int().min(0).max(GAMES_TO_WIN),
      }),
    )
    .length(1),
});

export async function reportResultAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "No autenticado" };
  const userId = session.user.id;

  const raw = {
    matchId: String(formData.get("matchId") ?? ""),
    sets: JSON.parse(String(formData.get("sets") ?? "[]")),
  };
  const parsed = scoreSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Resultado inválido" };

  const { matchId, sets } = parsed.data;
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return { ok: false as const, error: "Partido no existe" };
  if (match.homeId !== userId && match.awayId !== userId) {
    return { ok: false as const, error: "No eres parte de este partido" };
  }

  const [set] = sets;
  if (set.home === set.away) {
    return { ok: false as const, error: "No puede quedar empatado" };
  }
  const winnerGames = Math.max(set.home, set.away);
  const loserGames = Math.min(set.home, set.away);
  if (winnerGames !== GAMES_TO_WIN) {
    return { ok: false as const, error: "El ganador tiene que llegar a 9 games" };
  }
  if (loserGames > GAMES_TO_WIN - 1) {
    return { ok: false as const, error: "El perdedor no puede pasar de 8 games" };
  }
  const winnerId = set.home > set.away ? match.homeId : match.awayId;

  await prisma.match.update({
    where: { id: matchId },
    data: {
      status: "COMPLETED",
      winnerId,
      scoreJson: JSON.stringify(sets),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/matches");
  revalidatePath(`/dashboard/matches/${matchId}`);
  revalidatePath("/dashboard/leaderboard");
  return { ok: true as const };
}

export async function cancelMatchAction(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = session.user.id;

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return;
  if (match.schedulerId !== userId) return;
  if (match.status !== "SCHEDULED") return;

  await prisma.match.update({
    where: { id: matchId },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/matches");
  redirect("/dashboard/matches");
}
