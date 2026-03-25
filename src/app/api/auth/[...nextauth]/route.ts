import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const handler = NextAuth(getAuthOptions());
  return handler(req);
}

export async function POST(req: Request) {
  const handler = NextAuth(getAuthOptions());
  return handler(req);
}
