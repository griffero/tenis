import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { displayName, initials } from "@/lib/utils";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { LeaderRow } from "./LeaderRow";

export const metadata = { title: "Ranking · Tenis" };

export default async function LeaderboardPage() {
  const session = await auth();
  const meId = session!.user.id;

  const [users, completedMatches] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true, email: true, image: true } }),
    prisma.match.findMany({
      where: { status: "COMPLETED" },
      select: {
        homeId: true,
        awayId: true,
        winnerId: true,
        scoreJson: true,
      },
    }),
  ]);

  const stats = new Map<
    string,
    { wins: number; losses: number; setsWon: number; setsLost: number }
  >();
  for (const u of users) stats.set(u.id, { wins: 0, losses: 0, setsWon: 0, setsLost: 0 });

  for (const m of completedMatches) {
    if (!m.winnerId) continue;
    const loserId = m.winnerId === m.homeId ? m.awayId : m.homeId;
    const w = stats.get(m.winnerId);
    const l = stats.get(loserId);
    if (w) w.wins += 1;
    if (l) l.losses += 1;

    if (m.scoreJson) {
      try {
        const sets = JSON.parse(m.scoreJson) as Array<{ home: number; away: number }>;
        let hw = 0,
          aw = 0;
        for (const s of sets) {
          hw += s.home;
          aw += s.away;
        }
        const home = stats.get(m.homeId);
        const away = stats.get(m.awayId);
        if (home) {
          home.setsWon += hw;
          home.setsLost += aw;
        }
        if (away) {
          away.setsWon += aw;
          away.setsLost += hw;
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  const ranked = users
    .map((u) => {
      const s = stats.get(u.id) ?? { wins: 0, losses: 0, setsWon: 0, setsLost: 0 };
      return {
        ...u,
        ...s,
        points: s.wins * 3,
        played: s.wins + s.losses,
        winRate: s.wins + s.losses === 0 ? 0 : s.wins / (s.wins + s.losses),
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const da = a.setsWon - a.setsLost;
      const db = b.setsWon - b.setsLost;
      return db - da;
    });

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Ranking</h1>
          <p className="mt-2 text-white/55 text-sm">
            3 puntos por partido ganado. Desempate por diferencia de sets.
          </p>
        </div>
      </RevealOnScroll>

      <div className="surface rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_60px_60px_72px] md:grid-cols-[50px_1fr_80px_80px_80px_96px] gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-white/45 border-b border-white/5">
          <div>#</div>
          <div>Jugador</div>
          <div className="text-center hidden md:block">PJ</div>
          <div className="text-center">G</div>
          <div className="text-center">P</div>
          <div className="text-right">Pts</div>
        </div>
        {ranked.length === 0 ? (
          <div className="px-6 py-16 text-center text-white/50 text-sm">
            Todavía no hay partidos completados.
          </div>
        ) : (
          <div>
            {ranked.map((r, i) => (
              <LeaderRow
                key={r.id}
                position={i + 1}
                me={r.id === meId}
                name={displayName(r)}
                initials={initials(r)}
                played={r.played}
                wins={r.wins}
                losses={r.losses}
                points={r.points}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
