import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    rateLimitOrThrow({ key: `save-animal:${ip}:${userId}`, windowMs: 60_000, max: 120 });
  } catch {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = (await req.json().catch(() => null)) as { slug?: string } | null;
  const slug = json?.slug?.trim();
  if (!slug) return Response.json({ error: "Invalid input" }, { status: 400 });

  const animal = await prisma.animal.findUnique({ where: { slug }, select: { id: true } });
  if (!animal) return Response.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.savedAnimal.findUnique({
    where: { userId_animalId: { userId, animalId: animal.id } },
  });

  if (existing) {
    await prisma.savedAnimal.delete({
      where: { userId_animalId: { userId, animalId: animal.id } },
    });
    return Response.json({ saved: false }, { status: 200 });
  }

  await prisma.savedAnimal.create({
    data: { userId, animalId: animal.id },
  });
  return Response.json({ saved: true }, { status: 200 });
}

