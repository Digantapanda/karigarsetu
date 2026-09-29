import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { PilotTaskBanner } from "@/components/pilot/PilotTaskBanner";
import { PilotPointerTracker } from "@/components/pilot/PilotPointerTracker";
import { getActivePilotSession } from "@/lib/pilot/session-cookie";
import { getPilotDictionary } from "@/lib/pilot/dictionary";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pilotSession = await getActivePilotSession();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-khadi-200 text-ink-900">
        {pilotSession && (
          <>
            <PilotTaskBanner
              taskPosition={pilotSession.taskPosition}
              pilotDict={getPilotDictionary(pilotSession.locale)}
            />
            <PilotPointerTracker />
          </>
        )}
        {children}
      </body>
    </html>
  );
}
