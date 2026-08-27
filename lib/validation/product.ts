import { z } from "zod";

const requiredText = (label: string, min = 1) =>
  z.string().trim().min(min, `Please enter ${label}.`);
const optionalText = () => z.string().trim().optional().or(z.literal(""));

export const productSchema = z.object({
  name: requiredText("a product name", 2),
  categoryId: optionalText(),
  description: optionalText(),
  materials: optionalText(),
  technique: optionalText(),
  price: z.number().min(0).optional(),
  currency: z.string().trim().default("INR"),
  priceType: z.enum(["fixed", "on_request"]),
  availability: z.enum(["in_stock", "made_to_order", "out_of_stock"]),
  stockQuantity: z.number().int().min(0).optional(),
  minOrderQty: z.number().int().min(1).optional(),
  dimensions: optionalText(),
  weight: optionalText(),
  customizable: z.boolean(),
  productionTime: optionalText(),
  videoUrl: z.string().trim().url("Please enter a valid URL.").optional().or(z.literal("")),
  imageUrls: z.array(z.string().trim().url()).max(8, "You can add up to 8 images.").optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
