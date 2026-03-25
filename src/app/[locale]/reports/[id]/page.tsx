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

export default async function ReportPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const report = await safe(
    () =>
      prisma.rescueReport.findUnique({
        where: { id: params.id },
        include: {
          animal: true,
          veterinarian: true,
          attachments: { orderBy: { createdAt: "desc" } },
          progressLogs: {
            orderBy: { loggedAt: "desc" },
            include: { veterinarian: true },
          },
        },
      }),
    null,
  );

  if (!report) {
    return (
      <div className="py-12 md:py-16">
        <Container className="max-w-3xl">
          <Card className="p-7">
            <div className="text-xl font-semibold tracking-tight">
              Report unavailable
            </div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">
              Configure the database to view medical reports.
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-[color:var(--muted)]">
            {new Date(report.publishedAt).toLocaleDateString()} •{" "}
            <a
              className="hover:text-[color:var(--fg)]"
              href={`/${params.locale}/animals/${report.animal.slug}`}
            >
              {report.animal.name}
            </a>
            {report.animal.warAffected ? " • War zone" : ""}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {report.title}
          </h1>
          <div className="text-sm text-[color:var(--muted)]">
            {report.veterinarian
              ? `Veterinarian: ${report.veterinarian.name} (${report.veterinarian.specialty})`
              : "Veterinarian: —"}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card className="p-7">
              <div className="text-lg font-semibold tracking-tight">
                Injury description
              </div>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)]">
                {report.injuryDescription}
              </div>

              <div className="mt-8 text-lg font-semibold tracking-tight">
                Treatment steps
              </div>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)]">
                {report.treatmentSteps}
              </div>
            </Card>

            <Card className="mt-6 p-7">
              <div className="text-lg font-semibold tracking-tight">Progress logs</div>
              <div className="mt-5 flex flex-col gap-4">
                {report.progressLogs.length ? (
                  report.progressLogs.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-5"
                    >
                      <div className="text-sm text-[color:var(--muted)]">
                        {new Date(l.loggedAt).toLocaleString()}
                        {l.veterinarian ? ` • ${l.veterinarian.name}` : ""}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)]">
                        {l.note}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[color:var(--muted)]">
                    Progress logs will appear here as updates are verified.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-7">
              <div className="text-lg font-semibold tracking-tight">Attachments</div>
              <div className="mt-5 flex flex-col gap-4">
                {report.attachments.length ? (
                  report.attachments.map((a) => (
                    <a
                      key={a.id}
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-4 hover:bg-[color:rgba(255,255,255,0.05)]"
                    >
                      {a.type === "IMAGE" ? (
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                          <Image
                            src={a.url}
                            alt={a.fileName ?? "Attachment"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 360px"
                          />
                        </div>
                      ) : (
                        <div className="text-sm font-medium tracking-tight">
                          {a.fileName ?? a.type}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-[color:var(--muted)]">
                        {a.type}
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-[color:var(--muted)]">
                    Attachments will appear here when available.
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
