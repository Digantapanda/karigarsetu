"use client";

import { useTransition } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitConnectMarketplace } from "@/app/dashboard/catalogue-sync/actions";
import { format } from "@/lib/i18n/dictionaries";
import type { MarketplaceConnectionSummary } from "@/lib/domain/marketplace";
import type { Dictionary } from "@/lib/i18n/config";

const STATUS_COLOR: Record<MarketplaceConnectionSummary["status"], string> = {
  not_connected: "bg-ink-500/10 text-ink-500",
  pending: "bg-turmeric-100 text-turmeric-600",
  connected: "bg-loom-100 text-loom-600",
  error: "bg-red-50 text-red-700",
};

export function ConnectionCard({
  connection,
  dict,
}: {
  connection: MarketplaceConnectionSummary;
  dict: Dictionary;
}) {
  const c = dict.catalogueSyncPage;
  const [isPending, startTransition] = useTransition();

  const statusLabel: Record<MarketplaceConnectionSummary["status"], string> = {
    not_connected: c.statusNotConnected,
    pending: c.statusPending,
    connected: c.statusConnected,
    error: c.statusError,
  };

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await submitConnectMarketplace(connection.platform, formData);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-500/15 bg-khadi-50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink-900">{connection.displayName}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[connection.status]}`}>
          {statusLabel[connection.status]}
        </span>
      </div>

      {connection.status === "connected" ? (
        <p className="text-sm text-ink-500">
          {c.sellerIdPrefix}: {connection.sellerId}
        </p>
      ) : (
        <form action={handleSubmit} className="flex flex-col gap-3">
          <Field
            label={c.sellerIdLabel}
            name="sellerId"
            required
            defaultValue={connection.sellerId}
            hint={format(c.sellerIdHint, { platform: connection.displayName })}
          />
          <Field label={c.noteLabel} name="note" hint={c.noteHint} />
          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? c.connecting : connection.status === "error" ? c.retryConnection : c.connect}
          </Button>
          {connection.lastError && (
            <p className="text-sm text-ink-500">{connection.lastError}</p>
          )}
        </form>
      )}
    </div>
  );
}
