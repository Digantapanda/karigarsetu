"use client";

import { useTransition } from "react";
import Link from "next/link";
import { submitSetProductStatus, submitDeleteProduct } from "@/app/dashboard/products/actions";
import type { Product } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

const STATUS_COLOR: Record<Product["status"], string> = {
  draft: "bg-ink-500/10 text-ink-700",
  published: "bg-loom-100 text-loom-600",
  out_of_stock: "bg-turmeric-100 text-turmeric-600",
  archived: "bg-ink-500/10 text-ink-500",
};

export function ProductRow({ product, dict }: { product: Product; dict: Dictionary }) {
  const [isPending, startTransition] = useTransition();

  const statusLabel: Record<Product["status"], string> = {
    draft: dict.productsPage.statusDraft,
    published: dict.productsPage.statusPublished,
    out_of_stock: dict.productsPage.statusOutOfStock,
    archived: dict.productsPage.statusArchived,
  };

  function togglePublish() {
    const next = product.status === "published" ? "draft" : "published";
    startTransition(async () => {
      await submitSetProductStatus(product.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`Remove "${product.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      await submitDeleteProduct(product.id);
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-ink-500/15 bg-khadi-50 p-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-khadi-100">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0].imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-500">{dict.profilePage.noPhoto}</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-900">{product.name}</p>
        <p className="text-sm text-ink-500">
          {product.priceType === "fixed" && product.price
            ? `₹${product.price.toLocaleString("en-IN")}`
            : dict.profilePage.priceOnRequest}
          {product.stockQuantity !== undefined ? ` · ${dict.productsPage.stockLabel}: ${product.stockQuantity}` : ""}
        </p>
      </div>

      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[product.status]}`}>
        {statusLabel[product.status]}
      </span>

      <div className="flex shrink-0 items-center gap-2">
        <Link href={`/dashboard/products/${product.id}/edit`} className="text-sm font-medium text-indigo-700 hover:underline">
          {dict.common.edit}
        </Link>
        <button
          type="button"
          onClick={togglePublish}
          disabled={isPending}
          className="text-sm font-medium text-ink-700 hover:underline"
        >
          {product.status === "published" ? dict.productsPage.unpublish : dict.productsPage.publish}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="text-sm font-medium text-red-700 hover:underline"
        >
          {dict.common.delete}
        </button>
      </div>
    </div>
  );
}
