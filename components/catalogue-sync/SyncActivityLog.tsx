import type { SyncEvent } from "@/lib/domain/marketplace";
import type { Dictionary } from "@/lib/i18n/config";

const STATUS_COLOR: Record<SyncEvent["status"], string> = {
  success: "bg-loom-100 text-loom-600",
  pending: "bg-turmeric-100 text-turmeric-600",
  error: "bg-red-50 text-red-700",
};

export function SyncActivityLog({ events, dict }: { events: SyncEvent[]; dict: Dictionary }) {
  const c = dict.catalogueSyncPage;

  const eventLabel: Record<SyncEvent["eventType"], string> = {
    connect: c.eventConnect,
    push_listing: c.eventPushListing,
    update_stock: c.eventUpdateStock,
  };

  if (events.length === 0) {
    return <p className="text-sm text-ink-500">{c.noActivity}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-3 rounded-lg bg-khadi-50 p-3 text-sm">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[event.status]}`}>
            {event.status}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-ink-900">
              {eventLabel[event.eventType]} · {event.platform}
              {event.productName ? ` · ${event.productName}` : ""}
            </p>
            {event.message && <p className="text-ink-500">{event.message}</p>}
          </div>
          <span className="shrink-0 text-xs text-ink-500">
            {new Date(event.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        </li>
      ))}
    </ul>
  );
}
