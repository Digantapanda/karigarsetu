import type { Product } from "@/types/domain";

export type MarketplacePlatform = "amazon" | "flipkart";

export interface MarketplaceCredentials {
  sellerId: string;
  /** Free-text note for now (e.g. "API key requested, pending approval").
   *  Real credential material (API keys, OAuth tokens) must never be
   *  stored here in plaintext -- see the migration's comment on
   *  marketplace_connections.connection_note. */
  note?: string;
}

export interface AdapterResult {
  success: boolean;
  /** Plain-language message, safe to show directly to the craftsman. */
  message: string;
}

export interface PushListingResult extends AdapterResult {
  externalListingId?: string;
}

/**
 * The contract every marketplace integration implements. This is the
 * "adapter" half of the adapter pattern requested for catalogue sync:
 * the domain layer (lib/domain/marketplace.ts) and UI never talk to
 * Amazon/Flipkart directly -- they only ever call through this interface,
 * so wiring up real APIs later means implementing this interface, not
 * touching any calling code.
 */
export interface MarketplaceAdapter {
  platform: MarketplacePlatform;
  displayName: string;

  /** Validates and stores a connection. Real implementations will run an OAuth flow here. */
  connect(credentials: MarketplaceCredentials): Promise<AdapterResult>;

  /** Creates or updates this product's listing on the marketplace. */
  pushListing(product: Product): Promise<PushListingResult>;

  /** Pushes a stock quantity change to an existing listing. */
  updateStock(externalListingId: string, quantity: number): Promise<AdapterResult>;
}
