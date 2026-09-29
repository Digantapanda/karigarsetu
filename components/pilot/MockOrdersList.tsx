"use client";

import { useState, useTransition } from "react";
import { decideMockOrderAction } from "@/app/dashboard/orders/actions";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import type { MockOrder } from "@/lib/domain/pilot";
import type { PilotDictionary } from "@/lib/pilot/dictionary";

export function MockOrdersList({ orders: initial, pilotDict }: { orders: MockOrder[]; pilotDict: PilotDictionary }) {
  const [orders, setOrders] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleDecide(orderId: string, status: "accepted" | "declined") {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    startTransition(async () => {
      await decideMockOrderAction(orderId, status);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-ink-500/15 bg-khadi-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-ink-900">{order.productName}</p>
            <p className="text-sm text-ink-500">
              {order.customerName} · Qty: {order.quantity}
            </p>
          </div>
          {order.status === "pending" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDecide(order.id, "accepted")}
                className="h-10 rounded-lg bg-loom-600 px-4 text-sm font-semibold text-khadi-50 hover:opacity-90 disabled:opacity-50"
              >
                {pilotDict.liveTasks.orderAccept}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDecide(order.id, "declined")}
                className="h-10 rounded-lg border-2 border-red-700 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {pilotDict.liveTasks.orderDecline}
              </button>
              <SpeakerButton
                text={`${order.productName}. ${pilotDict.liveTasks.orderAccept} ${pilotDict.liveTasks.orderDecline}`}
                size={16}
                className="flex h-8 w-8 items-center justify-center rounded text-indigo-700 hover:bg-indigo-300/20"
              />
            </div>
          ) : (
            <span
              className={[
                "w-fit rounded-full px-3 py-1 text-xs font-semibold",
                order.status === "accepted" ? "bg-loom-100 text-loom-600" : "bg-red-50 text-red-700",
              ].join(" ")}
            >
              {order.status === "accepted" ? pilotDict.liveTasks.orderAccept : pilotDict.liveTasks.orderDecline}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
