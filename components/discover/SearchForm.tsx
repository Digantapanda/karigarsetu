import { translatedCraftCategoryOptions } from "@/lib/domain/craft-categories";
import { INDIAN_STATES } from "@/lib/domain/indian-states";
import type { Dictionary } from "@/lib/i18n/config";

interface SearchFormProps {
  query?: string;
  categoryId?: string;
  state?: string;
  dict: Dictionary;
}

// A plain GET <form> -- works without JavaScript, which matters for the
// low-bandwidth / older-device audience this platform targets (architecture
// doc §17, §24). Submitting reloads /discover with the chosen filters as
// query params, which the page reads server-side.
export function SearchForm({ query, categoryId, state, dict }: SearchFormProps) {
  return (
    <form action="/discover" method="get" className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="q" className="text-sm font-medium text-ink-900">
          {dict.discoverPage.searchLabel}
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={query}
          placeholder={dict.discoverPage.searchPlaceholder}
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:w-52">
        <label htmlFor="category" className="text-sm font-medium text-ink-900">
          {dict.discoverPage.categoryLabel}
        </label>
        <select
          id="category"
          name="category"
          defaultValue={categoryId ?? ""}
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
        >
          <option value="">{dict.discoverPage.allCrafts}</option>
          {translatedCraftCategoryOptions(dict).map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-52">
        <label htmlFor="state" className="text-sm font-medium text-ink-900">
          {dict.discoverPage.stateLabel}
        </label>
        <select
          id="state"
          name="state"
          defaultValue={state ?? ""}
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
        >
          <option value="">{dict.discoverPage.allStates}</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-12 rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
      >
        {dict.discoverPage.searchButton}
      </button>
    </form>
  );
}
