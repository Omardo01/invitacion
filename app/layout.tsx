import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Italianno,
  Cinzel,
  Special_Elite,
  Inter,
  DM_Serif_Display,
  Marcellus,
  Great_Vibes,
  Bodoni_Moda,
  Syne,
  Fraunces,
  Unbounded,
  Bricolage_Grotesque,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const italianno = Italianno({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-deco", display: "swap" });
const specialElite = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-typewriter", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", display: "swap" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });

const fontVars = [
  playfair.variable,
  cormorant.variable,
  italianno.variable,
  cinzel.variable,
  specialElite.variable,
  inter.variable,
  dmSerif.variable,
  marcellus.variable,
  greatVibes.variable,
  bodoni.variable,
  syne.variable,
  fraunces.variable,
  unbounded.variable,
  bricolage.variable,
].join(" ");

// URL base para que las previews (WhatsApp, redes) reciban la imagen en absoluto.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Gabriel & Zayra · Nuestra boda",
  description:
    "¡Nos casamos! Acompáñanos a celebrar nuestra boda el 25 de julio de 2026 en Villahermosa, Tabasco.",
  openGraph: {
    title: "Gabriel & Zayra · Nuestra boda",
    description:
      "¡Nos casamos! Te esperamos el 25 de julio de 2026 en Villahermosa, Tabasco.",
    type: "website",
    locale: "es_MX",
    siteName: "Gabriel & Zayra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel & Zayra · Nuestra boda",
    description: "¡Nos casamos! 25 de julio de 2026 · Villahermosa, Tabasco.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
