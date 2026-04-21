import { auth } from "@/lib/auth";
import { Landing } from "@/components/Landing";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await auth();
  const [players, matches, completed] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.match.count().catch(() => 0),
    prisma.match.count({ where: { status: "COMPLETED" } }).catch(() => 0),
  ]);

  return (
    <Landing
      isAuthed={!!session}
      stats={{ players, matches, completed }}
    />
  );
}
