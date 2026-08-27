export function VerificationBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-loom-600 px-3 py-1 text-xs font-semibold text-khadi-50">
      <CheckIcon /> Verified craftsman
    </span>
  );
}

export function GIBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-turmeric-500 px-3 py-1 text-xs font-semibold text-khadi-50">
      GI Tagged -- {label}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
