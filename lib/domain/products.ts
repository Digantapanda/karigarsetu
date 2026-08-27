import { createClient } from "@/lib/supabase/server";
import { productSchema, type ProductFormValues } from "@/lib/validation/product";
import { CRAFT_CATEGORIES } from "@/lib/domain/craft-categories";
import type { Product, ProductImage } from "@/types/domain";
import type { DomainActionResult } from "@/lib/domain/craftsman";

/** Returns the signed-in user's own craftsman_profiles.id, or null. */
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

function mapProductRow(row: Record<string, unknown>, images: ProductImage[]): Product {
  const categoryById = new Map(CRAFT_CATEGORIES.map((c) => [c.id, c]));
  return {
    id: row.id as string,
    craftsmanId: row.craftsman_id as string,
    name: row.name as string,
    categoryId: (row.category_id as string) ?? undefined,
    category: row.category_id ? categoryById.get(row.category_id as string) : undefined,
    description: (row.description as string) ?? undefined,
    materials: (row.materials as string) ?? undefined,
    technique: (row.technique as string) ?? undefined,
    price: row.price !== null ? Number(row.price) : undefined,
    currency: row.currency as string,
    priceType: row.price_type as Product["priceType"],
    availability: row.availability as Product["availability"],
    stockQuantity: (row.stock_quantity as number) ?? undefined,
    minOrderQty: (row.min_order_qty as number) ?? undefined,
    dimensions: (row.dimensions as string) ?? undefined,
    weight: (row.weight as string) ?? undefined,
    customizable: Boolean(row.customizable),
    productionTime: (row.production_time as string) ?? undefined,
    videoUrl: (row.video_url as string) ?? undefined,
    status: row.status as Product["status"],
    images,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapImageRow(row: Record<string, unknown>): ProductImage {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    imageUrl: row.image_url as string,
    sortOrder: row.sort_order as number,
    altText: (row.alt_text as string) ?? undefined,
  };
}

/** Lists every product (any status) belonging to the signed-in craftsman, for the dashboard. */
export async function listMyProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return [];

  const { data: rows } = await supabase
    .from("products")
    .select("*")
    .eq("craftsman_id", craftsmanId)
    .order("created_at", { ascending: false });

  if (!rows) return [];

  const { data: imageRows } = await supabase
    .from("product_images")
    .select("*")
    .in("product_id", rows.map((r) => r.id));

  const imagesByProduct = new Map<string, ProductImage[]>();
  for (const img of imageRows ?? []) {
    const list = imagesByProduct.get(img.product_id as string) ?? [];
    list.push(mapImageRow(img));
    imagesByProduct.set(img.product_id as string, list);
  }

  return rows.map((row) => mapProductRow(row, imagesByProduct.get(row.id as string) ?? []));
}

/** Fetches one of the signed-in craftsman's own products (any status), for the edit page. */
export async function getMyProduct(productId: string): Promise<Product | null> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return null;

  const { data: row } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("craftsman_id", craftsmanId)
    .maybeSingle();

  if (!row) return null;

  const { data: imageRows } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  return mapProductRow(row, (imageRows ?? []).map(mapImageRow));
}

/** Published products for a given craftsman -- powers the public profile page. */
export async function listPublishedProducts(craftsmanId: string): Promise<Product[]> {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("products")
    .select("*")
    .eq("craftsman_id", craftsmanId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (!rows || rows.length === 0) return [];

  const { data: imageRows } = await supabase
    .from("product_images")
    .select("*")
    .in("product_id", rows.map((r) => r.id))
    .order("sort_order", { ascending: true });

  const imagesByProduct = new Map<string, ProductImage[]>();
  for (const img of imageRows ?? []) {
    const list = imagesByProduct.get(img.product_id as string) ?? [];
    list.push(mapImageRow(img));
    imagesByProduct.set(img.product_id as string, list);
  }

  return rows.map((row) => mapProductRow(row, imagesByProduct.get(row.id as string) ?? []));
}

export interface CreateProductResult extends DomainActionResult {
  productId?: string;
}

export async function createProduct(input: ProductFormValues): Promise<CreateProductResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Some details are missing or invalid. Please check the form." };
  }

  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to add a product." };

  const values = parsed.data;
  const { data: row, error } = await supabase
    .from("products")
    .insert({
      craftsman_id: craftsmanId,
      name: values.name,
      category_id: values.categoryId || null,
      description: values.description || null,
      materials: values.materials || null,
      technique: values.technique || null,
      price: values.price ?? null,
      currency: values.currency || "INR",
      price_type: values.priceType,
      availability: values.availability,
      stock_quantity: values.stockQuantity ?? null,
      min_order_qty: values.minOrderQty ?? null,
      dimensions: values.dimensions || null,
      weight: values.weight || null,
      customizable: values.customizable,
      production_time: values.productionTime || null,
      video_url: values.videoUrl || null,
      status: "draft",
    })
    .select()
    .single();

  if (error || !row) {
    return { success: false, error: "We couldn't save this product. Please try again." };
  }

  if (values.imageUrls && values.imageUrls.length > 0) {
    await supabase.from("product_images").insert(
      values.imageUrls.map((url, i) => ({
        product_id: row.id,
        image_url: url,
        sort_order: i,
      }))
    );
  }

  return { success: true, productId: row.id as string };
}

export async function updateProduct(
  productId: string,
  input: ProductFormValues
): Promise<DomainActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Some details are missing or invalid. Please check the form." };
  }

  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to edit this product." };

  const values = parsed.data;
  const { error } = await supabase
    .from("products")
    .update({
      name: values.name,
      category_id: values.categoryId || null,
      description: values.description || null,
      materials: values.materials || null,
      technique: values.technique || null,
      price: values.price ?? null,
      currency: values.currency || "INR",
      price_type: values.priceType,
      availability: values.availability,
      stock_quantity: values.stockQuantity ?? null,
      min_order_qty: values.minOrderQty ?? null,
      dimensions: values.dimensions || null,
      weight: values.weight || null,
      customizable: values.customizable,
      production_time: values.productionTime || null,
      video_url: values.videoUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .eq("craftsman_id", craftsmanId);

  if (error) return { success: false, error: "We couldn't save your changes. Please try again." };

  if (values.imageUrls) {
    await supabase.from("product_images").delete().eq("product_id", productId);
    if (values.imageUrls.length > 0) {
      await supabase.from("product_images").insert(
        values.imageUrls.map((url, i) => ({ product_id: productId, image_url: url, sort_order: i }))
      );
    }
  }

  return { success: true };
}

export async function setProductStatus(
  productId: string,
  status: Product["status"]
): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { error } = await supabase
    .from("products")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("craftsman_id", craftsmanId);

  if (error) return { success: false, error: "We couldn't update this product. Please try again." };
  return { success: true };
}

export async function deleteProduct(productId: string): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("craftsman_id", craftsmanId);

  if (error) return { success: false, error: "We couldn't remove this product. Please try again." };
  return { success: true };
}

/** Updates just the stock quantity -- used both by the products dashboard and catalogue sync. */
export async function updateStockQuantity(
  productId: string,
  quantity: number
): Promise<DomainActionResult> {
  const supabase = await createClient();
  const craftsmanId = await getOwnCraftsmanId(supabase);
  if (!craftsmanId) return { success: false, error: "You need to sign in to do that." };

  const { error } = await supabase
    .from("products")
    .update({
      stock_quantity: quantity,
      availability: quantity > 0 ? "in_stock" : "out_of_stock",
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .eq("craftsman_id", craftsmanId);

  if (error) return { success: false, error: "We couldn't update stock. Please try again." };
  return { success: true };
}
