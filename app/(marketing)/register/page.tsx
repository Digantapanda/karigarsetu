import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function RegisterPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
          {dict.registrationPage.eyebrow}
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          {dict.registrationPage.heading}
        </h1>
        <p className="max-w-prose text-ink-700">{dict.registrationPage.subheading}</p>
      </header>

      <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 shadow-sm sm:p-8">
        <RegistrationWizard dict={dict} locale={locale} />
      </div>
    </main>
  );
}
