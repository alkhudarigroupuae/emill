import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const post = await (async () => {
    try {
      return await prisma.blogPost.findUnique({ where: { slug: params.slug } });
    } catch {
      return {
        id: "demo-1",
        slug: params.slug,
        title:
          params.slug === "why-war-zone-rescues-matter"
            ? "Why War-Zone Rescues Matter"
            : "Update",
        excerpt:
          "This is a preview post. Connect the database to publish verified updates and mission logs.",
        content:
          "War impacts every living being. Animals suffer injuries, displacement, starvation, and abandonment.\n\nOur teams work with local partners to evacuate, triage, and treat animals under extreme conditions.\n\nThis platform is built for transparency: stories, timelines, medical reports, and progress logs — so supporters can see the real impact of every donation.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=2000&q=70",
        tags: ["war", "rescue", "medical"],
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  })();
  if (!post || !post.publishedAt) return notFound();

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-3">
          <div className="text-sm text-[color:var(--muted)]">
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)] md:text-base">
            {post.excerpt}
          </p>
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="relative aspect-[16/9] bg-black">
            <Image
              src={
                post.coverImageUrl ??
                "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=2000&q=70"
              }
              alt={post.title}
              fill
              className="object-cover opacity-95"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.80),transparent_65%)]" />
          </div>
          <div className="p-7 md:p-10">
            <div className="whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)] md:text-base">
              {post.content}
            </div>
            {post.tags.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[color:var(--muted)]"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      </Container>
    </div>
  );
}
