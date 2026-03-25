import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().max(254),
  password: z.string().min(10).max(200),
});

export const donationCheckoutSchema = z.object({
  amountCents: z.number().int().min(100).max(2_000_000),
  currency: z.string().min(3).max(10).default("usd"),
  animalSlug: z.string().min(1).max(120).optional(),
  emergency: z.boolean().optional(),
});

export const subscriptionCheckoutSchema = z.object({
  tier: z.enum(["SUPPORTER", "GUARDIAN", "HERO"]),
});

export const twoFactorConfirmSchema = z.object({
  token: z.string().min(6).max(8),
});

