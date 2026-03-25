import Stripe from "stripe";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function mapSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "ACTIVE" as const;
    case "past_due":
      return "PAST_DUE" as const;
    case "canceled":
      return "CANCELED" as const;
    case "unpaid":
      return "UNPAID" as const;
    case "incomplete":
    case "incomplete_expired":
    case "trialing":
    default:
      return "INCOMPLETE" as const;
  }
}

export async function POST(req: Request) {
  const env = getEnv();
  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const kind = session.metadata?.kind;

    if (kind === "donation") {
      const amountCents = session.amount_total ?? 0;
      const currency = session.currency ?? "usd";
      const userId = session.metadata?.userId ? session.metadata.userId : null;
      const animalSlug = session.metadata?.animalSlug ?? "";
      const emergency = session.metadata?.emergency === "1";

      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : null;

      await prisma.donation.upsert({
        where: {
          stripeCheckoutSessionId: session.id,
        },
        update: {
          amountCents,
          currency,
          status: session.payment_status === "paid" ? "SUCCEEDED" : "PENDING",
          stripePaymentIntentId: paymentIntentId,
          userId,
        },
        create: {
          amountCents,
          currency,
          status: session.payment_status === "paid" ? "SUCCEEDED" : "PENDING",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
          userId,
        },
      });

      if (animalSlug) {
        const animal = await prisma.animal.findUnique({ where: { slug: animalSlug } });
        if (animal) {
          await prisma.sponsorPledge.upsert({
            where: { stripeCheckoutSessionId: session.id },
            update: { amountCents, currency, userId },
            create: {
              animalId: animal.id,
              amountCents,
              currency,
              userId,
              stripeCheckoutSessionId: session.id,
            },
          });
        }
      }

      if (emergency) {
        await prisma.donation.updateMany({
          where: { stripeCheckoutSessionId: session.id },
          data: { status: session.payment_status === "paid" ? "SUCCEEDED" : "PENDING" },
        });
      }
    }

    if (kind === "subscription") {
      const userId = session.metadata?.userId ? session.metadata.userId : null;
      const tier = session.metadata?.tier as "SUPPORTER" | "GUARDIAN" | "HERO" | undefined;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;
      const customerId = typeof session.customer === "string" ? session.customer : null;

      if (userId && tier && subscriptionId && customerId) {
        const sub = (await stripe.subscriptions.retrieve(
          subscriptionId,
        )) as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id;
        const periodEnd = sub.items.data[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000)
          : null;

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          update: {
            status: mapSubscriptionStatus(sub.status),
            tier,
            stripePriceId: priceId ?? "",
            currentPeriodEnd: periodEnd,
          },
          create: {
            userId,
            tier,
            status: mapSubscriptionStatus(sub.status),
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId ?? "",
            currentPeriodEnd: periodEnd,
          },
        });
      }
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const subscriptionId = sub.id;
    const periodEnd = sub.items.data[0]?.current_period_end
      ? new Date(sub.items.data[0].current_period_end * 1000)
      : null;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: mapSubscriptionStatus(sub.status),
        currentPeriodEnd: periodEnd,
      },
    });
  }

  return new Response("ok", { status: 200 });
}
