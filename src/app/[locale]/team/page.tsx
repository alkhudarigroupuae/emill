import Image from "next/image";
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

export default async function TeamPage({ params }: { params: { locale: Locale } }) {
  const vets = await safe(
    () =>
      prisma.veterinarian.findMany({
        orderBy: [{ experienceYears: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          specialty: true,
          experienceYears: true,
          bio: true,
          photoUrl: true,
          country: true,
          languages: true,
        },
      }),
    [
      {
        id: "demo-1",
        slug: "dr-samira-haddad",
        name: "Dr. Samira Haddad",
        specialty: "Emergency Surgery",
        experienceYears: 12,
        bio: "Specializes in trauma stabilization and post-conflict rescue triage with a focus on rapid interventions that preserve mobility and prevent infection.",
        photoUrl:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=70",
        country: "Jordan",
        languages: ["English", "Arabic"],
      },
      {
        id: "demo-2",
        slug: "dr-luca-moretti",
        name: "Dr. Luca Moretti",
        specialty: "Orthopedics",
        experienceYears: 9,
        bio: "Supports complex fracture repair, limb reconstruction, and long-term rehab planning for animals rescued from severe injuries.",
        photoUrl:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=70",
        country: "Italy",
        languages: ["English", "Italian"],
      },
    ],
  );

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Veterinarians & Team
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Transparency begins with people. Every report is tied to verified professionals
            and field teams working in extreme conditions.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {vets.map((v) => (
            <a key={v.id} href={`/${params.locale}/team/${v.slug}`} className="group">
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/10] bg-black">
                  <Image
                    src={
                      v.photoUrl ??
                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=70"
                    }
                    alt={v.name}
                    fill
                    className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.80),transparent_60%)]" />
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold tracking-tight">{v.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    {v.specialty} • {v.experienceYears} years
                    {v.country ? ` • ${v.country}` : ""}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    {v.bio}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {v.languages.map((l) => (
                      <div
                        key={l}
                        className="rounded-full border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[color:var(--muted)]"
                      >
                        {l}
                      </div>
                    ))}
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
