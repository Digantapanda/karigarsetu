"use server";

import { redirect } from "next/navigation";
import { decideMockOrder, getOrSeedMockOrders, completeTaskEvent } from "@/lib/domain/pilot";
import { getActivePilotSession, clearActivePilotSession } from "@/lib/pilot/session-cookie";

export async function decideMockOrderAction(orderId: string, status: "accepted" | "declined") {
  const session = await getActivePilotSession();
  if (!session) return { success: false, error: "No active session." };

  const result = await decideMockOrder(orderId, status);
  if (!result.success) return result;

  const orders = await getOrSeedMockOrders(session.sessionId);
  const allDecided = orders.every((o) => o.status !== "pending");

  if (allDecided) {
    await completeTaskEvent(session.sessionId, "view_orders", { success: true });
    const { participantCode, orderPosition } = session;
    await clearActivePilotSession();
    redirect(`/pilot/run/${participantCode}/${orderPosition}/post-task`);
  }

  return { success: true };
}
