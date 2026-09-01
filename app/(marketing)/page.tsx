import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SpeakableText } from "@/components/ui/SpeakableText";
import { IconHome } from "@/components/home/IconHome";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { getInterfaceMode } from "@/lib/interface-mode/get-interface-mode";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const interfaceMode = await getInterfaceMode();

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[locale]} dict={dict}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{dict.home.eyebrow}</p>
        <SpeakableText
          text={dict.home.title}
          as="h1"
          className="font-display text-4xl font-semibold text-ink-900 sm:text-5xl"
        />
        <SpeakableText text={dict.home.subtitle} className="max-w-prose text-lg text-ink-700" />
        {interfaceMode === "icon" ? (
          <IconHome dict={dict} />
        ) : (
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
        )}
      </main>
    </VoiceConfigProvider>
  );
}
