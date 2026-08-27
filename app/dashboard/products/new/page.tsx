import { redirect } from "next/navigation";
import { getMyCraftsmanProfile } from "@/lib/domain/craftsman";
import { ProductForm } from "@/components/products/ProductForm";
import type { ProductFormValues } from "@/lib/validation/product";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const emptyValues: ProductFormValues = {
  name: "",
  categoryId: "",
  description: "",
  materials: "",
  technique: "",
  currency: "INR",
  priceType: "fixed",
  availability: "in_stock",
  dimensions: "",
  weight: "",
  customizable: false,
  productionTime: "",
  videoUrl: "",
};

export default async function NewProductPage() {
  const { userId } = await getMyCraftsmanProfile();
  if (!userId) redirect("/login");

  const dict = getDictionary(await getLocale());

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.productPage.newEyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{dict.productPage.newHeading}</h1>
      </header>

      <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 sm:p-8">
        <ProductForm initialValues={emptyValues} imageUrlsText="" dict={dict} />
      </div>
    </main>
  );
}
