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

// The four tasks run on the live app (see supabase/migrations/0006):
//   1 dashboard_view  - land on the dashboard and look around
//   2 add_product     - find "My Products" and add a product
//   3 share_profile   - view own profile, share it by mail
//   4 view_orders     - view orders, accept one and decline one
export const TASK_KEYS = ["dashboard_view", "add_product", "share_profile", "view_orders"] as const;
export type TaskKey = (typeof TASK_KEYS)[number];
