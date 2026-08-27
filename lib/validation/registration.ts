import { z } from "zod";

// Plain-language error messages only -- never surface raw validator internals
// to the user (see architecture doc, §35 Error Handling).

const requiredText = (label: string, min = 1) =>
  z.string().trim().min(min, `Please enter your ${label}.`);

const indianMobile = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number.");

const optionalText = () => z.string().trim().optional().or(z.literal(""));

export const basicAccountSchema = z.object({
  fullName: requiredText("full name", 2),
  email: z.string().trim().email("Please enter a valid email address."),
  mobileNumber: indianMobile,
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password should include at least one letter.")
    .regex(/[0-9]/, "Password should include at least one number."),
});

export const craftsmanInfoSchema = z.object({
  craftsmanName: requiredText("craftsman / business name", 2),
  registrationNumber: optionalText(),
  registrationAuthority: optionalText(),
  craftCategoryId: requiredText("craft category"),
  yearsOfExperience: z
    .number()
    .int()
    .min(0)
    .max(80)
    .optional(),
});

export const businessInfoSchema = z.object({
  shopName: optionalText(),
  businessAddress: optionalText(),
  villageTown: requiredText("village or town"),
  district: requiredText("district"),
  state: requiredText("state"),
  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "PIN code should be 6 digits.")
    .optional()
    .or(z.literal("")),
  gstNumber: z
    .string()
    .trim()
    .regex(/^[0-9A-Z]{15}$/, "GST number should be 15 characters.")
    .optional()
    .or(z.literal("")),
  shopContactNumber: optionalText(),
});

export const craftInfoSchema = z.object({
  primaryCraftCategoryId: requiredText("primary craft"),
  secondaryCraftCategoryId: optionalText(),
  craftTradition: optionalText(),
  craftDescription: optionalText(),
  geographicRegion: optionalText(),
});

export const recognitionSchema = z.object({
  giTag: z.boolean(),
  giTagName: optionalText(),
  giReferenceNumber: optionalText(),
  nationalAward: optionalText(),
  stateAward: optionalText(),
  otherRecognition: optionalText(),
});

export const registrationSchema = z.object({
  account: basicAccountSchema,
  craftsmanInfo: craftsmanInfoSchema,
  businessInfo: businessInfoSchema,
  craftInfo: craftInfoSchema,
  recognition: recognitionSchema,
});

export type BasicAccountValues = z.infer<typeof basicAccountSchema>;
export type CraftsmanInfoValues = z.infer<typeof craftsmanInfoSchema>;
export type BusinessInfoValues = z.infer<typeof businessInfoSchema>;
export type CraftInfoValues = z.infer<typeof craftInfoSchema>;
export type RecognitionValues = z.infer<typeof recognitionSchema>;
