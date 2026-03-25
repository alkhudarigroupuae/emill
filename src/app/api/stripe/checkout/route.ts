import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { getSession } from "@/lib/session";
import { donationCheckoutSchema, subscriptionCheckoutSchema } from "@/lib/validators";
import { isLocale } from "@/lib/locale";

type Payload =
  | {
      kind: "donation";
      amountCents: number;
      currency?: string;
      animalSlug?: string;
      emergency?: boolean;
      locale?: string;
    }
  | {
      kind: "subscription";
      tier: "SUPPORTER" | "GUARDIAN" | "HERO";
      locale?: string;
    };

function getLocale(raw: string | undefined) {
  if (!raw) return "en";
  return isLocale(raw) ? raw : "en";
}

export async function POST(req: Request) {
  const env = getEnv();
  const stripe = getStripe();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    rateLimitOrThrow({ key: `stripe-checkout:${ip}`, windowMs: 60_000, max: 30 });
  } catch {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = (await req.json().catch(() => null)) as Payload | null;
  if (!json) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const locale = getLocale(json.locale);
  const origin = new URL(req.url).origin;
  const successUrl = `${origin}/${locale}/donate/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/${locale}/donate`;

  const session = await getSession();
  const userId = session?.user?.id ?? null;

  let stripeCustomerId: string | undefined;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true, name: true },
    });
    if (user) {
      stripeCustomerId = user.stripeCustomerId ?? undefined;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name ?? undefined,
        });
        stripeCustomerId = customer.id;
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId },
        });
      }
    }
  }

  if (json.kind === "donation") {
    const parsed = donationCheckoutSchema.safeParse({
      amountCents: json.amountCents,
      currency: json.currency ?? "usd",
      animalSlug: json.animalSlug,
      emergency: json.emergency,
    });
    if (!parsed.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const productName = parsed.data.emergency
      ? "Emergency donation"
      : parsed.data.animalSlug
        ? `Sponsor: ${parsed.data.animalSlug}`
        : "Donation";

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : session?.user?.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: parsed.data.currency,
            unit_amount: parsed.data.amountCents,
            product_data: {
              name: productName,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "donation",
        userId: userId ?? "",
        animalSlug: parsed.data.animalSlug ?? "",
        emergency: parsed.data.emergency ? "1" : "0",
        locale,
      },
      payment_intent_data: {
        metadata: {
          kind: "donation",
          userId: userId ?? "",
          animalSlug: parsed.data.animalSlug ?? "",
          emergency: parsed.data.emergency ? "1" : "0",
          locale,
        },
      },
    });

    return Response.json({ url: checkout.url }, { status: 200 });
  }

  const parsed = subscriptionCheckoutSchema.safeParse({ tier: json.tier });
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const priceId =
    parsed.data.tier === "SUPPORTER"
      ? env.STRIPE_PRICE_SUPPORTER
      : parsed.data.tier === "GUARDIAN"
        ? env.STRIPE_PRICE_GUARDIAN
        : env.STRIPE_PRICE_HERO;

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId ? undefined : session?.user?.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    metadata: {
      kind: "subscription",
      tier: parsed.data.tier,
      userId: userId ?? "",
      locale,
    },
    subscription_data: {
      metadata: {
        kind: "subscription",
        tier: parsed.data.tier,
        userId: userId ?? "",
        locale,
      },
    },
  });

  return Response.json({ url: checkout.url }, { status: 200 });
}
