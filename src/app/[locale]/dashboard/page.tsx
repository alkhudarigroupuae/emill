import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/signOutButton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/locale";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/${params.locale}/auth/signin?callbackUrl=/${params.locale}/dashboard`);
  }

  const [user, donations, subscription, saved] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, twoFactorEnabled: true, stripeCustomerId: true },
    }),
    prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.subscription.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.savedAnimal.findMany({
      where: { userId },
      include: { animal: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  if (!user) redirect(`/${params.locale}/auth/signin`);

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Dashboard
            </h1>
            <div className="text-sm text-[color:var(--muted)]">
              {user.email}
            </div>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Card className="p-7">
              <div className="text-lg font-semibold tracking-tight">Security</div>
              <div className="mt-3 text-sm text-[color:var(--muted)]">
                2FA is {user.twoFactorEnabled ? "enabled" : "disabled"}.
              </div>
              <a
                href={`/${params.locale}/dashboard/security/2fa`}
                className="mt-5 inline-flex text-sm font-medium text-[color:var(--accent)] hover:underline"
              >
                Manage 2FA
              </a>
            </Card>

            <Card className="mt-6 p-7">
              <div className="text-lg font-semibold tracking-tight">
                Subscription
              </div>
              <div className="mt-3 text-sm text-[color:var(--muted)]">
                {subscription
                  ? `${subscription.tier} • ${subscription.status}`
                  : "No active subscription"}
              </div>
              {user.stripeCustomerId ? (
                <form
                  className="mt-5"
                  action={`/api/stripe/portal`}
                  method="post"
                >
                  <button className="text-sm font-medium text-[color:var(--accent)] hover:underline">
                    Open billing portal
                  </button>
                </form>
              ) : null}
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="p-7">
              <div className="text-lg font-semibold tracking-tight">
                Donation history
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {donations.length ? (
                  donations.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-4"
                    >
                      <div className="flex flex-col">
                        <div className="text-sm font-medium tracking-tight">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: d.currency.toUpperCase(),
                          }).format(d.amountCents / 100)}
                        </div>
                        <div className="text-xs text-[color:var(--muted)]">
                          {new Date(d.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-[color:var(--muted)]">
                        {d.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[color:var(--muted)]">
                    No donations yet.
                  </div>
                )}
              </div>
            </Card>

            <Card className="mt-6 p-7">
              <div className="text-lg font-semibold tracking-tight">
                Saved animals
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {saved.length ? (
                  saved.map((s) => (
                    <a
                      key={`${s.userId}:${s.animalId}`}
                      href={`/${params.locale}/animals/${s.animal.slug}`}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-4 hover:bg-[color:rgba(255,255,255,0.05)]"
                    >
                      <div className="text-sm font-medium tracking-tight">
                        {s.animal.name}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">
                        {s.animal.species} • {s.animal.location}
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-[color:var(--muted)]">
                    Save animals to follow their recovery.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
