import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { TennisBall } from "@/components/TennisBall";
import { NavLinks } from "@/components/NavLinks";
import { displayName, initials } from "@/lib/utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = session.user;

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <TennisBall size={28} spin />
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              Tenis <span className="text-ball">Championship</span>
            </span>
          </Link>
          <NavLinks />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pr-1">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ball/30 to-ball/10 grid place-items-center text-xs font-semibold text-ball">
                {initials(user)}
              </div>
              <span className="text-sm text-white/70 max-w-[120px] truncate">
                {displayName(user)}
              </span>
            </div>
            <form action={logout}>
              <button className="btn-ghost text-xs">Salir</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 md:py-12">{children}</main>
    </div>
  );
}
