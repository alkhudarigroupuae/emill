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

export default async function BlogPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const posts = await safe(
    () =>
      prisma.blogPost.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        where: { publishedAt: { not: null } },
        take: 30,
      }),
    [
      {
        id: "demo-1",
        slug: "why-war-zone-rescues-matter",
        title: "Why War-Zone Rescues Matter",
        excerpt:
          "Behind every siren is a silent victim. Here’s how field clinics keep animals alive when the world is falling apart.",
        content: "",
        coverImageUrl:
          "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=2000&q=70",
        tags: ["war", "rescue", "medical"],
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  );

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Blog & Updates
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Field updates, medical transparency, and mission stories.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <a key={p.id} href={`/${params.locale}/blog/${p.slug}`} className="group">
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/10] bg-black">
                  <Image
                    src={
                      p.coverImageUrl ??
                      "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=2000&q=70"
                    }
                    alt={p.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.80),transparent_65%)]" />
                </div>
                <div className="p-6">
                  <div className="text-sm text-[color:var(--muted)]">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}
                  </div>
                  <div className="mt-2 text-lg font-semibold tracking-tight">
                    {p.title}
                  </div>
                  <div className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
                    {p.excerpt}
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
