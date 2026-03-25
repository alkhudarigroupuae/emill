import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { signUpSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    rateLimitOrThrow({ key: `signup:${ip}`, windowMs: 60_000, max: 10 });
  } catch {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = signUpSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name,
    },
    select: { id: true, email: true },
  });

  return Response.json({ user }, { status: 201 });
}

