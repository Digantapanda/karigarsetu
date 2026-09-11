import { notFound } from "next/navigation";
import { getPilotSession } from "@/lib/domain/pilot";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import { PilotRunner } from "@/components/pilot/PilotRunner";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { translatedCraftCategoryOptions } from "@/lib/domain/craft-categories";

interface PageProps {
  params: Promise<{ code: string; position: string }>;
}

export default async function PilotRunPage({ params }: PageProps) {
  const { code, position } = await params;
  const orderPosition = Number(position);

  if (!Number.isInteger(orderPosition) || orderPosition < 1 || orderPosition > 3) {
    notFound();
  }

  const session = await getPilotSession(code, orderPosition);
  if (!session) notFound();

  const pilotDict = getPilotDictionary(session.language);
  const dict = getDictionary(session.language);
  const craftOptions = translatedCraftCategoryOptions(dict);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[session.language]} dict={dict}>
      <PilotRunner
        sessionId={session.sessionId}
        participantCode={code}
        condition={session.condition}
        orderPosition={session.orderPosition}
        locale={session.language}
        pilotDict={pilotDict}
        craftOptions={craftOptions}
      />
    </VoiceConfigProvider>
  );
}
