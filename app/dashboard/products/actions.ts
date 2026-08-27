"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  setProductStatus,
  deleteProduct,
  updateStockQuantity,
} from "@/lib/domain/products";
import type { ProductFormValues } from "@/lib/validation/product";
import type { Product } from "@/types/domain";

export async function submitCreateProduct(input: ProductFormValues) {
  const result = await createProduct(input);
  if (result.success) revalidatePath("/dashboard/products");
  return result;
}

export async function submitUpdateProduct(productId: string, input: ProductFormValues) {
  const result = await updateProduct(productId, input);
  if (result.success) {
    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}/edit`);
  }
  return result;
}

export async function submitSetProductStatus(productId: string, status: Product["status"]) {
  const result = await setProductStatus(productId, status);
  if (result.success) revalidatePath("/dashboard/products");
  return result;
}

export async function submitDeleteProduct(productId: string) {
  const result = await deleteProduct(productId);
  if (result.success) revalidatePath("/dashboard/products");
  return result;
}

export async function submitUpdateStock(productId: string, quantity: number) {
  const result = await updateStockQuantity(productId, quantity);
  if (result.success) {
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/catalogue-sync");
  }
  return result;
}
