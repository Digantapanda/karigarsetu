"use client";

import { useState, useTransition } from "react";
import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { translatedCraftCategoryOptions } from "@/lib/domain/craft-categories";
import { submitProfileEdit } from "@/app/dashboard/profile/actions";
import type { ProfileEditInput } from "@/lib/domain/craftsman";
import type { Dictionary } from "@/lib/i18n/config";

export function ProfileEditForm({
  initialValues,
  dict,
}: {
  initialValues: ProfileEditInput;
  dict: Dictionary;
}) {
  const f = dict.fields;
  const p = dict.profileEditPage;
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof ProfileEditInput>(field: K, value: ProfileEditInput[K]) {
    setValues((v) => ({ ...v, [field]: value }));
    setStatus("idle");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitProfileEdit(values);
      if (result.success) {
        setStatus("saved");
      } else {
        setStatus("error");
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <Field voice
          label={f.craftsmanName}
          required
          value={values.craftsmanName}
          onChange={(e) => set("craftsmanName", e.target.value)}
        />
        <Field voice
          label={f.photoUrl}
          value={values.photoUrl ?? ""}
          onChange={(e) => set("photoUrl", e.target.value)}
          hint={f.photoUrlHint}
        />
        <SelectField
          voice
          label={f.primaryCraft}
          required
          placeholder={f.primaryCraftPlaceholder}
          options={translatedCraftCategoryOptions(dict)}
          value={values.primaryCraftCategoryId}
          onChange={(e) => set("primaryCraftCategoryId", e.target.value)}
        />
        <SelectField
          voice
          label={f.secondaryCraft}
          placeholder={f.secondaryCraftPlaceholder}
          options={translatedCraftCategoryOptions(dict)}
          value={values.secondaryCraftCategoryId ?? ""}
          onChange={(e) => set("secondaryCraftCategoryId", e.target.value)}
        />
        <Field voice
          label={f.craftTradition}
          value={values.craftTradition ?? ""}
          onChange={(e) => set("craftTradition", e.target.value)}
        />
        <Field voice
          label={f.craftDescription}
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
        <Field voice
          label={f.geographicRegion}
          value={values.geographicRegion ?? ""}
          onChange={(e) => set("geographicRegion", e.target.value)}
        />
        <Field voice
          label={f.yearsOfExperience}
          type="number"
          min={0}
          max={80}
          inputMode="numeric"
          value={values.yearsOfExperience ?? ""}
          onChange={(e) => set("yearsOfExperience", Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-5 border-t border-ink-500/15 pt-6">
        <h3 className="font-display text-lg font-semibold text-ink-900">{p.businessSection}</h3>
        <Field voice label={f.shopName} value={values.shopName ?? ""} onChange={(e) => set("shopName", e.target.value)} />
        <Field voice
          label={f.businessAddress}
          value={values.businessAddress ?? ""}
          onChange={(e) => set("businessAddress", e.target.value)}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field voice
            label={f.villageTown}
            required
            value={values.villageTown}
            onChange={(e) => set("villageTown", e.target.value)}
          />
          <Field voice
            label={f.district}
            required
            value={values.district}
            onChange={(e) => set("district", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field voice label={f.state} required value={values.state} onChange={(e) => set("state", e.target.value)} />
          <Field voice
            label={f.pinCode}
            inputMode="numeric"
            value={values.pinCode ?? ""}
            onChange={(e) => set("pinCode", e.target.value)}
          />
        </div>
        <Field voice
          label={f.shopContactNumber}
          type="tel"
          inputMode="numeric"
          value={values.shopContactNumber ?? ""}
          onChange={(e) => set("shopContactNumber", e.target.value)}
          hint={f.shopContactNumberHint}
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-ink-500/15 pt-6">
        <h3 className="font-display text-lg font-semibold text-ink-900">{p.registrationGstSection}</h3>
        <Field voice
          label={f.registrationNumber}
          value={values.registrationNumber ?? ""}
          onChange={(e) => set("registrationNumber", e.target.value)}
        />
        <label className="flex items-center gap-3 rounded-lg border border-ink-500/20 bg-khadi-50 px-4 py-3">
          <input
            type="checkbox"
            checked={values.registrationPublic}
            onChange={(e) => set("registrationPublic", e.target.checked)}
            className="h-5 w-5 accent-indigo-700"
          />
          <span className="text-sm text-ink-900">{p.showRegistrationPublic}</span>
          <SpeakerButton
            text={p.showRegistrationPublic}
            size={16}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
          />
        </label>
        <Field voice
          label={f.gstNumber}
          value={values.gstNumber ?? ""}
          onChange={(e) => set("gstNumber", e.target.value.toUpperCase())}
        />
        <label className="flex items-center gap-3 rounded-lg border border-ink-500/20 bg-khadi-50 px-4 py-3">
          <input
            type="checkbox"
            checked={values.gstPublic}
            onChange={(e) => set("gstPublic", e.target.checked)}
            className="h-5 w-5 accent-indigo-700"
          />
          <span className="text-sm text-ink-900">{p.showGstPublic}</span>
          <SpeakerButton
            text={p.showGstPublic}
            size={16}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
          />
        </label>
      </div>

      {status === "error" && error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {status === "saved" && (
        <p role="status" className="rounded-lg bg-loom-100 px-4 py-3 text-sm text-loom-600">
          {p.savedMessage}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? p.saving : p.saveChanges}
      </Button>
    </form>
  );
}
