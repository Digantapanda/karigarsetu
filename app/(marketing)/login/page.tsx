import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SpeakableText } from "@/components/ui/SpeakableText";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SPEECH_LOCALE } from "@/lib/i18n/config";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[locale]} dict={dict}>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-16">
        <header className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">KarigarSetu</p>
          <h1 className="font-display text-3xl font-semibold text-ink-900">{dict.loginPage.heading}</h1>
          <SpeakableText text={dict.loginPage.subheading} className="text-ink-700" />
        </header>

        <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 shadow-sm sm:p-8">
          <LoginForm dict={dict} />
        </div>

        <p className="text-center text-sm text-ink-500">
          {dict.loginPage.newHere}{" "}
          <Link href="/register" className="font-medium text-indigo-700 underline underline-offset-2">
            {dict.loginPage.registerLink}
          </Link>
        </p>
      </main>
    </VoiceConfigProvider>
  );
}
