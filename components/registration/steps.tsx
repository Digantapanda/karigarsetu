"use client";

import { Field } from "@/components/ui/Field";
import { SelectField } from "@/components/ui/SelectField";
import { translatedCraftCategoryOptions } from "@/lib/domain/craft-categories";
import type { Dictionary } from "@/lib/i18n/config";
import type {
  BasicAccountInput,
  BusinessInfoInput,
  CraftInfoInput,
  CraftsmanInfoInput,
  RecognitionInput,
} from "@/types/domain";

type Errors<T> = Partial<Record<keyof T, string>>;

interface StepProps<T> {
  values: T;
  errors: Errors<T>;
  onChange: (field: keyof T, value: string | number | boolean) => void;
  dict: Dictionary;
}

export function BasicAccountStep({ values, errors, onChange, dict }: StepProps<BasicAccountInput>) {
  const f = dict.fields;
  return (
    <div className="flex flex-col gap-5">
      <Field
        label={f.fullName}
        required
        value={values.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        error={errors.fullName}
        autoComplete="name"
      />
      <Field
        label={f.email}
        required
        type="email"
        value={values.email}
        onChange={(e) => onChange("email", e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Field
        label={f.mobileNumber}
        required
        type="tel"
        inputMode="numeric"
        value={values.mobileNumber}
        onChange={(e) => onChange("mobileNumber", e.target.value)}
        error={errors.mobileNumber}
        hint={f.mobileNumberHint}
        autoComplete="tel"
      />
      <Field
        label={f.password}
        required
        type="password"
        value={values.password}
        onChange={(e) => onChange("password", e.target.value)}
        error={errors.password}
        hint={f.passwordHint}
        autoComplete="new-password"
      />
    </div>
  );
}

export function CraftsmanInfoStep({ values, errors, onChange, dict }: StepProps<CraftsmanInfoInput>) {
  const f = dict.fields;
  return (
    <div className="flex flex-col gap-5">
      <Field
        label={f.craftsmanName}
        required
        value={values.craftsmanName}
        onChange={(e) => onChange("craftsmanName", e.target.value)}
        error={errors.craftsmanName}
        hint={f.craftsmanNameHint}
      />
      <SelectField
        label={f.craftCategory}
        required
        placeholder={f.craftCategoryPlaceholder}
        options={translatedCraftCategoryOptions(dict)}
        value={values.craftCategoryId}
        onChange={(e) => onChange("craftCategoryId", e.target.value)}
        error={errors.craftCategoryId}
      />
      <Field
        label={f.registrationNumber}
        value={values.registrationNumber ?? ""}
        onChange={(e) => onChange("registrationNumber", e.target.value)}
        error={errors.registrationNumber}
      />
      <Field
        label={f.registrationAuthority}
        value={values.registrationAuthority ?? ""}
        onChange={(e) => onChange("registrationAuthority", e.target.value)}
        error={errors.registrationAuthority}
      />
      <Field
        label={f.yearsOfExperience}
        type="number"
        min={0}
        max={80}
        inputMode="numeric"
        value={values.yearsOfExperience ?? ""}
        onChange={(e) => onChange("yearsOfExperience", Number(e.target.value))}
        error={errors.yearsOfExperience}
      />
    </div>
  );
}

export function BusinessInfoStep({ values, errors, onChange, dict }: StepProps<BusinessInfoInput>) {
  const f = dict.fields;
  return (
    <div className="flex flex-col gap-5">
      <Field
        label={f.shopName}
        value={values.shopName ?? ""}
        onChange={(e) => onChange("shopName", e.target.value)}
        error={errors.shopName}
      />
      <Field
        label={f.businessAddress}
        value={values.businessAddress ?? ""}
        onChange={(e) => onChange("businessAddress", e.target.value)}
        error={errors.businessAddress}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={f.villageTown}
          required
          value={values.villageTown}
          onChange={(e) => onChange("villageTown", e.target.value)}
          error={errors.villageTown}
        />
        <Field
          label={f.district}
          required
          value={values.district}
          onChange={(e) => onChange("district", e.target.value)}
          error={errors.district}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={f.state}
          required
          value={values.state}
          onChange={(e) => onChange("state", e.target.value)}
          error={errors.state}
        />
        <Field
          label={f.pinCode}
          inputMode="numeric"
          value={values.pinCode ?? ""}
          onChange={(e) => onChange("pinCode", e.target.value)}
          error={errors.pinCode}
        />
      </div>
      <Field
        label={f.gstNumber}
        value={values.gstNumber ?? ""}
        onChange={(e) => onChange("gstNumber", e.target.value.toUpperCase())}
        error={errors.gstNumber}
        hint={f.gstNumberHintPrivate}
      />
      <Field
        label={f.shopContactNumber}
        type="tel"
        inputMode="numeric"
        value={values.shopContactNumber ?? ""}
        onChange={(e) => onChange("shopContactNumber", e.target.value)}
        error={errors.shopContactNumber}
      />
    </div>
  );
}

export function CraftInfoStep({ values, errors, onChange, dict }: StepProps<CraftInfoInput>) {
  const f = dict.fields;
  return (
    <div className="flex flex-col gap-5">
      <SelectField
        label={f.primaryCraft}
        required
        placeholder={f.primaryCraftPlaceholder}
        options={translatedCraftCategoryOptions(dict)}
        value={values.primaryCraftCategoryId}
        onChange={(e) => onChange("primaryCraftCategoryId", e.target.value)}
        error={errors.primaryCraftCategoryId}
      />
      <SelectField
        label={f.secondaryCraft}
        placeholder={f.secondaryCraftPlaceholder}
        options={translatedCraftCategoryOptions(dict)}
        value={values.secondaryCraftCategoryId ?? ""}
        onChange={(e) => onChange("secondaryCraftCategoryId", e.target.value)}
        error={errors.secondaryCraftCategoryId}
      />
      <Field
        label={f.craftTradition}
        value={values.craftTradition ?? ""}
        onChange={(e) => onChange("craftTradition", e.target.value)}
        error={errors.craftTradition}
        hint={f.craftTraditionHint}
      />
      <Field
        label={f.craftDescription}
        value={values.craftDescription ?? ""}
        onChange={(e) => onChange("craftDescription", e.target.value)}
        error={errors.craftDescription}
      />
      <Field
        label={f.geographicRegion}
        value={values.geographicRegion ?? ""}
        onChange={(e) => onChange("geographicRegion", e.target.value)}
        error={errors.geographicRegion}
      />
    </div>
  );
}

export function RecognitionStep({ values, errors, onChange, dict }: StepProps<RecognitionInput>) {
  const f = dict.fields;
  return (
    <div className="flex flex-col gap-5">
      <label className="flex items-center gap-3 rounded-lg border border-ink-500/20 bg-khadi-50 px-4 py-3">
        <input
          type="checkbox"
          checked={values.giTag}
          onChange={(e) => onChange("giTag", e.target.checked)}
          className="h-5 w-5 accent-indigo-700"
        />
        <span className="text-base font-medium text-ink-900">{f.giTagCheckbox}</span>
      </label>
      {values.giTag && (
        <div className="flex flex-col gap-5 border-l-2 border-turmeric-500/50 pl-4">
          <Field
            label={f.giTagName}
            value={values.giTagName ?? ""}
            onChange={(e) => onChange("giTagName", e.target.value)}
            error={errors.giTagName}
          />
          <Field
            label={f.giReferenceNumber}
            value={values.giReferenceNumber ?? ""}
            onChange={(e) => onChange("giReferenceNumber", e.target.value)}
            error={errors.giReferenceNumber}
          />
        </div>
      )}
      <Field
        label={f.nationalAward}
        value={values.nationalAward ?? ""}
        onChange={(e) => onChange("nationalAward", e.target.value)}
        error={errors.nationalAward}
      />
      <Field
        label={f.stateAward}
        value={values.stateAward ?? ""}
        onChange={(e) => onChange("stateAward", e.target.value)}
        error={errors.stateAward}
      />
      <Field
        label={f.otherRecognition}
        value={values.otherRecognition ?? ""}
        onChange={(e) => onChange("otherRecognition", e.target.value)}
        error={errors.otherRecognition}
      />
      <p className="text-sm text-ink-500">{f.recognitionNote}</p>
    </div>
  );
}
