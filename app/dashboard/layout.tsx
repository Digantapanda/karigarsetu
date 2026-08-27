import Link from "next/link";
import { submitLogout } from "@/app/dashboard/actions";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <nav className="border-b border-ink-500/15 bg-khadi-100/60">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="font-display text-lg font-semibold text-ink-900">
            KarigarSetu
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector current={locale} />
            <form action={submitLogout}>
              <button
                type="submit"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-900/5"
              >
                {dict.common.logout}
              </button>
            </form>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
