import type { Award } from "@/types/domain";

const LEVEL_LABEL: Record<Award["level"], string> = {
  national: "National Award",
  state: "State Award",
  other: "Recognition",
};

export function AwardsList({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {awards.map((award) => (
        <li key={award.id} className="flex items-start gap-3 rounded-lg bg-khadi-50 p-4">
          <span className="mt-0.5 shrink-0 rounded-full bg-turmeric-100 px-2 py-0.5 text-xs font-semibold text-turmeric-600">
            {LEVEL_LABEL[award.level]}
          </span>
          <div>
            <p className="font-medium text-ink-900">{award.name}</p>
            <p className="text-sm text-ink-500">
              {[award.issuingOrganization, award.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
