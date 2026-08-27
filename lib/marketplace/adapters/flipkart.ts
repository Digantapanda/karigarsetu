import type {
  MarketplaceAdapter,
  MarketplaceCredentials,
  AdapterResult,
  PushListingResult,
} from "@/lib/marketplace/types";
import type { Product } from "@/types/domain";

/**
 * Flipkart adapter -- STUBBED pending real integration.
 *
 * What real integration requires (for whoever wires this up next):
 * 1. Approval as a Flipkart seller and access to the Flipkart Seller API /
 *    Marketplace API (Flipkart's onboarding requires a registered
 *    business and GST details, which most craftsmen on this platform will
 *    already have entered during KarigarSetu registration).
 * 2. OAuth2 client credentials issued by Flipkart for the seller account.
 * 3. Listings are created via Flipkart's Listings API using their required
 *    category attribute schema (similar constraint to Amazon -- each
 *    product category has required/optional attributes that must be
 *    mapped from KarigarSetu's product fields).
 * 4. Stock/price updates go through Flipkart's Feed API or the
 *    synchronous Listings update endpoint, depending on volume.
 * 5. Same credential-storage caveat as Amazon: nothing sensitive belongs
 *    in marketplace_connections.connection_note in production.
 *
 * As with the Amazon adapter, this stub exists so the domain layer and UI
 * are fully wired and ready -- swapping in real API calls here is the only
 * remaining work once Flipkart seller access is in place.
 */
export const flipkartAdapter: MarketplaceAdapter = {
  platform: "flipkart",
  displayName: "Flipkart",

  async connect(_credentials: MarketplaceCredentials): Promise<AdapterResult> {
    return {
      success: false,
      message:
        "Flipkart connection is recorded, but live sync isn't active yet -- this needs approved Flipkart Seller API access to go live.",
    };
  },

  async pushListing(_product: Product): Promise<PushListingResult> {
    return {
      success: false,
      message: "Flipkart listing sync isn't active yet. This product will be marked pending until the Flipkart integration is completed.",
    };
  },

  async updateStock(_externalListingId: string, _quantity: number): Promise<AdapterResult> {
    return {
      success: false,
      message: "Flipkart stock sync isn't active yet.",
    };
  },
};
