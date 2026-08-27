import type {
  MarketplaceAdapter,
  MarketplaceCredentials,
  AdapterResult,
  PushListingResult,
} from "@/lib/marketplace/types";
import type { Product } from "@/types/domain";

/**
 * Amazon adapter -- STUBBED pending real integration.
 *
 * What real integration requires (for whoever wires this up next):
 * 1. An active Amazon Seller Central account and registration as a
 *    developer in Seller Central to get SP-API access.
 * 2. An SP-API application (LWA client id/secret) plus a refresh token
 *    obtained via Amazon's authorization workflow per seller.
 * 3. Signed requests (AWS SigV4) to the Listings Items API to create/update
 *    a listing, and the Feeds API (or Listings Items API PATCH) to push
 *    inventory/quantity changes.
 * 4. A category-specific product type schema -- Amazon requires listings
 *    to conform to a schema per product type (handicrafts typically map to
 *    "Home" or "Arts & Crafts" categories), which needs to be fetched and
 *    validated against before submission.
 * 5. Credentials must be stored encrypted, server-side only (see the
 *    migration's note on marketplace_connections.connection_note) --
 *    never in a column readable by the anon client.
 *
 * None of that exists yet. This stub keeps the interface real so the rest
 * of the app (domain layer, UI, sync status tracking) is fully built and
 * ready -- only this file's internals need to change once real credentials
 * and API wiring are available.
 */
export const amazonAdapter: MarketplaceAdapter = {
  platform: "amazon",
  displayName: "Amazon",

  async connect(_credentials: MarketplaceCredentials): Promise<AdapterResult> {
    return {
      success: false,
      message:
        "Amazon connection is recorded, but live sync isn't active yet -- this needs an approved Seller Central SP-API application to go live.",
    };
  },

  async pushListing(_product: Product): Promise<PushListingResult> {
    return {
      success: false,
      message: "Amazon listing sync isn't active yet. This product will be marked pending until the Amazon integration is completed.",
    };
  },

  async updateStock(_externalListingId: string, _quantity: number): Promise<AdapterResult> {
    return {
      success: false,
      message: "Amazon stock sync isn't active yet.",
    };
  },
};
