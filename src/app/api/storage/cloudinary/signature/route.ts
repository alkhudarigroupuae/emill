import crypto from "crypto";
import { getEnv } from "@/lib/env";
import { rateLimitOrThrow } from "@/lib/rateLimit";

function signCloudinary(paramsToSign: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(payload + apiSecret).digest("hex");
}

export async function POST(req: Request) {
  const env = getEnv();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    rateLimitOrThrow({ key: `cloudinary-sign:${ip}`, windowMs: 60_000, max: 60 });
  } catch {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return Response.json({ error: "Cloudinary not configured" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as
    | { folder?: string; publicId?: string }
    | null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign: Record<string, string> = { timestamp };
  if (body?.folder) paramsToSign.folder = body.folder;
  if (body?.publicId) paramsToSign.public_id = body.publicId;

  const signature = signCloudinary(paramsToSign, env.CLOUDINARY_API_SECRET);
  return Response.json(
    {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: body?.folder ?? null,
      publicId: body?.publicId ?? null,
    },
    { status: 200 },
  );
}
