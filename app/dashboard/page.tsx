import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { getProfileCompletion } from "@/lib/domain/profile-completion";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { IconDashboard } from "@/components/dashboard/IconDashboard";
import { Button } from "@/components/ui/Button";
import { SpeakableText } from "@/components/ui/SpeakableText";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, format } from "@/lib/i18n/dictionaries";
import { getInterfaceMode } from "@/lib/interface-mode/get-interface-mode";
import { getActivePilotSession } from "@/lib/pilot/session-cookie";

export default async function DashboardPage() {
  const { profile, userId } = await getMyCraftsmanProfile();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const interfaceMode = await getInterfaceMode();
  const pilotSession = await getActivePilotSession();
  const pilotMode = Boolean(pilotSession);

  if (!userId) {
    redirect("/login");
  }

  if (!profile) {
    // Signed in but never finished registration (e.g. left partway through).
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-4 px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Let&apos;s finish setting up your profile
        </h1>
        <p className="text-ink-700">
          We couldn&apos;t find a craftsman profile linked to your account yet.
        </p>
        <Link href="/register">
          <Button>Complete registration</Button>
        </Link>
      </main>
    );
  }

  const verificationLabel: Record<string, string> = {
    unverified: dict.dashboardPage.verificationUnverified,
    submitted: dict.dashboardPage.verificationSubmitted,
    under_review: dict.dashboardPage.verificationUnderReview,
    verified: dict.dashboardPage.verificationVerified,
    rejected: dict.dashboardPage.verificationRejected,
    needs_more_info: dict.dashboardPage.verificationNeedsMoreInfo,
  };

  const completion = getProfileCompletion(profile, dict);
  const verificationText = format(dict.dashboardPage.verificationStatus, {
    status: verificationLabel[profile.verificationStatus],
  });

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[locale]} dict={dict}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">
        <header className="flex flex-col gap-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.dashboardPage.eyebrow}</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            {format(dict.dashboardPage.welcomeBack, { name: profile.craftsmanName })}
          </h1>
          {interfaceMode === "text" && (
            <>
              <SpeakableText text={verificationText} className="text-sm text-ink-500" />
              {profile.profileStatus !== "published" && (
                <SpeakableText
                  text={dict.dashboardPage.draftWarning}
                  className="rounded-lg bg-turmeric-100 px-3 py-2 text-sm text-turmeric-600"
                />
              )}
            </>
          )}
        </header>

        {interfaceMode === "icon" ? (
          <IconDashboard profileSlug={profile.slug} completionPercent={completion.percent} dict={dict} pilotMode={pilotMode} />
        ) : (
          <>
            {!pilotMode && (
              <ProfileCompletionCard completion={completion} title={dict.dashboardPage.profileCompletionTitle} />
            )}

            <div className="flex flex-col gap-3">
              <h2 className="font-display text-lg font-semibold text-ink-900">{dict.dashboardPage.quickActionsTitle}</h2>
              <QuickActions profileSlug={profile.slug} dict={dict} pilotMode={pilotMode} />
            </div>
          </>
        )}
      </main>
    </VoiceConfigProvider>
  );
}
