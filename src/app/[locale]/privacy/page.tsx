import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <Card className="p-7 md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Privacy
          </h1>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)] md:text-base">
            We collect only what we need to run donations, subscriptions, and user accounts.
            Payments are handled by Stripe. We do not store full card details.
            \n\nContact us if you need data access or deletion.
          </div>
          <a
            href={`/${params.locale}/contact`}
            className="mt-8 inline-flex text-sm font-medium text-[color:var(--accent)] hover:underline"
          >
            Contact
          </a>
        </Card>
      </Container>
    </div>
  );
}

