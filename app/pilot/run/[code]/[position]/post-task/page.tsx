import { notFound } from "next/navigation";
import { getPilotSession } from "@/lib/domain/pilot";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import { PostTaskQuestionnairePage } from "@/components/pilot/PostTaskQuestionnairePage";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface PageProps {
  params: Promise<{ code: string; position: string }>;
}

/**
 * Reached after the real app's mock Orders page (Task 4) completes both
 * order decisions -- see app/dashboard/orders/page.tsx. Everything before
 * this point (Tasks 1-3) happened on the live app, outside this /pilot
 * route tree entirely.
 */
export default async function PilotPostTaskPage({ params }: PageProps) {
  const { code, position } = await params;
  const orderPosition = Number(position);

  if (!Number.isInteger(orderPosition) || orderPosition < 1 || orderPosition > 3) {
    notFound();
  }

  const session = await getPilotSession(code, orderPosition);
  if (!session) notFound();

  const pilotDict = getPilotDictionary(session.language);
  const dict = getDictionary(session.language);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[session.language]} dict={dict}>
      <PostTaskQuestionnairePage
        sessionId={session.sessionId}
        participantId={session.participantId}
        participantCode={code}
        condition={session.condition}
        orderPosition={session.orderPosition}
        locale={session.language}
        pilotDict={pilotDict}
      />
    </VoiceConfigProvider>
  );
}
