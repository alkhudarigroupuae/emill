import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { getSession } from "@/lib/session";
import { DonateClient } from "./donateClient";

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { animal?: string; emergency?: string };
}) {
  const session = await getSession();
  const signedIn = !!session?.user?.id;
  const animalSlug = searchParams.animal;
  const emergency = searchParams.emergency === "1";

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Donate
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Secure Stripe checkout for one-time donations and monthly support.
          </p>
        </div>

        {animalSlug ? (
          <Card className="mt-8 p-7">
            <div className="text-lg font-semibold tracking-tight">
              Sponsoring: {animalSlug}
            </div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">
              Your support goes directly toward treatment, rehab, food, and ongoing care.
            </div>
          </Card>
        ) : null}

        <div className="mt-8">
          <DonateClient
            locale={params.locale}
            signedIn={signedIn}
            animalSlug={animalSlug}
            emergency={emergency}
          />
        </div>
      </Container>
    </div>
  );
}

