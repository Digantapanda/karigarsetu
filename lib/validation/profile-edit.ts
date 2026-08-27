import { z } from "zod";

const requiredText = (label: string, min = 1) =>
  z.string().trim().min(min, `Please enter your ${label}.`);
const optionalText = () => z.string().trim().optional().or(z.literal(""));

export const profileEditSchema = z.object({
  craftsmanName: requiredText("craftsman / business name", 2),
  yearsOfExperience: z.number().int().min(0).max(80).optional(),
  registrationNumber: optionalText(),
  registrationAuthority: optionalText(),
  shopName: optionalText(),
  businessAddress: optionalText(),
  villageTown: requiredText("village or town"),
  district: requiredText("district"),
  state: requiredText("state"),
  pinCode: z.string().trim().regex(/^\d{6}$/, "PIN code should be 6 digits.").optional().or(z.literal("")),
  gstNumber: z
    .string()
    .trim()
    .regex(/^[0-9A-Z]{15}$/, "GST number should be 15 characters.")
    .optional()
    .or(z.literal("")),
  gstPublic: z.boolean(),
  registrationPublic: z.boolean(),
  shopContactNumber: optionalText(),
  primaryCraftCategoryId: requiredText("primary craft"),
  secondaryCraftCategoryId: optionalText(),
  craftTradition: optionalText(),
  description: optionalText(),
  geographicRegion: optionalText(),
  photoUrl: z.string().trim().url("Please enter a valid URL.").optional().or(z.literal("")),
});

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
