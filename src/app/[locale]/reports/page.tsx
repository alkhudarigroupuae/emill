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

export default async function ReportsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { animal?: string };
}) {
  const animalSlug = searchParams.animal;

  const reports = await safe(
    () =>
      prisma.rescueReport.findMany({
        where: animalSlug ? { animal: { slug: animalSlug } } : {},
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: {
          animal: true,
          veterinarian: true,
          _count: { select: { progressLogs: true, attachments: true } },
        },
        take: 50,
      }),
    [
      {
        id: "seed-amira-initial",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        title: "Shrapnel Injury Stabilization",
        animal: { name: "Amira", warAffected: true } as never,
        veterinarian: { name: "Dr. Samira Haddad" } as never,
        _count: { progressLogs: 2, attachments: 2 },
      } as never,
    ],
  );

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Medical & Rescue Reports
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Each case contains injury context, treatment steps, progress logs, and
            attached evidence.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {reports.map((r) => (
            <a key={r.id} href={`/${params.locale}/reports/${r.id}`}>
              <Card className="p-7 hover:bg-[color:rgba(255,255,255,0.05)] transition">
                <div className="text-sm text-[color:var(--muted)]">
                  {new Date(r.publishedAt).toLocaleDateString()} • {r.animal.name}
                  {r.animal.warAffected ? " • War zone" : ""}
                </div>
                <div className="mt-2 text-lg font-semibold tracking-tight">
                  {r.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {r.veterinarian ? `Veterinarian: ${r.veterinarian.name}` : "Veterinarian: —"}
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                  <span>{r._count.progressLogs} updates</span>
                  <span>•</span>
                  <span>{r._count.attachments} attachments</span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}
