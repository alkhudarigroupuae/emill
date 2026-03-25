import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>, fallback: T) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function AnimalsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { species?: string; war?: string };
}) {
  const species =
    searchParams.species === "DOG" ||
    searchParams.species === "CAT" ||
    searchParams.species === "HORSE"
      ? searchParams.species
      : undefined;
  const war = searchParams.war === "1" ? true : searchParams.war === "0" ? false : undefined;

  const animals = await safe(
    () =>
      prisma.animal.findMany({
        where: {
          ...(species ? { species } : {}),
          ...(war === undefined ? {} : { warAffected: war }),
        },
        orderBy: [{ rescueDate: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          species: true,
          location: true,
          country: true,
          warAffected: true,
          status: true,
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
        country: "Ukraine",
        warAffected: true,
        status: "RECOVERING" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Shrapnel wounds stabilized with antibiotics and daily wound care.",
      },
      {
        id: "demo-2",
        slug: "saffron",
        name: "Saffron",
        species: "CAT" as const,
        location: "Border Evacuation Shelter",
        country: "Syria",
        warAffected: true,
        status: "STABLE" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Treated for smoke inhalation and eye irritation. Calm and eating well.",
      },
      {
        id: "demo-3",
        slug: "atlas",
        name: "Atlas",
        species: "HORSE" as const,
        location: "Rural Recovery Ranch",
        country: "Poland",
        warAffected: false,
        status: "RECOVERED" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Completed rehab after prolonged neglect. Strong appetite and steady gait.",
      },
      {
        id: "demo-4",
        slug: "milo",
        name: "Milo",
        species: "DOG" as const,
        location: "Coastal Treatment Unit",
        country: "Turkey",
        warAffected: false,
        status: "RECOVERING" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Arrived weak and dehydrated. Treated with fluids, nutrition support, and antibiotics.",
      },
      {
        id: "demo-5",
        slug: "lina",
        name: "Lina",
        species: "CAT" as const,
        location: "Temporary Foster Network",
        country: "Lebanon",
        warAffected: false,
        status: "STABLE" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Recovered from malnutrition with careful feeding and ongoing monitoring.",
      },
      {
        id: "demo-6",
        slug: "ember",
        name: "Ember",
        species: "DOG" as const,
        location: "Mobile Field Clinic",
        country: "Ukraine",
        warAffected: true,
        status: "RECOVERING" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Treated for soft-tissue trauma and infection risk. Rehab plan in progress.",
      },
      {
        id: "demo-7",
        slug: "noura",
        name: "Noura",
        species: "CAT" as const,
        location: "Emergency Intake Shelter",
        country: "Syria",
        warAffected: true,
        status: "RECOVERING" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Respiratory irritation treated with oxygen support and follow-up care.",
      },
      {
        id: "demo-8",
        slug: "zahra",
        name: "Zahra",
        species: "HORSE" as const,
        location: "Rehab Stable",
        country: "Romania",
        warAffected: false,
        status: "RECOVERING" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Hoof care, nutrition plan, and gradual conditioning restored strength and mobility.",
      },
      {
        id: "demo-9",
        slug: "rio",
        name: "Rio",
        species: "DOG" as const,
        location: "Urban Rescue Partner Shelter",
        country: "Iraq",
        warAffected: true,
        status: "STABLE" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Post-rescue monitoring and vaccinations completed. Awaiting placement.",
      },
    ],
  );

  const base = `/${params.locale}/animals`;

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Animals
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Profiles include rescue context, recovery timelines, and medical reports.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <Button href={base} variant="secondary" size="sm">
            All
          </Button>
          <Button href={`${base}?species=DOG`} variant="secondary" size="sm">
            Dogs
          </Button>
          <Button href={`${base}?species=CAT`} variant="secondary" size="sm">
            Cats
          </Button>
          <Button href={`${base}?species=HORSE`} variant="secondary" size="sm">
            Horses
          </Button>
          <div className="w-px self-stretch bg-[color:var(--border)] mx-2" />
          <Button href={`${base}?war=1`} variant="secondary" size="sm">
            War zone
          </Button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {animals.map((a) => (
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
                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    {a.warAffected ? (
                      <div className="rounded-full border border-[color:rgba(214,180,106,0.4)] bg-[color:rgba(214,180,106,0.12)] px-3 py-1 text-xs">
                        War zone
                      </div>
                    ) : null}
                    <div className="rounded-full border border-[color:var(--border)] bg-[color:rgba(0,0,0,0.35)] px-3 py-1 text-xs">
                      {a.status}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold tracking-tight">{a.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    {a.species} • {a.location}
                    {a.country ? ` • ${a.country}` : ""}
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
    </div>
  );
}
