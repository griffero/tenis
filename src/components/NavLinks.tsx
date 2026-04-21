"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/matches", label: "Partidos" },
  { href: "/dashboard/leaderboard", label: "Ranking" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
      {links.map((l) => {
        const active =
          l.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "relative px-4 py-1.5 text-sm rounded-full transition-colors",
              active ? "text-ink" : "text-white/70 hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 bg-ball rounded-full shadow-glow"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
