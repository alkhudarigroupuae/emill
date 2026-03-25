import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function TermsPage() {
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <Card className="p-7 md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Terms
          </h1>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)] md:text-base">
            Donations are voluntary and may not be refundable. Subscriptions can be managed
            through the billing portal. Medical reports and stories are published for
            transparency and may be edited for safety and privacy.
          </div>
        </Card>
      </Container>
    </div>
  );
}

