import { redirect } from "next/navigation";
import Link from "next/link";
import { listMyProducts } from "@/lib/domain/products";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { ProductRow } from "@/components/products/ProductRow";
import { Button } from "@/components/ui/Button";
import { SpeakableText } from "@/components/ui/SpeakableText";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ProductsPage() {
  const { userId } = await getMyCraftsmanProfile();
  if (!userId) redirect("/login");

  const products = await listMyProducts();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[locale]} dict={dict}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.productsPage.eyebrow}</p>
            <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{dict.productsPage.heading}</h1>
          </div>
          <Link href="/dashboard/products/new">
            <Button>{dict.productsPage.addProduct}</Button>
          </Link>
        </header>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-ink-500/15 bg-khadi-50 p-10 text-center">
            <SpeakableText text={dict.productsPage.emptyTitle} className="font-medium text-ink-900" />
            <p className="mt-1 text-sm text-ink-500">{dict.productsPage.emptyHint}</p>
            <Link href="/dashboard/products/new" className="mt-4 inline-block">
              <Button>{dict.productsPage.addFirst}</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} dict={dict} />
            ))}
          </div>
        )}
      </main>
    </VoiceConfigProvider>
  );
}
