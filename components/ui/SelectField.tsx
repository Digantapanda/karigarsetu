import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function SelectField({
  label,
  options,
  placeholder,
  error,
  required,
  id,
  ...selectProps
}: SelectFieldProps) {
  const fieldId = id ?? selectProps.name;
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
      <select
        id={fieldId}
        {...selectProps}
        aria-required={required}
        aria-invalid={Boolean(error)}
        className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
