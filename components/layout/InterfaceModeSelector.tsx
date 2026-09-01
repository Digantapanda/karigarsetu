import { Type, LayoutGrid } from "lucide-react";
import { setInterfaceMode } from "@/app/actions/interface-mode";
import type { InterfaceMode } from "@/lib/interface-mode/config";
import type { Dictionary } from "@/lib/i18n/config";

const OPTIONS: { mode: InterfaceMode; icon: typeof Type }[] = [
  { mode: "text", icon: Type },
  { mode: "icon", icon: LayoutGrid },
];

export function InterfaceModeSelector({ current, dict }: { current: InterfaceMode; dict: Dictionary }) {
  const label: Record<InterfaceMode, string> = {
    text: dict.common.textMode,
    icon: dict.common.iconMode,
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-ink-500/15 bg-khadi-50 p-1">
      {OPTIONS.map(({ mode, icon: Icon }) => (
        <form key={mode} action={setInterfaceMode}>
          <input type="hidden" name="mode" value={mode} />
          <button
            type="submit"
            aria-current={mode === current ? "true" : undefined}
            aria-label={label[mode]}
            title={label[mode]}
            className={[
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              mode === current ? "bg-indigo-700 text-khadi-50" : "text-ink-700 hover:bg-ink-900/5",
            ].join(" ")}
          >
            <Icon size={14} aria-hidden="true" />
            {label[mode]}
          </button>
        </form>
      ))}
    </div>
  );
}
