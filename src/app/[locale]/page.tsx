import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { LiveDonationCounter } from "@/components/stats/liveDonationCounter";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>, fallback: T) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function getStats() {
  const [rescued, treated, countries, donated] = await Promise.all([
    safe(() => prisma.animal.count(), 128),
    safe(() => prisma.animal.count({ where: { reports: { some: {} } } }), 94),
    safe(
      () =>
        prisma.animal
          .findMany({ distinct: ["country"], select: { country: true } })
          .then((rows) => rows.filter((r) => r.country).length),
      12,
    ),
    safe(
      () =>
        prisma.donation.aggregate({
          _sum: { amountCents: true },
          where: { status: "SUCCEEDED" },
        }),
      { _sum: { amountCents: 2_450_000 } },
    ),
  ]);

  return {
    rescued,
    treated,
    countries,
    donatedCents: donated._sum.amountCents ?? 0,
  };
}

export default async function Home({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getMessages(params.locale);
  const stats = await getStats();

  const featured = await safe(
    () =>
      prisma.animal.findMany({
        orderBy: [
          { warAffected: "desc" },
          { rescueDate: "desc" },
          { createdAt: "desc" },
        ],
        take: 3,
        select: {
          id: true,
          slug: true,
          name: true,
          species: true,
          location: true,
          warAffected: true,
          coverImageUrl: true,
          afterImageUrl: true,
          summary: true,
        },
      }),
    [
      {
        id: "demo-1",
        slug: "amira",
        name: "Amira",
        species: "DOG" as const,
        location: "Kharkiv Field Clinic",
        warAffected: true,
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Found near a collapsed building with shrapnel wounds and dehydration. Stabilized and recovering under intensive care.",
      },
      {
        id: "demo-2",
        slug: "saffron",
        name: "Saffron",
        species: "CAT" as const,
        location: "Border Evacuation Shelter",
        warAffected: true,
        coverImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Rescued from an abandoned apartment block. Treated for smoke inhalation and eye irritation.",
      },
      {
        id: "demo-3",
        slug: "atlas",
        name: "Atlas",
        species: "HORSE" as const,
        location: "Rural Recovery Ranch",
        warAffected: false,
        coverImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Arrived malnourished after severe neglect. Completed rehab with nutrition support and farrier care.",
      },
    ],
  );

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(214,180,106,0.20),transparent_55%),radial-gradient(900px_circle_at_80%_40%,rgba(172,98,70,0.10),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.92))]" />
        </div>

        <Container className="relative py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:rgba(214,180,106,0.35)] bg-[color:rgba(214,180,106,0.08)] px-4 py-2 text-xs text-[color:var(--fg)]">
                War-zone triage • Medical transparency • Verified impact
              </div>

              <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl">
                {t.hero.headline}
              </h1>

              <p className="max-w-xl text-pretty text-base leading-7 text-[color:var(--muted)] md:text-lg">
                {t.hero.subheadline}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href={`/${params.locale}/donate`}>{t.hero.donate}</Button>
                <Button href={`/${params.locale}/donate#monthly`} variant="secondary">
                  {t.hero.monthly}
                </Button>
              </div>
            </div>

            <Card className="relative overflow-hidden">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={
                    featured[0]?.coverImageUrl ??
                    featured[0]?.afterImageUrl ??
                    "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2200&q=70"
                  }
                  alt="Rescued animal"
                  fill
                  className="object-cover opacity-95"
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),transparent_55%)]" />
              </div>
              <div className="p-7">
                <div className="text-sm text-[color:var(--muted)]">
                  Featured mission
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight">
                  {featured[0]?.name ?? "Field Rescue"}
                </div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {featured[0]?.summary ??
                    "Every case is documented with timelines, veterinarian notes, and progress logs."}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-10 grid gap-4 md:mt-16 md:grid-cols-4">
            <Card className="p-6">
              <div className="text-sm text-[color:var(--muted)]">{t.stats.rescued}</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">
                {stats.rescued.toLocaleString()}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-[color:var(--muted)]">{t.stats.treated}</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">
                {stats.treated.toLocaleString()}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-[color:var(--muted)]">
                {t.stats.countries}
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">
                {stats.countries.toLocaleString()}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-[color:var(--muted)]">{t.stats.donated}</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">
                <LiveDonationCounter
                  initialAmountCents={stats.donatedCents}
                  currency="usd"
                />
              </div>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12">
            <Card className="md:col-span-7 overflow-hidden">
              <div className="grid gap-6 p-7 md:grid-cols-5 md:items-center">
                <div className="md:col-span-3">
                  <div className="text-sm text-[color:var(--muted)]">Shelter</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    A safe place for abandoned dogs and cats
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--muted)]">
                    We have created a shelter for homeless dogs and cats who, during this difficult and tense time, were heartlessly abandoned on the streets by many people and left behind. These animals now urgently need care, medical treatment, food, and a safe place where they can feel warmth and protection again.
                    {"\n\n"}
                    If you have the opportunity and the kindness to help, you can make a donation to support the care of our animals. And if you have been thinking about giving a loving home to a faithful companion, we would be happy to hear from anyone interested in adopting one of our wonderful dogs or cats.
                    {"\n\n"}
                    Every help matters. Every kind heart can save a life.
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button href={`/${params.locale}/donate?emergency=1`}>Donate</Button>
                    <Button href={`/${params.locale}/contact`} variant="secondary">
                      Adopt / Contact us
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-black">
                    <Image
                      src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=70"
                      alt="Abandoned animal needing care"
                      fill
                      className="object-cover opacity-95"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.70),transparent_70%)]" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-5 overflow-hidden">
              <div className="relative aspect-[16/10] bg-black">
                <video
                  className="h-full w-full object-cover opacity-95"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  poster={
                    featured[0]?.coverImageUrl ??
                    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=70"
                  }
                >
                  <source
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.80),transparent_60%)]" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-sm text-[color:var(--muted)]">Story</div>
                  <div className="mt-1 text-lg font-semibold tracking-tight">
                    Field rescue, triage, treatment — documented end to end.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Rescue Stories
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
                Each profile includes rescue context, verified medical reporting, and a recovery timeline.
              </p>
            </div>
            <Button href={`/${params.locale}/animals`} variant="secondary" size="sm">
              View all
            </Button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((a) => (
              <a
                key={a.id}
                href={`/${params.locale}/animals/${a.slug}`}
                className="group"
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={a.coverImageUrl ?? a.afterImageUrl}
                      alt={a.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.80),transparent_65%)]" />
                    {a.warAffected ? (
                      <div className="absolute left-5 top-5 rounded-full border border-[color:rgba(214,180,106,0.4)] bg-[color:rgba(214,180,106,0.12)] px-3 py-1 text-xs">
                        War zone
                      </div>
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="text-lg font-semibold tracking-tight">
                      {a.name}
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--muted)]">
                      {a.species} • {a.location}
                    </div>
                    <div className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
                      {a.summary}
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
