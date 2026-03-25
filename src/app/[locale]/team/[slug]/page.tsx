import Image from "next/image";
import { notFound } from "next/navigation";
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

export default async function VetProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const resolvedParams = await params;

  const vet = await safe(
    () =>
      prisma.veterinarian.findUnique({
        where: { slug: resolvedParams.slug },
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
    null,
  );

  const fallback =
    resolvedParams.slug === "dr-samira-haddad"
      ? {
          id: "demo-1",
          slug: "dr-samira-haddad",
          name: "Dr. Samira Haddad",
          specialty: "Emergency Surgery",
          experienceYears: 12,
          bio: "Specializes in trauma stabilization and post-conflict rescue triage with a focus on rapid interventions that preserve mobility and prevent infection.",
          photoUrl:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=70",
          country: "Jordan",
          languages: ["English", "Arabic"],
        }
      : resolvedParams.slug === "dr-luca-moretti"
        ? {
            id: "demo-2",
            slug: "dr-luca-moretti",
            name: "Dr. Luca Moretti",
            specialty: "Orthopedics",
            experienceYears: 9,
            bio: "Supports complex fracture repair, limb reconstruction, and long-term rehab planning for animals rescued from severe injuries.",
            photoUrl:
              "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1600&q=70",
            country: "Italy",
            languages: ["English", "Italian"],
          }
        : null;

  const resolved = vet ?? fallback;
  if (!resolved) return notFound();

  const recentReports = await safe(
    () =>
      prisma.rescueReport.findMany({
        where: { veterinarianId: resolved.id },
        orderBy: { publishedAt: "desc" },
        take: 8,
        select: {
          id: true,
          title: true,
          publishedAt: true,
          animal: { select: { name: true, slug: true, warAffected: true } },
        },
      }),
    [],
  );

  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-4xl">
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9] bg-black">
            <Image
              src={
                resolved.photoUrl ??
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=70"
              }
              alt={resolved.name}
              fill
              className="object-cover opacity-95"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.80),transparent_60%)]" />
          </div>
          <div className="p-7 md:p-10">
            <div className="text-sm text-[color:var(--muted)]">
              {resolved.specialty} • {resolved.experienceYears} years
              {resolved.country ? ` • ${resolved.country}` : ""}
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {resolved.name}
            </h1>
            <div className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
              {resolved.bio}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {resolved.languages.map((l) => (
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

        <div className="mt-8 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold tracking-tight">Recent reports</div>
            <div className="text-sm text-[color:var(--muted)]">
              Verified case notes tied to this veterinarian.
            </div>
          </div>
          <a
            href={`/${resolvedParams.locale}/team`}
            className="text-sm font-medium text-[color:var(--accent)] hover:underline"
          >
            Back to team
          </a>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {recentReports.length ? (
            recentReports.map((r) => (
              <a key={r.id} href={`/${resolvedParams.locale}/reports/${r.id}`}>
                <Card className="p-6 hover:bg-[color:rgba(255,255,255,0.05)] transition">
                  <div className="text-sm text-[color:var(--muted)]">
                    {new Date(r.publishedAt).toLocaleDateString()} • {r.animal.name}
                    {r.animal.warAffected ? " • War zone" : ""}
                  </div>
                  <div className="mt-2 font-semibold tracking-tight">{r.title}</div>
                  <div className="mt-3 text-xs text-[color:var(--muted)]">
                    View report
                  </div>
                </Card>
              </a>
            ))
          ) : (
            <Card className="p-6 md:col-span-2">
              <div className="text-sm text-[color:var(--muted)]">
                No reports linked yet.
              </div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
