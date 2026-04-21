import Link from "next/link";
import { VerifyAnimation } from "./VerifyAnimation";

export const metadata = { title: "Revisá tu mail · Tenis Championship" };

export default function VerifyPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <VerifyAnimation />
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm text-white/50 hover:text-white/80 transition z-20"
      >
        ← Inicio
      </Link>
    </div>
  );
}
