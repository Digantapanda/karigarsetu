"use client";

import { useTransition } from "react";
import { submitIntake } from "@/app/pilot/actions";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

export function IntakeForm({ pilotDict, defaultLanguage }: { pilotDict: PilotDictionary; defaultLanguage: Locale }) {
  const [isPending, startTransition] = useTransition();
  const t = pilotDict.intake;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitIntake(formData);
      if (result && !result.success) {
        alert(result.error);
      }
    });
  }

  const fieldClass =
    "h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500";
  const labelClass = "text-sm font-medium text-ink-900";

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className={labelClass}>{t.fullName}</label>
        <input id="fullName" name="fullName" type="text" required className={fieldClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact" className={labelClass}>{t.contact}</label>
        <input id="contact" name="contact" type="text" required className={fieldClass} />
        <p className="text-sm text-ink-500">{t.contactHint}</p>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className={labelClass}>{t.gender}</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "female", label: t.genderFemale },
            { value: "male", label: t.genderMale },
            { value: "other", label: t.genderOther },
            { value: "prefer_not_to_say", label: t.genderPreferNot },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-lg border border-ink-500/20 bg-khadi-50 px-3 py-2 text-sm">
              <input type="radio" name="gender" value={opt.value} required className="accent-indigo-700" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ageGroup" className={labelClass}>{t.ageGroup}</label>
        <select id="ageGroup" name="ageGroup" required className={fieldClass}>
          <option value="18-30">18-30</option>
          <option value="31-50">31-50</option>
          <option value="51+">51+</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="language" className={labelClass}>{t.language}</label>
        <select id="language" name="language" required defaultValue={defaultLanguage} className={fieldClass}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className={labelClass}>{t.literacyLevel}</legend>
        <div className="flex flex-col gap-2">
          {[
            { value: "low", label: t.literacyLow },
            { value: "medium", label: t.literacyMedium },
            { value: "high", label: t.literacyHigh },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-lg border border-ink-500/20 bg-khadi-50 px-3 py-2 text-sm">
              <input type="radio" name="literacyLevel" value={opt.value} required className="accent-indigo-700" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className={labelClass}>{t.digitalExperience}</legend>
        <div className="flex flex-col gap-2">
          {[
            { value: "low", label: t.digitalLow },
            { value: "medium", label: t.digitalMedium },
            { value: "high", label: t.digitalHigh },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 rounded-lg border border-ink-500/20 bg-khadi-50 px-3 py-2 text-sm">
              <input type="radio" name="digitalExperience" value={opt.value} required className="accent-indigo-700" />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-60"
      >
        {isPending ? "…" : t.submit}
      </button>
    </form>
  );
}
