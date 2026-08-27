import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <header className="border-b border-ink-500/15 bg-khadi-100/60">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-lg font-semibold text-ink-900">
          KarigarSetu
        </Link>

        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/discover" className="text-sm font-medium text-ink-700 hover:text-ink-900">
            {dict.common.discover}
          </Link>

          {user ? (
            <Link href="/dashboard">
              <Button variant="secondary" className="h-10 min-w-0 px-4 text-sm">
                {dict.common.dashboard}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900">
                {dict.common.login}
              </Link>
              <Link href="/register">
                <Button className="h-10 min-w-0 px-4 text-sm">{dict.common.register}</Button>
              </Link>
            </>
          )}

          <LanguageSelector current={locale} />
        </nav>
      </div>
    </header>
  );
}
