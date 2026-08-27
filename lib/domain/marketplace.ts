import { createClient } from "@/lib/supabase/server";
import { getMarketplaceAdapter, listMarketplaceAdapters } from "@/lib/marketplace/adapters";
import type { MarketplacePlatform, MarketplaceCredentials } from "@/lib/marketplace/types";
import type { DomainActionResult } from "@/lib/domain/craftsman";
import type { Product } from "@/types/domain";

async function getOwnCraftsmanId(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("craftsman_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data?.id as string) ?? null;
}

export interface MarketplaceConnectionSummary {
  platform: MarketplacePlatform;
  displayName: string;
  status: "not_connected" | "pending" | "connected" | "error";
  sellerId?: string;
  lastError?: string;
}

/** One row per known platform, whether or not a connection row exists yet. */
export async function listMarketplaceConnections(): Promise<MarketplaceConnectionSummary[]> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  const adapters = listMarketplaceAdapters();

  if (!craftsmanId) {
    return adapters.map((a) => ({ platform: a.platform, displayName: a.displayName, status: "not_connected" }));
  }

  const { data: rows } = await supabase
    .from("marketplace_connections")
    .select("*")
    .eq("craftsman_id", craftsmanId);

  const byPlatform = new Map((rows ?? []).map((r) => [r.platform as MarketplacePlatform, r]));

  return adapters.map((adapter) => {
    const row = byPlatform.get(adapter.platform);
    return {
      platform: adapter.platform,
      displayName: adapter.displayName,
      status: (row?.status as MarketplaceConnectionSummary["status"]) ?? "not_connected",
      sellerId: (row?.seller_id as string) ?? undefined,
      lastError: (row?.last_error as string) ?? undefined,
    };
  });
}

/**
 * Records a connection attempt for a platform. Since the adapters are
 * currently stubbed (no real OAuth/API wiring), this always ends in
 * status 'pending' or 'error' rather than 'connected' -- it's honest about
 * what's actually working today. Swapping in a real adapter.connect() that
 * completes a real OAuth flow is what would let this reach 'connected'.
 */
export async function connectMarketplace(
  platform: MarketplacePlatform,
  credentials: MarketplaceCredentials
): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  if (!credentials.sellerId.trim()) {
    return { success: false, error: "Please enter a seller / merchant ID." };
  }

  const adapter = getMarketplaceAdapter(platform);
  const result = await adapter.connect(credentials);

  const { error } = await supabase.from("marketplace_connections").upsert(
    {
      craftsman_id: craftsmanId,
      platform,
      status: result.success ? "connected" : "pending",
      seller_id: credentials.sellerId,
      connection_note: credentials.note || null,
      connected_at: result.success ? new Date().toISOString() : null,
      last_error: result.success ? null : result.message,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "craftsman_id,platform" }
  );

  await supabase.from("sync_events").insert({
    craftsman_id: craftsmanId,
    platform,
    event_type: "connect",
    status: result.success ? "success" : "pending",
    message: result.message,
  });

  if (error) return { success: false, error: "We couldn't save this connection. Please try again." };
  return { success: true, error: result.success ? undefined : result.message };
}

export interface ProductSyncRow {
  product: Product;
  listings: Partial<Record<MarketplacePlatform, { status: string; lastSyncedAt?: string; lastError?: string }>>;
}

/** Products joined with their per-platform sync status, for the catalogue sync dashboard. */
export async function listProductsWithSyncStatus(): Promise<ProductSyncRow[]> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return [];

  const { data: productRows } = await supabase
    .from("products")
    .select("*")
    .eq("craftsman_id", craftsmanId)
    .order("created_at", { ascending: false });

  if (!productRows || productRows.length === 0) return [];

  const { data: listingRows } = await supabase
    .from("marketplace_listings")
    .select("*")
    .in("product_id", productRows.map((p) => p.id));

  const listingsByProduct = new Map<string, ProductSyncRow["listings"]>();
  for (const row of listingRows ?? []) {
    const existing = listingsByProduct.get(row.product_id as string) ?? {};
    existing[row.platform as MarketplacePlatform] = {
      status: row.sync_status as string,
      lastSyncedAt: (row.last_synced_at as string) ?? undefined,
      lastError: (row.last_error as string) ?? undefined,
    };
    listingsByProduct.set(row.product_id as string, existing);
  }

  return productRows.map((row) => ({
    product: {
      id: row.id as string,
      craftsmanId: row.craftsman_id as string,
      name: row.name as string,
      currency: row.currency as string,
      priceType: row.price_type as Product["priceType"],
      availability: row.availability as Product["availability"],
      customizable: Boolean(row.customizable),
      status: row.status as Product["status"],
      price: row.price !== null ? Number(row.price) : undefined,
      stockQuantity: (row.stock_quantity as number) ?? undefined,
      images: [],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    },
    listings: listingsByProduct.get(row.id as string) ?? {},
  }));
}

/** Pushes (or re-pushes) a product's listing to one platform via its adapter. */
export async function pushProductToPlatform(
  productId: string,
  platform: MarketplacePlatform
): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { data: productRow } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("craftsman_id", craftsmanId)
    .maybeSingle();

  if (!productRow) return { success: false, error: "We couldn't find that product." };

  const adapter = getMarketplaceAdapter(platform);
  const result = await adapter.pushListing({
    id: productRow.id,
    craftsmanId: productRow.craftsman_id,
    name: productRow.name,
    currency: productRow.currency,
    priceType: productRow.price_type,
    availability: productRow.availability,
    customizable: productRow.customizable,
    status: productRow.status,
    price: productRow.price ?? undefined,
    stockQuantity: productRow.stock_quantity ?? undefined,
    images: [],
    createdAt: productRow.created_at,
    updatedAt: productRow.updated_at,
  } as Product);

  await supabase.from("marketplace_listings").upsert(
    {
      product_id: productId,
      platform,
      external_listing_id: result.externalListingId ?? null,
      sync_status: result.success ? "listed" : "pending",
      last_synced_at: result.success ? new Date().toISOString() : null,
      last_error: result.success ? null : result.message,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "product_id,platform" }
  );

  await supabase.from("sync_events").insert({
    craftsman_id: craftsmanId,
    product_id: productId,
    platform,
    event_type: "push_listing",
    status: result.success ? "success" : "pending",
    message: result.message,
  });

  return { success: true, error: result.success ? undefined : result.message };
}

/** Pushes a stock quantity change to every platform this product is listed on. */
export async function syncStockToPlatforms(productId: string, quantity: number): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { data: listingRows } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("product_id", productId)
    .neq("sync_status", "not_listed");

  for (const listing of listingRows ?? []) {
    const adapter = getMarketplaceAdapter(listing.platform as MarketplacePlatform);
    const result = await adapter.updateStock(listing.external_listing_id ?? "", quantity);

    await supabase
      .from("marketplace_listings")
      .update({
        last_synced_at: result.success ? new Date().toISOString() : listing.last_synced_at,
        last_error: result.success ? null : result.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listing.id);

    await supabase.from("sync_events").insert({
      craftsman_id: craftsmanId,
      product_id: productId,
      platform: listing.platform,
      event_type: "update_stock",
      status: result.success ? "success" : "pending",
      message: result.message,
    });
  }

  return { success: true };
}

export interface SyncEvent {
  id: string;
  productName?: string;
  platform: MarketplacePlatform;
  eventType: "connect" | "push_listing" | "update_stock";
  status: "success" | "error" | "pending";
  message?: string;
  createdAt: string;
}

/** Recent sync activity for the monitoring section of the catalogue sync page. */
export async function listRecentSyncEvents(limit = 20): Promise<SyncEvent[]> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return [];

  const { data: rows } = await supabase
    .from("sync_events")
    .select("*, products(name)")
    .eq("craftsman_id", craftsmanId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (rows ?? []).map((row) => ({
    id: row.id as string,
    productName: (row.products as { name?: string } | null)?.name,
    platform: row.platform as MarketplacePlatform,
    eventType: row.event_type as SyncEvent["eventType"],
    status: row.status as SyncEvent["status"],
    message: (row.message as string) ?? undefined,
    createdAt: row.created_at as string,
  }));
}
