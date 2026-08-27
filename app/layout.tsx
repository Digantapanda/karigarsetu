import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// Fraunces: a display serif with real character for headings and craftsman names.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// IBM Plex Sans: chosen deliberately (not just Inter) because the Plex family
// also ships Devanagari and Bengali variants -- the same typographic voice
// can extend into the platform's Hindi/Bengali UI later without a font swap.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KarigarSetu -- Register as a Craftsman",
  description:
    "Create your verified digital craftsman profile and share it directly with customers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-khadi-200 text-ink-900">{children}</body>
    </html>
  );
}
