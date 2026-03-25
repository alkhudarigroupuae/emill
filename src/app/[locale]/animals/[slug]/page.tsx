import { notFound } from "next/navigation";
import Image from "next/image";
import { SaveAnimalButton } from "@/components/animals/saveAnimalButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>, fallback: T) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function AnimalProfilePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const fallbackHero =
    params.slug === "saffron" || params.slug === "lina" || params.slug === "noura"
      ? "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2200&q=70"
      : params.slug === "atlas" || params.slug === "zahra"
        ? "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2200&q=70"
        : "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2200&q=70";

  const animal =
    (await safe(
      () =>
        prisma.animal.findUnique({
          where: { slug: params.slug },
          include: {
            recoveryEvents: { orderBy: { happenedAt: "asc" } },
            reports: {
              orderBy: { publishedAt: "desc" },
              include: { veterinarian: true },
            },
          },
        }),
      null,
    )) ??
    ({
      id: "demo",
      slug: params.slug,
      name:
        params.slug === "amira"
          ? "Amira"
          : params.slug === "saffron"
            ? "Saffron"
            : params.slug === "atlas"
              ? "Atlas"
              : params.slug === "milo"
                ? "Milo"
                : params.slug === "lina"
                  ? "Lina"
                  : params.slug === "ember"
                    ? "Ember"
                    : params.slug === "noura"
                      ? "Noura"
                      : params.slug === "zahra"
                        ? "Zahra"
                        : params.slug === "rio"
                          ? "Rio"
                          : "Rescue",
      species:
        params.slug === "saffron" || params.slug === "lina" || params.slug === "noura"
          ? "CAT"
          : params.slug === "atlas" || params.slug === "zahra"
            ? "HORSE"
            : "DOG",
      sex: "UNKNOWN",
      location:
        params.slug === "saffron"
          ? "Border Evacuation Shelter"
          : params.slug === "atlas"
            ? "Rural Recovery Ranch"
            : params.slug === "milo"
              ? "Coastal Treatment Unit"
              : params.slug === "lina"
                ? "Temporary Foster Network"
                : params.slug === "ember"
                  ? "Mobile Field Clinic"
                  : params.slug === "noura"
                    ? "Emergency Intake Shelter"
                    : params.slug === "zahra"
                      ? "Rehab Stable"
                      : params.slug === "rio"
                        ? "Urban Rescue Partner Shelter"
                        : "Field Intake",
      country:
        params.slug === "saffron"
          ? "Syria"
          : params.slug === "atlas"
            ? "Poland"
            : params.slug === "milo"
              ? "Turkey"
              : params.slug === "lina"
                ? "Lebanon"
                : params.slug === "ember"
                  ? "Ukraine"
                  : params.slug === "noura"
                    ? "Syria"
                    : params.slug === "zahra"
                      ? "Romania"
                      : params.slug === "rio"
                        ? "Iraq"
                        : "—",
      warAffected:
        params.slug === "amira" ||
        params.slug === "saffron" ||
        params.slug === "ember" ||
        params.slug === "noura" ||
        params.slug === "rio",
      rescueDate: null,
      status: params.slug === "atlas" ? "RECOVERED" : params.slug === "rio" ? "STABLE" : "RECOVERING",
      summary:
        "This is a preview profile. Connect DATABASE_URL and run migrations + seed to see live records, reports, and timelines.",
      beforeImageUrl: fallbackHero,
      afterImageUrl: fallbackHero,
      coverImageUrl: fallbackHero,
      createdAt: new Date(),
      updatedAt: new Date(),
      recoveryEvents: [
        {
          id: "e1",
          animalId: "demo",
          happenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
          title: "Rescue & Intake",
          description: "Field extraction and emergency stabilization.",
          mediaUrl: null,
        },
        {
          id: "e2",
          animalId: "demo",
          happenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          title: "Treatment Begins",
          description: "Wound care, antibiotics, and pain management.",
          mediaUrl: null,
        },
        {
          id: "e3",
          animalId: "demo",
          happenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          title: "Rehab",
          description: "Mobility improves with gentle daily movement.",
          mediaUrl: null,
        },
      ],
      reports: [],
    } as const);

  if (!animal) return notFound();

  const session = await safe(() => getSession(), null);
  const userId = session?.user?.id;
  const saved = userId
    ? !!(await safe(
        () =>
          prisma.savedAnimal.findUnique({
            where: { userId_animalId: { userId, animalId: animal.id } },
          }),
        null,
      ))
    : false;

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-[color:var(--muted)]">
              {animal.species} • {animal.location}
              {animal.country ? ` • ${animal.country}` : ""}
              {animal.warAffected ? " • War zone" : ""}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {animal.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {userId ? (
                <SaveAnimalButton slug={animal.slug} initialSaved={saved} />
              ) : (
                <Button
                  href={`/${params.locale}/auth/signin?callbackUrl=/${params.locale}/animals/${animal.slug}`}
                  variant="secondary"
                  size="sm"
                >
                  Sign in to save
                </Button>
              )}
            </div>
            <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
              {animal.summary}
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-black">
              <Image
                src={animal.coverImageUrl ?? animal.afterImageUrl ?? fallbackHero}
                alt={animal.name}
                fill
                className="object-cover opacity-95"
                sizes="(max-width: 1024px) 100vw, 1100px"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.70),transparent_65%)]" />
              <div className="absolute left-6 top-6 flex flex-wrap items-center gap-2">
                {animal.warAffected ? (
                  <div className="rounded-full border border-[color:rgba(214,180,106,0.4)] bg-[color:rgba(214,180,106,0.12)] px-3 py-1 text-xs">
                    War zone
                  </div>
                ) : null}
                <div className="rounded-full border border-[color:var(--border)] bg-[color:rgba(0,0,0,0.40)] px-3 py-1 text-xs">
                  {animal.status}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Card className="p-7">
                <div className="text-lg font-semibold tracking-tight">
                  Recovery timeline
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  {animal.recoveryEvents.length ? (
                    animal.recoveryEvents.map((e) => (
                      <div
                        key={e.id}
                        className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-5"
                      >
                        <div className="text-sm text-[color:var(--muted)]">
                          {new Date(e.happenedAt).toLocaleDateString()}
                        </div>
                        <div className="mt-1 font-medium tracking-tight">
                          {e.title}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                          {e.description}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[color:var(--muted)]">
                      Timeline updates will appear here as recovery progresses.
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="p-7">
                <div className="text-lg font-semibold tracking-tight">Support</div>
                <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  Sponsor this animal’s recovery, fund emergency medicine, and keep
                  field clinics equipped.
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Button href={`/${params.locale}/donate?animal=${animal.slug}`}>
                    Sponsor this animal
                  </Button>
                  <Button
                    href={`/${params.locale}/reports?animal=${animal.slug}`}
                    variant="secondary"
                  >
                    View medical reports
                  </Button>
                </div>
              </Card>

              <Card className="mt-6 p-7">
                <div className="text-lg font-semibold tracking-tight">
                  Latest report
                </div>
                <div className="mt-4">
                  {animal.reports[0] ? (
                    <a
                      href={`/${params.locale}/reports/${animal.reports[0].id}`}
                      className="block rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-5 hover:bg-[color:rgba(255,255,255,0.05)]"
                    >
                      <div className="text-sm text-[color:var(--muted)]">
                        {new Date(animal.reports[0].publishedAt).toLocaleDateString()}
                      </div>
                      <div className="mt-1 font-medium tracking-tight">
                        {animal.reports[0].title}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        {animal.reports[0].veterinarian
                          ? `Veterinarian: ${animal.reports[0].veterinarian.name}`
                          : "Veterinarian: —"}
                      </div>
                    </a>
                  ) : (
                    <div className="text-sm text-[color:var(--muted)]">
                      Reports are being compiled for transparency and accuracy.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
