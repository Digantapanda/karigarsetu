"use client";

import { useState, useTransition } from "react";
import { submitIntake } from "@/app/pilot/actions";
import { WHO5_ITEMS, SWLS_ITEMS, DIGITAL_FAMILIARITY_ITEMS, SELF_EFFICACY_ITEMS } from "@/lib/pilot/instruments";
import type { PilotDictionary } from "@/lib/pilot/dictionary";
import type { Locale } from "@/lib/i18n/config";

const fieldClass =
  "h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500";
const labelClass = "text-sm font-medium text-ink-900";
const sectionTitleClass = "font-display text-xl font-semibold text-ink-900";

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={[
            "flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-sm",
            value === opt.value ? "border-indigo-700 bg-indigo-300/10" : "border-ink-500/20 bg-khadi-50",
          ].join(" ")}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-5 w-5 accent-indigo-700"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function LikertRow({
  label,
  itemId,
  min,
  max,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  itemId: string;
  min: number;
  max: number;
  value: number | undefined;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="rounded-lg border border-ink-500/15 bg-khadi-50 p-3">
      <p className="mb-2 text-sm font-medium text-ink-900">{label}</p>
      <div className="flex items-center justify-between gap-1">
        {lowLabel && <span className="text-xs text-ink-500">{lowLabel}</span>}
        <div className="flex gap-2">
          {points.map((p) => (
            <label key={p} className="flex flex-col items-center gap-1">
              <input
                type="radio"
                name={itemId}
                checked={value === p}
                onChange={() => onChange(p)}
                className="h-5 w-5 accent-indigo-700"
              />
              <span className="text-xs text-ink-500">{p}</span>
            </label>
          ))}
        </div>
        {highLabel && <span className="text-xs text-ink-500">{highLabel}</span>}
      </div>
    </div>
  );
}

type FormState = Record<string, string | number>;

export function IntakeForm({ pilotDict, locale }: { pilotDict: PilotDictionary; locale: Locale }) {
  const t = pilotDict.intake;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormState>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(key: string, value: string | number) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  const steps = [
    "participantInfo", "sectionA", "sectionB", "sectionC", "sectionD", "sectionE", "sectionF", "sectionG",
  ] as const;

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFinalSubmit() {
    setError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, String(v)));
    formData.append("language", locale);

    startTransition(async () => {
      const result = await submitIntake(formData);
      if (result && !result.success) {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  const current = steps[step];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-sm text-ink-500">{step + 1} / {steps.length}</p>

      {current === "participantInfo" && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionTitleClass}>{t.participantInfoTitle}</h2>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.fullName}</label>
            <input className={fieldClass} value={(values.fullName as string) ?? ""} onChange={(e) => set("fullName", e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.contact}</label>
            <input className={fieldClass} value={(values.contact as string) ?? ""} onChange={(e) => set("contact", e.target.value)} required />
            <p className="text-sm text-ink-500">{t.contactHint}</p>
          </div>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.deviceLabel}</legend>
            <RadioGroup
              name="device"
              value={(values.device as string) ?? ""}
              onChange={(v) => set("device", v)}
              options={[{ value: "mobile", label: t.deviceMobile }, { value: "desktop", label: t.deviceDesktop }]}
            />
          </fieldset>
        </div>
      )}

      {current === "sectionA" && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionTitleClass}>{t.sectionA}</h2>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.ageLabel}</legend>
            <RadioGroup
              name="ageBracket"
              value={(values.ageBracket as string) ?? ""}
              onChange={(v) => set("ageBracket", v)}
              options={["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].map((v) => ({ value: v, label: v }))}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.genderLabel}</legend>
            <RadioGroup
              name="genderV2"
              value={(values.genderV2 as string) ?? ""}
              onChange={(v) => set("genderV2", v)}
              options={[
                { value: "man", label: t.genderMan },
                { value: "woman", label: t.genderWoman },
                { value: "non_binary", label: t.genderNonBinary },
                { value: "self_describe", label: t.genderSelfDescribe },
                { value: "prefer_not_to_say", label: t.genderPreferNot },
              ]}
            />
            {values.genderV2 === "self_describe" && (
              <input
                className={fieldClass}
                placeholder={t.genderSelfDescribePlaceholder}
                value={(values.genderSelfDescribe as string) ?? ""}
                onChange={(e) => set("genderSelfDescribe", e.target.value)}
              />
            )}
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.educationLabel}</label>
            <select className={fieldClass} value={(values.education as string) ?? ""} onChange={(e) => set("education", e.target.value)}>
              <option value="" disabled>--</option>
              {[
                ["no_formal_schooling", t.educationNoFormal], ["primary", t.educationPrimary], ["middle", t.educationMiddle],
                ["secondary", t.educationSecondary], ["higher_secondary", t.educationHigherSecondary],
                ["diploma_iti", t.educationDiplomaIti], ["undergraduate", t.educationUndergrad], ["postgraduate_plus", t.educationPostgradPlus],
              ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.occupationLabel}</label>
            <select className={fieldClass} value={(values.occupation as string) ?? ""} onChange={(e) => set("occupation", e.target.value)}>
              <option value="" disabled>--</option>
              {[
                ["student", t.occupationStudent], ["salaried", t.occupationSalaried], ["self_employed", t.occupationSelfEmployed],
                ["farmer", t.occupationFarmer], ["daily_wage", t.occupationDailyWage], ["homemaker", t.occupationHomemaker],
                ["retired", t.occupationRetired], ["unemployed", t.occupationUnemployed], ["other", t.occupationOther],
              ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {values.occupation === "other" && (
              <input className={fieldClass} placeholder={t.occupationOtherPlaceholder} value={(values.occupationOther as string) ?? ""} onChange={(e) => set("occupationOther", e.target.value)} />
            )}
          </div>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.residenceLabel}</legend>
            <RadioGroup
              name="residence"
              value={(values.residence as string) ?? ""}
              onChange={(v) => set("residence", v)}
              options={[
                { value: "rural", label: t.residenceRural },
                { value: "semi_urban", label: t.residenceSemiUrban },
                { value: "urban", label: t.residenceUrban },
              ]}
            />
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.primaryLanguageLabel}</label>
            <input className={fieldClass} value={(values.primaryLanguage as string) ?? ""} onChange={(e) => set("primaryLanguage", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.otherLanguagesLabel} <span className="text-xs text-ink-500">{pilotDict.common.optional}</span></label>
            <input className={fieldClass} value={(values.otherLanguages as string) ?? ""} onChange={(e) => set("otherLanguages", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>{t.preferredLanguageTaskLabel}</label>
            <input className={fieldClass} value={(values.preferredLanguageTask as string) ?? ""} onChange={(e) => set("preferredLanguageTask", e.target.value)} />
          </div>
        </div>
      )}

      {current === "sectionB" && (
        <div className="flex flex-col gap-4">
          <h2 className={sectionTitleClass}>{t.sectionB}</h2>
          <LikertRow label={t.b1} itemId="literacyReading" min={1} max={5} value={values.literacyReading as number} onChange={(v) => set("literacyReading", v)} lowLabel={t.readWriteScale1Read} highLabel={t.readWriteScale5} />
          <LikertRow label={t.b2} itemId="literacyWriting" min={1} max={5} value={values.literacyWriting as number} onChange={(v) => set("literacyWriting", v)} lowLabel={t.readWriteScale1Write} highLabel={t.readWriteScale5} />
          <LikertRow label={t.b3} itemId="digitalTextComprehension" min={1} max={5} value={values.digitalTextComprehension as number} onChange={(v) => set("digitalTextComprehension", v)} lowLabel={t.understandScale1} highLabel={t.understandScale5} />
        </div>
      )}

      {current === "sectionC" && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionTitleClass}>{t.sectionC}</h2>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.c1}</legend>
            <RadioGroup name="internetAccess" value={(values.internetAccess as string) ?? ""} onChange={(v) => set("internetAccess", v)} options={[
              { value: "personal", label: t.c1Opt1 }, { value: "shared", label: t.c1Opt2 }, { value: "elsewhere", label: t.c1Opt3 }, { value: "no_regular_access", label: t.c1Opt4 },
            ]} />
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.c2}</legend>
            <RadioGroup name="phoneAccess" value={(values.phoneAccess as string) ?? ""} onChange={(v) => set("phoneAccess", v)} options={[
              { value: "no_access", label: t.c2Opt1 }, { value: "basic_phone", label: t.c2Opt2 }, { value: "smartphone", label: t.c2Opt3 }, { value: "both", label: t.c2Opt4 },
            ]} />
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.c3}</legend>
            <RadioGroup name="phoneExclusivity" value={(values.phoneExclusivity as string) ?? ""} onChange={(v) => set("phoneExclusivity", v)} options={[
              { value: "yes", label: t.c3Opt1 }, { value: "shared_family", label: t.c3Opt2 }, { value: "borrow_others", label: t.c3Opt3 },
            ]} />
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={labelClass}>{t.c4}</legend>
            <RadioGroup name="internetFrequency" value={(values.internetFrequency as string) ?? ""} onChange={(v) => set("internetFrequency", v)} options={[
              { value: "never", label: t.c4Opt1 }, { value: "less_than_weekly", label: t.c4Opt2 }, { value: "several_times_weekly", label: t.c4Opt3 }, { value: "daily", label: t.c4Opt4 }, { value: "several_times_daily", label: t.c4Opt5 },
            ]} />
          </fieldset>
        </div>
      )}

      {current === "sectionD" && (
        <div className="flex flex-col gap-4">
          <h2 className={sectionTitleClass}>{t.sectionD}</h2>
          <p className="text-sm text-ink-500">{t.sectionDInstruction}</p>
          {DIGITAL_FAMILIARITY_ITEMS.map((item) => (
            <LikertRow
              key={item.id}
              label={item.text[locale]}
              itemId={`df_${item.id}`}
              min={0}
              max={4}
              value={values[`df_${item.id}`] as number}
              onChange={(v) => set(`df_${item.id}`, v)}
              lowLabel={t.dScale0}
              highLabel={t.dScale4}
            />
          ))}
        </div>
      )}

      {current === "sectionE" && (
        <div className="flex flex-col gap-4">
          <h2 className={sectionTitleClass}>{t.sectionE}</h2>
          {SELF_EFFICACY_ITEMS.map((item) => (
            <LikertRow
              key={item.id}
              label={item.text[locale]}
              itemId={`se_${item.id}`}
              min={1}
              max={5}
              value={values[`se_${item.id}`] as number}
              onChange={(v) => set(`se_${item.id}`, v)}
              lowLabel={pilotDict.common.scaleStronglyDisagree}
              highLabel={pilotDict.common.scaleStronglyAgree}
            />
          ))}
        </div>
      )}

      {current === "sectionF" && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className={sectionTitleClass}>{t.who5Title}</h2>
            <p className="text-sm text-ink-500">{t.who5Instruction}</p>
          </div>
          {WHO5_ITEMS.map((item) => (
            <LikertRow
              key={item.id}
              label={item.text[locale]}
              itemId={`who5_${item.id}`}
              min={0}
              max={5}
              value={values[`who5_${item.id}`] as number}
              onChange={(v) => set(`who5_${item.id}`, v)}
              lowLabel={t.who5Scale0}
              highLabel={t.who5Scale5}
            />
          ))}
          <div>
            <h2 className={sectionTitleClass}>{t.swlsTitle}</h2>
            <p className="text-sm text-ink-500">{t.swlsInstruction}</p>
          </div>
          {SWLS_ITEMS.map((item) => (
            <LikertRow
              key={item.id}
              label={item.text[locale]}
              itemId={`swls_${item.id}`}
              min={1}
              max={7}
              value={values[`swls_${item.id}`] as number}
              onChange={(v) => set(`swls_${item.id}`, v)}
              lowLabel={pilotDict.common.scaleStronglyDisagree}
              highLabel={pilotDict.common.scaleStronglyAgree}
            />
          ))}
        </div>
      )}

      {current === "sectionG" && (
        <div className="flex flex-col gap-4">
          <h2 className={sectionTitleClass}>{t.sectionG}</h2>
          <p className="text-base text-ink-900">{t.g1}</p>
          <div className="flex justify-center gap-4">
            {["😞", "🙁", "😐", "🙂", "😄"].map((face, i) => (
              <button
                key={face}
                type="button"
                onClick={() => set("baselineHappiness", i + 1)}
                className={[
                  "flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl",
                  values.baselineHappiness === i + 1 ? "border-indigo-700 bg-indigo-300/20" : "border-ink-500/15 bg-khadi-50",
                ].join(" ")}
              >
                {face}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between">
        <button type="button" onClick={back} disabled={step === 0} className="h-11 rounded-lg px-5 text-sm font-medium text-ink-700 disabled:opacity-40">
          {pilotDict.common.back}
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={next} className="h-11 rounded-lg bg-indigo-700 px-6 text-sm font-semibold text-khadi-50 hover:bg-indigo-900">
            {pilotDict.common.next}
          </button>
        ) : (
          <button type="button" onClick={handleFinalSubmit} disabled={isPending} className="h-11 rounded-lg bg-indigo-700 px-6 text-sm font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-60">
            {isPending ? "…" : t.submit}
          </button>
        )}
      </div>
    </div>
  );
}
