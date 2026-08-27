"use client";

import { useState, useTransition } from "react";
import { submitPushListing, submitStockUpdate } from "@/app/dashboard/catalogue-sync/actions";
import type { ProductSyncRow as ProductSyncRowData } from "@/lib/domain/marketplace";
import type { MarketplacePlatform } from "@/lib/marketplace/types";
import type { Dictionary } from "@/lib/i18n/config";

const PLATFORMS: { key: MarketplacePlatform; label: string }[] = [
  { key: "amazon", label: "Amazon" },
  { key: "flipkart", label: "Flipkart" },
];

const STATUS_COLOR: Record<string, string> = {
  not_listed: "bg-ink-500/10 text-ink-500",
  pending: "bg-turmeric-100 text-turmeric-600",
  listed: "bg-loom-100 text-loom-600",
  error: "bg-red-50 text-red-700",
};

export function ProductSyncRow({ row, dict }: { row: ProductSyncRowData; dict: Dictionary }) {
  const c = dict.catalogueSyncPage;
  const [stock, setStock] = useState(row.product.stockQuantity ?? 0);
  const [isPending, startTransition] = useTransition();

  const statusLabel: Record<string, string> = {
    not_listed: c.listedStatusNotListed,
    pending: c.listedStatusPending,
    listed: c.listedStatusListed,
    error: c.listedStatusError,
  };

  function handlePush(platform: MarketplacePlatform) {
    startTransition(async () => {
      await submitPushListing(row.product.id, platform);
    });
  }

  function handleStockSave() {
    startTransition(async () => {
      await submitStockUpdate(row.product.id, stock);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-500/15 bg-khadi-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-900">{row.product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <label htmlFor={`stock-${row.product.id}`} className="text-xs text-ink-500">
            {c.stockLabel}:
          </label>
          <input
            id={`stock-${row.product.id}`}
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="h-8 w-20 rounded-md border border-ink-500/25 bg-white px-2 text-sm"
          />
          <button
            type="button"
            onClick={handleStockSave}
            disabled={isPending}
            className="text-xs font-medium text-indigo-700 hover:underline"
          >
            {c.saveAndSync}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(({ key, label }) => {
          const listing = row.listings[key];
          const status = listing?.status ?? "not_listed";
          return (
            <div key={key} className="flex items-center gap-2 rounded-lg border border-ink-500/15 px-3 py-1.5">
              <span className="text-xs font-medium text-ink-700">{label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[status]}`}>
                {statusLabel[status]}
              </span>
              <button
                type="button"
                onClick={() => handlePush(key)}
                disabled={isPending}
                className="text-xs font-medium text-indigo-700 hover:underline"
              >
                {status === "not_listed" ? c.listAction : c.resyncAction}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
