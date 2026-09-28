import { notFound } from "next/navigation";
import { getPilotParticipantByCode } from "@/lib/domain/pilot";
import { getPilotDictionary } from "@/lib/pilot/dictionary";
import { FinalFeedbackForm } from "@/components/pilot/FinalFeedbackForm";
import { VoiceConfigProvider } from "@/lib/voice/VoiceConfigContext";
import { SPEECH_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function PilotFinalFeedbackPage({ params }: PageProps) {
  const { code } = await params;
  const participant = await getPilotParticipantByCode(code);
  if (!participant) notFound();

  const pilotDict = getPilotDictionary(participant.language);
  const dict = getDictionary(participant.language);

  return (
    <VoiceConfigProvider lang={SPEECH_LOCALE[participant.language]} dict={dict}>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink-900">{pilotDict.finalFeedback.title}</h1>
        <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 shadow-sm sm:p-8">
          <FinalFeedbackForm participantId={participant.id} participantCode={code} pilotDict={pilotDict} />
        </div>
      </main>
    </VoiceConfigProvider>
  );
}
