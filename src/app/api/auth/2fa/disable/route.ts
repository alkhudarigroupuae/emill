import { authenticator } from "otplib";
import { prisma } from "@/lib/db";
import { decryptString } from "@/lib/crypto";
import { getSession } from "@/lib/session";
import { twoFactorConfirmSchema } from "@/lib/validators";
import { isLocale } from "@/lib/locale";

function getLocaleFromReferer(req: Request) {
  const ref = req.headers.get("referer");
  if (!ref) return "en";
  try {
    const url = new URL(ref);
    const segment = url.pathname.split("/")[1] ?? "";
    return isLocale(segment) ? segment : "en";
  } catch {
    return "en";
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const token = typeof form?.get("token") === "string" ? String(form.get("token")) : "";
  const parsed = twoFactorConfirmSchema.safeParse({ token });
  if (!parsed.success) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorSecretEnc) {
    return Response.json({ error: "2FA not configured" }, { status: 400 });
  }

  const secret = decryptString(user.twoFactorSecretEnc);
  const valid = authenticator.verify({ token: parsed.data.token, secret });
  if (!valid) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecretEnc: null },
  });

  const locale = getLocaleFromReferer(req);
  return Response.redirect(new URL(`/${locale}/dashboard/security/2fa`, req.url), 303);
}

