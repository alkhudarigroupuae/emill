import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { isLocale } from "@/lib/locale";

function getLocaleFromReferer(req: Request) {
  const ref = req.headers.get("referer");
  if (!ref) return "en";
  try {
    const url = new URL(ref);
    const segment = url.pathname.split("/")[1] ?? "";
    return isLocale(segment) ? segment : "en";
  } catch {
    return "en";
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = getStripe();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) {
    return Response.json({ error: "No Stripe customer" }, { status: 400 });
  }

  const locale = getLocaleFromReferer(req);
  const origin = new URL(req.url).origin;
  const returnUrl = `${origin}/${locale}/dashboard`;

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  });

  return Response.redirect(portal.url, 303);
}
