import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { getProfileCompletion } from "@/lib/domain/profile-completion";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/Button";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, format } from "@/lib/i18n/dictionaries";

export default async function DashboardPage() {
  const { profile, userId } = await getMyCraftsmanProfile();
  const dict = getDictionary(await getLocale());

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

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.dashboardPage.eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          {format(dict.dashboardPage.welcomeBack, { name: profile.craftsmanName })}
        </h1>
        <p className="text-sm text-ink-500">
          {format(dict.dashboardPage.verificationStatus, {
            status: verificationLabel[profile.verificationStatus],
          })}
        </p>
        {profile.profileStatus !== "published" && (
          <p className="mt-1 rounded-lg bg-turmeric-100 px-3 py-2 text-sm text-turmeric-600">
            {dict.dashboardPage.draftWarning}
          </p>
        )}
      </header>

      <ProfileCompletionCard completion={completion} title={dict.dashboardPage.profileCompletionTitle} />

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-ink-900">{dict.dashboardPage.quickActionsTitle}</h2>
        <QuickActions profileSlug={profile.slug} dict={dict} />
      </div>
    </main>
  );
}
