"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { translatedCraftCategoryOptions } from "@/lib/domain/craft-categories";
import { submitCreateProduct, submitUpdateProduct } from "@/app/dashboard/products/actions";
import type { ProductFormValues } from "@/lib/validation/product";
import type { Dictionary } from "@/lib/i18n/config";

interface ProductFormProps {
  productId?: string;
  initialValues: ProductFormValues;
  imageUrlsText: string;
  dict: Dictionary;
}

export function ProductForm({ productId, initialValues, imageUrlsText, dict }: ProductFormProps) {
  const f = dict.fields;
  const pg = dict.productPage;
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [imagesText, setImagesText] = useState(imageUrlsText);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const AVAILABILITY_OPTIONS = [
    { value: "in_stock", label: f.availabilityInStock },
    { value: "made_to_order", label: f.availabilityMadeToOrder },
    { value: "out_of_stock", label: f.availabilityOutOfStock },
  ];

  const PRICE_TYPE_OPTIONS = [
    { value: "fixed", label: f.priceTypeFixed },
    { value: "on_request", label: f.priceTypeOnRequest },
  ];

  function set<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const imageUrls = imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const payload = { ...values, imageUrls };
      const result = productId
        ? await submitUpdateProduct(productId, payload)
        : await submitCreateProduct(payload);

      if (result.success) {
        router.push("/dashboard/products");
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field voice label={f.productName} required value={values.name} onChange={(e) => set("name", e.target.value)} />

      <SelectField
        voice
        label={f.category}
        placeholder={f.categoryPlaceholder}
        options={translatedCraftCategoryOptions(dict)}
        value={values.categoryId ?? ""}
        onChange={(e) => set("categoryId", e.target.value)}
      />

      <Field voice
        label={f.description}
        value={values.description ?? ""}
        onChange={(e) => set("description", e.target.value)}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field voice label={f.materials} value={values.materials ?? ""} onChange={(e) => set("materials", e.target.value)} />
        <Field voice label={f.technique} value={values.technique ?? ""} onChange={(e) => set("technique", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField
          voice
          label={f.priceType}
          options={PRICE_TYPE_OPTIONS}
          value={values.priceType}
          onChange={(e) => set("priceType", e.target.value as ProductFormValues["priceType"])}
        />
        {values.priceType === "fixed" && (
          <Field voice
            label={f.price}
            type="number"
            min={0}
            inputMode="decimal"
            value={values.price ?? ""}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField
          voice
          label={f.availability}
          options={AVAILABILITY_OPTIONS}
          value={values.availability}
          onChange={(e) => set("availability", e.target.value as ProductFormValues["availability"])}
        />
        <Field voice
          label={f.stockQuantity}
          type="number"
          min={0}
          inputMode="numeric"
          value={values.stockQuantity ?? ""}
          onChange={(e) => set("stockQuantity", Number(e.target.value))}
          hint={f.stockQuantityHint}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field voice
          label={f.minOrderQty}
          type="number"
          min={1}
          inputMode="numeric"
          value={values.minOrderQty ?? ""}
          onChange={(e) => set("minOrderQty", Number(e.target.value))}
        />
        <Field voice
          label={f.productionTime}
          value={values.productionTime ?? ""}
          onChange={(e) => set("productionTime", e.target.value)}
          hint={f.productionTimeHint}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field voice label={f.dimensions} value={values.dimensions ?? ""} onChange={(e) => set("dimensions", e.target.value)} />
        <Field voice label={f.weight} value={values.weight ?? ""} onChange={(e) => set("weight", e.target.value)} />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-ink-500/20 bg-khadi-50 px-4 py-3">
        <input
          type="checkbox"
          checked={values.customizable}
          onChange={(e) => set("customizable", e.target.checked)}
          className="h-5 w-5 accent-indigo-700"
        />
        <span className="text-sm text-ink-900">{f.customizable}</span>
        <SpeakerButton
          text={f.customizable}
          size={16}
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
        />
      </label>

      <Field voice label={f.videoUrl} value={values.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="images" className="text-sm font-medium text-ink-900">
          {f.imageUrls} <span className="ml-1.5 text-xs font-normal text-ink-500">{f.imageUrlsNote}</span>
        </label>
        <textarea
          id="images"
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={3}
          placeholder="https://example.com/photo1.jpg"
          className="w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-indigo-500"
        />
        <p className="text-sm text-ink-500">{f.imageUrlsHint}</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? pg.saving : productId ? pg.saveChanges : pg.addProduct}
      </Button>
    </form>
  );
}
