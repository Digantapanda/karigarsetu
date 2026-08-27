"use server";

import { revalidatePath } from "next/cache";
import {
  connectMarketplace,
  pushProductToPlatform,
  syncStockToPlatforms,
} from "@/lib/domain/marketplace";
import { updateStockQuantity } from "@/lib/domain/products";
import type { MarketplacePlatform } from "@/lib/marketplace/types";

export async function submitConnectMarketplace(platform: MarketplacePlatform, formData: FormData) {
  const result = await connectMarketplace(platform, {
    sellerId: String(formData.get("sellerId") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  revalidatePath("/dashboard/catalogue-sync");
  return result;
}

export async function submitPushListing(productId: string, platform: MarketplacePlatform) {
  const result = await pushProductToPlatform(productId, platform);
  revalidatePath("/dashboard/catalogue-sync");
  return result;
}

export async function submitStockUpdate(productId: string, quantity: number) {
  const result = await updateStockQuantity(productId, quantity);
  if (result.success) {
    await syncStockToPlatforms(productId, quantity);
  }
  revalidatePath("/dashboard/catalogue-sync");
  revalidatePath("/dashboard/products");
  return result;
}
