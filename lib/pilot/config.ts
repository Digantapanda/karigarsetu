// The 6 counterbalanced orderings of the 3 conditions, matching the study
// design diagram exactly (T = text only, TA = text+audio, TAI =
// text+audio+icons -- mapped to this app's Text/Voice/Icon interfaces).
export type PilotCondition = "T" | "TA" | "TAI";

export const SEQUENCES: PilotCondition[][] = [
  ["T", "TA", "TAI"],
  ["T", "TAI", "TA"],
  ["TA", "T", "TAI"],
  ["TA", "TAI", "T"],
  ["TAI", "T", "TA"],
  ["TAI", "TA", "T"],
];

export const TASK_KEYS = ["profile_info", "share_profile"] as const;
export type TaskKey = (typeof TASK_KEYS)[number];
