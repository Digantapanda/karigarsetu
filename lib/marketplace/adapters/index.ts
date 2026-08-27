import type { MarketplaceAdapter, MarketplacePlatform } from "@/lib/marketplace/types";
import { amazonAdapter } from "@/lib/marketplace/adapters/amazon";
import { flipkartAdapter } from "@/lib/marketplace/adapters/flipkart";

// Adapter registry. Adding a new platform later means writing one file
// like amazon.ts/flipkart.ts and adding one line here -- nothing else in
// the app needs to change.
const ADAPTERS: Record<MarketplacePlatform, MarketplaceAdapter> = {
  amazon: amazonAdapter,
  flipkart: flipkartAdapter,
};

export function getMarketplaceAdapter(platform: MarketplacePlatform): MarketplaceAdapter {
  return ADAPTERS[platform];
}

export function listMarketplaceAdapters(): MarketplaceAdapter[] {
  return Object.values(ADAPTERS);
}
