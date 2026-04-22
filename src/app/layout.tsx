import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tenis Championship — 4 partidos al mes",
  description:
    "Agenda tus partidos, sigue el ranking y vive el torneo. Cada jugador programa 4 partidos por mes.",
  openGraph: {
    title: "Tenis Championship",
    description: "4 partidos al mes. Un solo ranking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
