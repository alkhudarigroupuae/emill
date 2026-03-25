import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function ContactPage() {
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-3xl">
        <Card className="p-7 md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Contact
          </h1>
          <div className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
            For partnerships, veterinarian verification, urgent cases, or media requests:
            <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-5">
              <div className="text-sm font-medium tracking-tight text-[color:var(--fg)]">
                Email
              </div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                support@rescue.org
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

