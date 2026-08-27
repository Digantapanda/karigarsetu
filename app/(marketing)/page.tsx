import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home() {
  const dict = getDictionary(await getLocale());

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.home.eyebrow}</p>
      <h1 className="font-display text-4xl font-semibold text-ink-900 sm:text-5xl">{dict.home.title}</h1>
      <p className="max-w-prose text-lg text-ink-700">{dict.home.subtitle}</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/register">
          <Button>{dict.home.ctaRegister}</Button>
        </Link>
        <Link href="/discover">
          <Button variant="secondary">{dict.home.ctaDiscover}</Button>
        </Link>
        <Link href="/login">
          <Button variant="ghost">{dict.home.ctaLogin}</Button>
        </Link>
      </div>
    </main>
  );
}
