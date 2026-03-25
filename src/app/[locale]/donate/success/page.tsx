import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function DonateSuccessPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { session_id?: string };
}) {
  const id = searchParams.session_id;
  const session = await (async () => {
    if (!id) return null;
    try {
      const stripe = getStripe();
      return await stripe.checkout.sessions.retrieve(id);
    } catch {
      return null;
    }
  })();

  const amount = session?.amount_total
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: (session.currency ?? "usd").toUpperCase(),
      }).format(session.amount_total / 100)
    : null;

  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-2xl">
        <Card className="p-7">
          <div className="text-xl font-semibold tracking-tight">Thank you</div>
          <div className="mt-2 text-sm text-[color:var(--muted)]">
            {amount ? `Donation confirmed: ${amount}.` : "Your payment was received."}
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href={`/${params.locale}/animals`}
              className="h-12 rounded-full bg-[color:var(--accent)] px-6 text-sm font-medium text-black hover:bg-[color:var(--accent-2)] inline-flex items-center"
            >
              Continue to animals
            </a>
            <a
              href={`/${params.locale}/dashboard`}
              className="h-12 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 text-sm font-medium text-[color:var(--fg)] hover:bg-[color:var(--surface-2)] inline-flex items-center"
            >
              Dashboard
            </a>
          </div>
        </Card>
      </Container>
    </div>
  );
}
