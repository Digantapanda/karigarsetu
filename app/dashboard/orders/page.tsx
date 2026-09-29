import { redirect } from "next/navigation";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { getOrSeedMockOrders } from "@/lib/domain/pilot";
import { getActivePilotSession } from "@/lib/pilot/session-cookie";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { MockOrdersList } from "@/components/pilot/MockOrdersList";

/**
 * This is NOT a real Orders feature -- it only ever renders anything
 * during an active pilot session (Task 4), seeded with 2 fake orders
 * scoped to that session. Outside a pilot session it shows the same
 * "coming soon" message the dashboard's disabled tile already implies,
 * so it can never be mistaken for a real, shipped feature.
 */
export default async function OrdersPage() {
  const { userId } = await getMyCraftsmanProfile();
  if (!userId) redirect("/login");

  const pilotSession = await getActivePilotSession();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  if (!pilotSession) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-4 px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">{dict.dashboardPage.viewOrders}</h1>
        <p className="text-ink-700">{dict.dashboardPage.comingSoon}</p>
      </main>
    );
  }

  const orders = await getOrSeedMockOrders(pilotSession.sessionId);
  const pilotDict = getPilotDictionary(pilotSession.locale);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[pilotSession.locale]} dict={dict}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.dashboardPage.eyebrow}</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{dict.dashboardPage.viewOrders}</h1>
        </header>
        <MockOrdersList orders={orders} pilotDict={pilotDict} />
      </main>
    </VoiceConfigProvider>
  );
}
