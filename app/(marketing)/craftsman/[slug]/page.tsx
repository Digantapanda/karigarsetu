import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedCraftsmanProfileBySlug } from "@/lib/domain/craftsman";
import { listPublishedProducts } from "@/lib/domain/products";
import { ProductCard } from "@/components/profile/ProductCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Section } from "@/components/profile/Section";
import { AwardsList } from "@/components/profile/AwardsList";
import { ContactActions } from "@/components/profile/ContactActions";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { translatedCraftCategoryName } from "@/lib/domain/craft-categories";

interface PageParams {
  params: Promise<{ slug: string }>;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublishedCraftsmanProfileBySlug(slug);

  if (!profile) {
    return { title: "Craftsman not found -- KarigarSetu" };
  }

  const craftName = profile.primaryCraftCategory?.name ?? "craft";
  const title = `${profile.craftsmanName} -- ${craftName} Craftsman from ${profile.state}`;
  const description = `Discover the traditional ${craftName.toLowerCase()} craftsmanship of ${profile.craftsmanName} and explore handmade products, on KarigarSetu.`;
  const url = `${siteUrl()}/craftsman/${profile.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      images: profile.photoUrl ? [{ url: profile.photoUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.photoUrl ? [profile.photoUrl] : undefined,
    },
  };
}

export default async function CraftsmanProfilePage({ params }: PageParams) {
  const { slug } = await params;
  const profile = await getPublishedCraftsmanProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const profileUrl = `${siteUrl()}/craftsman/${profile.slug}`;
  const products = await listPublishedProducts(profile.id);
  const dict = getDictionary(await getLocale());

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:py-14">
      <ProfileHeader profile={profile} dict={dict} />

      <ContactActions
        craftsmanName={profile.craftsmanName}
        profileUrl={profileUrl}
        shopContactNumber={profile.shopContactNumber}
        dict={dict}
      />

      {profile.description && (
        <Section title={dict.profilePage.about}>
          <p className="whitespace-pre-line text-ink-700">{profile.description}</p>
          {profile.craftTradition && (
            <p className="text-sm text-ink-500">Tradition: {profile.craftTradition}</p>
          )}
        </Section>
      )}

      <Section title={dict.profilePage.craft}>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row label={dict.fields.primaryCraft} value={translatedCraftCategoryName(profile.primaryCraftCategoryId, dict)} />
          <Row label={dict.fields.secondaryCraft} value={translatedCraftCategoryName(profile.secondaryCraftCategoryId, dict)} />
          <Row label={dict.profilePage.region} value={profile.geographicRegion} />
          <Row
            label={dict.profilePage.experience}
            value={profile.yearsOfExperience ? `${profile.yearsOfExperience} ${dict.profilePage.yearsSuffix}` : undefined}
          />
        </dl>
      </Section>

      <Section title={dict.profilePage.business}>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row label={dict.fields.shopName} value={profile.shopName} />
          <Row label={dict.profilePage.location} value={[profile.villageTown, profile.district, profile.state].filter(Boolean).join(", ")} />
          {profile.registrationPublic && <Row label={dict.fields.registrationNumber} value={profile.registrationNumber} />}
          {profile.gstPublic && <Row label={dict.fields.gstNumber} value={profile.gstNumber} />}
        </dl>
      </Section>

      {(profile.awards.length > 0 || profile.giTags.length > 0) && (
        <Section title={dict.profilePage.awards}>
          <AwardsList awards={profile.awards} />
        </Section>
      )}

      <Section title={dict.profilePage.products}>
        {products.length === 0 ? (
          <p className="rounded-lg bg-khadi-50 p-4 text-sm text-ink-500">{dict.profilePage.noProductsYet}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}
