import { z } from "zod";

const nonEmpty = z.string().min(1);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  DATABASE_URL: nonEmpty,
  NEXTAUTH_URL: nonEmpty.optional(),
  NEXTAUTH_SECRET: nonEmpty,
  ENCRYPTION_KEY: nonEmpty,
  STRIPE_SECRET_KEY: nonEmpty,
  STRIPE_WEBHOOK_SECRET: nonEmpty,
  STRIPE_PRICE_SUPPORTER: nonEmpty,
  STRIPE_PRICE_GUARDIAN: nonEmpty,
  STRIPE_PRICE_HERO: nonEmpty,
  STRIPE_DONATION_PRICE: nonEmpty.optional(),
  CLOUDINARY_CLOUD_NAME: nonEmpty.optional(),
  CLOUDINARY_API_KEY: nonEmpty.optional(),
  CLOUDINARY_API_SECRET: nonEmpty.optional(),
  CONVEX_URL: nonEmpty.optional(),
  CONVEX_HTTP_ACTIONS_URL: nonEmpty.optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) throw parsed.error;
  cached = parsed.data;
  return cached;
}
