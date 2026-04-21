import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Ingresar · Tenis Championship" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  if (session) redirect(params.next || "/dashboard");

  async function action(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    if (!email) return;
    await signIn("resend", {
      email,
      redirectTo: params.next || "/dashboard",
    });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <LoginForm action={action} error={params.error} />
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm text-white/50 hover:text-white/80 transition"
      >
        ← Volver
      </Link>
    </div>
  );
}
