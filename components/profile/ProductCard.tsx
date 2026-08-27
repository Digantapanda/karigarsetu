import type { Product } from "@/types/domain";
import type { Dictionary } from "@/lib/i18n/config";

export function ProductCard({ product, dict }: { product: Product; dict: Dictionary }) {
  const image = product.images[0];
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ink-500/15 bg-khadi-50">
      <div className="aspect-square bg-khadi-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-500">
            {dict.profilePage.noPhoto}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="truncate font-medium text-ink-900">{product.name}</p>
        {product.description && (
          <p className="line-clamp-2 text-sm text-ink-500">{product.description}</p>
        )}
        <p className="text-sm font-medium text-indigo-700">
          {product.priceType === "fixed" && product.price
            ? `₹${product.price.toLocaleString("en-IN")}`
            : dict.profilePage.priceOnRequest}
        </p>
        {product.availability === "out_of_stock" && (
          <span className="w-fit rounded-full bg-turmeric-100 px-2 py-0.5 text-xs font-semibold text-turmeric-600">
            {dict.profilePage.outOfStockBadge}
          </span>
        )}
      </div>
    </div>
  );
}
