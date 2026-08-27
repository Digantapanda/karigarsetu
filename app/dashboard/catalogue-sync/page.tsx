import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import {
  listMarketplaceConnections,
  listProductsWithSyncStatus,
  listRecentSyncEvents,
} from "@/lib/domain/marketplace";
import { ConnectionCard } from "@/components/catalogue-sync/ConnectionCard";
import { ProductSyncRow } from "@/components/catalogue-sync/ProductSyncRow";
import { SyncActivityLog } from "@/components/catalogue-sync/SyncActivityLog";
import { Button } from "@/components/ui/Button";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function CatalogueSyncPage() {
  const { userId } = await getMyCraftsmanProfile();
  if (!userId) redirect("/login");

  const dict = getDictionary(await getLocale());

  const [connections, productRows, events] = await Promise.all([
    listMarketplaceConnections(),
    listProductsWithSyncStatus(),
    listRecentSyncEvents(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 sm:py-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.catalogueSyncPage.eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{dict.catalogueSyncPage.heading}</h1>
        <p className="mt-1 text-sm text-ink-500">{dict.catalogueSyncPage.subheading}</p>
        <p className="mt-2 rounded-lg bg-turmeric-100 px-3 py-2 text-sm text-turmeric-600">
          {dict.catalogueSyncPage.notice}
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">{dict.catalogueSyncPage.marketplaces}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {connections.map((connection) => (
            <ConnectionCard key={connection.platform} connection={connection} dict={dict} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">{dict.catalogueSyncPage.yourProducts}</h2>
        {productRows.length === 0 ? (
          <div className="rounded-2xl border border-ink-500/15 bg-khadi-50 p-8 text-center">
            <p className="text-ink-700">{dict.catalogueSyncPage.needsProduct}</p>
            <Link href="/dashboard/products/new" className="mt-3 inline-block">
              <Button variant="secondary">{dict.catalogueSyncPage.addProduct}</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {productRows.map((row) => (
              <ProductSyncRow key={row.product.id} row={row} dict={dict} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">{dict.catalogueSyncPage.syncActivity}</h2>
        <SyncActivityLog events={events} dict={dict} />
      </section>
    </main>
  );
}
