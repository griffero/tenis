import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";
import { resend, magicLinkEmail, magicLinkText } from "@/lib/email";

const fromAddress = process.env.EMAIL_FROM ?? "Tenis <onboarding@resend.dev>";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  providers: [
    Resend({
      from: fromAddress,
      apiKey: process.env.RESEND_API_KEY,
      async sendVerificationRequest({ identifier: to, url, provider }) {
        const host = new URL(url).host;
        if (!resend) {
          console.log(`[dev] magic link for ${to}: ${url}`);
          return;
        }
        const result = await resend.emails.send({
          from: provider.from as string,
          to,
          subject: `Tu enlace para entrar al campeonato`,
          html: magicLinkEmail(url, host),
          text: magicLinkText(url, host),
        });
        if (result.error) {
          throw new Error(`Resend error: ${result.error.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
