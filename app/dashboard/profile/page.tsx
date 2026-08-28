import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { ProfileEditForm } from "@/components/profile-edit/ProfileEditForm";
import { AwardsManager } from "@/components/profile-edit/AwardsManager";
import { GiTagManager } from "@/components/profile-edit/GiTagManager";
import { PublishToggle } from "@/components/profile-edit/PublishToggle";
import { Section } from "@/components/profile/Section";
import type { ProfileEditInput } from "@/lib/domain/craftsman";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ProfileEditPage() {
  const { profile, userId } = await getMyCraftsmanProfile();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  if (!userId) redirect("/login");
  if (!profile) redirect("/register");

  const initialValues: ProfileEditInput = {
    craftsmanName: profile.craftsmanName,
    yearsOfExperience: profile.yearsOfExperience,
    registrationNumber: profile.registrationNumber,
    registrationAuthority: profile.registrationAuthority,
    shopName: profile.shopName,
    businessAddress: profile.address,
    villageTown: profile.villageTown,
    district: profile.district,
    state: profile.state,
    pinCode: profile.pinCode,
    gstNumber: profile.gstNumber,
    gstPublic: profile.gstPublic,
    registrationPublic: profile.registrationPublic,
    shopContactNumber: profile.shopContactNumber,
    primaryCraftCategoryId: profile.primaryCraftCategoryId,
    secondaryCraftCategoryId: profile.secondaryCraftCategoryId,
    craftTradition: profile.craftTradition,
    description: profile.description,
    geographicRegion: profile.geographicRegion,
    photoUrl: profile.photoUrl,
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.profileEditPage.eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{dict.profileEditPage.heading}</h1>
        <p className="text-sm text-ink-500">
          <Link href={`/craftsman/${profile.slug}`} className="text-indigo-700 underline underline-offset-2">
            {dict.profileEditPage.viewPublicProfile}
          </Link>
        </p>
      </header>

      <PublishToggle status={profile.profileStatus} dict={dict} />

      <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 sm:p-8">
        <ProfileEditForm initialValues={initialValues} dict={dict} locale={locale} />
      </div>

      <Section title={dict.profileEditPage.awardsSection}>
        <AwardsManager awards={profile.awards} dict={dict} />
      </Section>

      <Section title={dict.profileEditPage.giTagsSection}>
        <GiTagManager giTags={profile.giTags} dict={dict} />
      </Section>
    </main>
  );
}
