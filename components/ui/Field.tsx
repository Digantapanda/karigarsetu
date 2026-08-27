import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  trailing?: ReactNode;
}

export function Field({ label, hint, error, required, trailing, id, ...inputProps }: FieldProps) {
  const fieldId = id ?? inputProps.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="flex items-baseline justify-between text-sm font-medium text-ink-900">
        <span>
          {label}
          {required ? (
            <span className="ml-1 text-turmeric-600" aria-hidden="true">*</span>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-ink-500">(optional)</span>
          )}
        </span>
      </label>
      <div className="flex items-center gap-2">
        <input
          id={fieldId}
          {...inputProps}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-indigo-500"
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${fieldId}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
