import { redirect, notFound } from "next/navigation";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { getMyProduct } from "@/lib/domain/products";
import { ProductForm } from "@/components/products/ProductForm";
import type { ProductFormValues } from "@/lib/validation/product";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageParams) {
  const { id } = await params;
  const { userId } = await getMyCraftsmanProfile();
  if (!userId) redirect("/login");

  const product = await getMyProduct(id);
  if (!product) notFound();

  const dict = getDictionary(await getLocale());

  const initialValues: ProductFormValues = {
    name: product.name,
    categoryId: product.categoryId ?? "",
    description: product.description ?? "",
    materials: product.materials ?? "",
    technique: product.technique ?? "",
    price: product.price,
    currency: product.currency,
    priceType: product.priceType,
    availability: product.availability,
    stockQuantity: product.stockQuantity,
    minOrderQty: product.minOrderQty,
    dimensions: product.dimensions ?? "",
    weight: product.weight ?? "",
    customizable: product.customizable,
    productionTime: product.productionTime ?? "",
    videoUrl: product.videoUrl ?? "",
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.productPage.newEyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{dict.productPage.editHeading}</h1>
      </header>

      <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 sm:p-8">
        <ProductForm
          productId={product.id}
          initialValues={initialValues}
          imageUrlsText={product.images.map((img) => img.imageUrl).join("\n")}
          dict={dict}
        />
      </div>
    </main>
  );
}
