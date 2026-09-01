// Matches the interface_mode_preference column already present on
// craftsman_profiles since the very first migration (architecture doc §6,
// §33). "voice" remains a valid stored value for forward-compatibility
// with a future full conversational Voice Mode (§19) -- but that's a
// separate, much larger feature (voice-driven navigation, not just
// speaker/mic icons on fields) that isn't built yet. Voice controls
// already work as an always-on layer across both Text and Icon mode
// rather than being gated behind a third selectable UI, so the switcher
// this app actually offers is Text vs Icon.
export const INTERFACE_MODES = ["text", "icon"] as const;
export type InterfaceMode = (typeof INTERFACE_MODES)[number];

export const DEFAULT_INTERFACE_MODE: InterfaceMode = "text";
export const INTERFACE_MODE_COOKIE = "interface_mode";

export function isInterfaceMode(value: string): value is InterfaceMode {
  return (INTERFACE_MODES as readonly string[]).includes(value);
}
