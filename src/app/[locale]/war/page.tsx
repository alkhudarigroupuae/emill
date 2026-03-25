import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { prisma } from "@/lib/db";
import { getMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>, fallback: T) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function WarAffectedPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getMessages(params.locale);

  const animals = await safe(
    () =>
      prisma.animal.findMany({
        where: { warAffected: true },
        orderBy: [{ rescueDate: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          species: true,
          location: true,
          country: true,
          status: true,
          coverImageUrl: true,
          afterImageUrl: true,
          summary: true,
        },
        take: 18,
      }),
    [
      {
        id: "demo-1",
        slug: "amira",
        name: "Amira",
        species: "DOG" as const,
        location: "Kharkiv Field Clinic",
        country: "Ukraine",
        status: "RECOVERING" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Field extraction and rapid stabilization under active conflict conditions.",
      },
      {
        id: "demo-2",
        slug: "saffron",
        name: "Saffron",
        species: "CAT" as const,
        location: "Border Evacuation Shelter",
        country: "Syria",
        status: "STABLE" as const,
        coverImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        afterImageUrl:
          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=70",
        summary:
          "Evacuated with civilians and treated for smoke inhalation and dehydration.",
      },
    ],
  );

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t.war.headline}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Stories from conflict zones are documented with medical evidence, progress logs,
            and verified treatment steps.
          </p>
        </div>

        <Card className="mt-8 p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-[color:var(--muted)]">Emergency</div>
              <div className="text-xl font-semibold tracking-tight">
                {t.war.banner}
              </div>
            </div>
            <Button href={`/${params.locale}/donate?emergency=1`}>
              {t.war.cta}
            </Button>
          </div>
        </Card>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
                  <div className="absolute left-5 top-5 rounded-full border border-[color:rgba(214,180,106,0.4)] bg-[color:rgba(214,180,106,0.12)] px-3 py-1 text-xs">
                    {a.status}
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
