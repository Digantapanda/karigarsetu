"use client";

import { useState, useTransition } from "react";
import { StepIndicator } from "@/components/registration/StepIndicator";
import {
  BasicAccountStep,
  BusinessInfoStep,
  CraftInfoStep,
  CraftsmanInfoStep,
  RecognitionStep,
} from "@/components/registration/steps";
import { Button } from "@/components/ui/Button";
import { submitCraftsmanRegistration } from "@/app/register/actions";
import {
  basicAccountSchema,
  businessInfoSchema,
  craftInfoSchema,
  craftsmanInfoSchema,
  recognitionSchema,
} from "@/lib/validation/registration";
import type {
  BasicAccountInput,
  BusinessInfoInput,
  CraftInfoInput,
  CraftsmanInfoInput,
  RecognitionInput,
} from "@/types/domain";
import type { z } from "zod";
import type { Dictionary } from "@/lib/i18n/config";

const initialAccount: BasicAccountInput = { fullName: "", email: "", mobileNumber: "", password: "" };
const initialCraftsmanInfo: CraftsmanInfoInput = {
  craftsmanName: "",
  craftCategoryId: "",
  registrationNumber: "",
  registrationAuthority: "",
};
const initialBusinessInfo: BusinessInfoInput = {
  villageTown: "",
  district: "",
  state: "",
  shopName: "",
  businessAddress: "",
  pinCode: "",
  gstNumber: "",
  shopContactNumber: "",
};
const initialCraftInfo: CraftInfoInput = {
  primaryCraftCategoryId: "",
  secondaryCraftCategoryId: "",
  craftTradition: "",
  craftDescription: "",
  geographicRegion: "",
};
const initialRecognition: RecognitionInput = {
  giTag: false,
  giTagName: "",
  giReferenceNumber: "",
  nationalAward: "",
  stateAward: "",
  otherRecognition: "",
};

function fieldErrors<T extends z.ZodTypeAny>(
  schema: T,
  values: unknown
): Partial<Record<string, string>> {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function RegistrationWizard({ dict }: { dict: Dictionary }) {
  const stepLabels = [
    dict.registrationPage.stepAccount,
    dict.registrationPage.stepCraftsmanInfo,
    dict.registrationPage.stepBusinessInfo,
    dict.registrationPage.stepCraftInfo,
    dict.registrationPage.stepRecognition,
  ];

  const [step, setStep] = useState(0);
  const [account, setAccount] = useState(initialAccount);
  const [craftsmanInfo, setCraftsmanInfo] = useState(initialCraftsmanInfo);
  const [businessInfo, setBusinessInfo] = useState(initialBusinessInfo);
  const [craftInfo, setCraftInfo] = useState(initialCraftInfo);
  const [recognition, setRecognition] = useState(initialRecognition);

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileSlug, setProfileSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function goNext() {
    const schema = [basicAccountSchema, craftsmanInfoSchema, businessInfoSchema, craftInfoSchema, recognitionSchema][step];
    const values = [account, craftsmanInfo, businessInfo, craftInfo, recognition][step];
    const stepErrors = fieldErrors(schema, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep((s) => Math.min(s + 1, stepLabels.length - 1));
    }
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    const stepErrors = fieldErrors(recognitionSchema, recognition);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    setSubmitError(null);
    startTransition(async () => {
      const result = await submitCraftsmanRegistration({
        account,
        craftsmanInfo,
        businessInfo,
        craftInfo,
        recognition,
      });
      if (result.success && result.profile) {
        setProfileSlug(result.profile.slug);
      } else {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  if (profileSlug) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-loom-600/30 bg-loom-100 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-loom-600 text-2xl text-khadi-50">
          ✓
        </span>
        <h2 className="font-display text-2xl font-semibold text-ink-900">
          {dict.registrationPage.successTitle}
        </h2>
        <p className="max-w-md text-ink-700">{dict.registrationPage.successBody}</p>
        <p className="text-sm text-ink-500">
          {dict.registrationPage.successUrlLabel}{" "}
          <span className="font-mono text-ink-700">karigarsetu.in/craftsman/{profileSlug}</span>
        </p>
        <a href="/dashboard">
          <Button>{dict.registrationPage.continueButton}</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator steps={stepLabels} currentStep={step} ariaLabel={dict.registrationPage.progressLabel} />

      <div>
        {step === 0 && <BasicAccountStep values={account} errors={errors} onChange={(f, v) => setAccount((s) => ({ ...s, [f]: v }))} dict={dict} />}
        {step === 1 && <CraftsmanInfoStep values={craftsmanInfo} errors={errors} onChange={(f, v) => setCraftsmanInfo((s) => ({ ...s, [f]: v }))} dict={dict} />}
        {step === 2 && <BusinessInfoStep values={businessInfo} errors={errors} onChange={(f, v) => setBusinessInfo((s) => ({ ...s, [f]: v }))} dict={dict} />}
        {step === 3 && <CraftInfoStep values={craftInfo} errors={errors} onChange={(f, v) => setCraftInfo((s) => ({ ...s, [f]: v }))} dict={dict} />}
        {step === 4 && <RecognitionStep values={recognition} errors={errors} onChange={(f, v) => setRecognition((s) => ({ ...s, [f]: v }))} dict={dict} />}
      </div>

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={step === 0 || isPending}>
          {dict.registrationPage.back}
        </Button>
        {step < stepLabels.length - 1 ? (
          <Button onClick={goNext}>{dict.registrationPage.next}</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? dict.registrationPage.creating : dict.registrationPage.createProfile}
          </Button>
        )}
      </div>
    </div>
  );
}
