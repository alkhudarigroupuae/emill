import Stripe from "stripe";
import { getEnv } from "@/lib/env";

let cached: Stripe | null = null;

export function getStripe() {
  if (cached) return cached;
  const env = getEnv();
  cached = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
  return cached;
}
