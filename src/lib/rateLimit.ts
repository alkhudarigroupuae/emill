import { LRUCache } from "lru-cache";

type RateKey = string;

const buckets = new LRUCache<RateKey, { tokens: number; last: number }>({
  max: 5000,
  ttl: 1000 * 60 * 10,
});

export function rateLimitOrThrow(params: {
  key: string;
  windowMs: number;
  max: number;
}) {
  const now = Date.now();
  const bucket = buckets.get(params.key) ?? { tokens: params.max, last: now };

  const elapsed = now - bucket.last;
  if (elapsed > 0) {
    const refill = (elapsed / params.windowMs) * params.max;
    bucket.tokens = Math.min(params.max, bucket.tokens + refill);
    bucket.last = now;
  }

  if (bucket.tokens < 1) {
    buckets.set(params.key, bucket);
    throw new Error("RATE_LIMITED");
  }

  bucket.tokens -= 1;
  buckets.set(params.key, bucket);
}
