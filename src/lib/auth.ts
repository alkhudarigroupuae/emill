import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "@/lib/db";
import { decryptString } from "@/lib/crypto";
import { getEnv } from "@/lib/env";

authenticator.options = { window: 1 };

export function getAuthOptions(): NextAuthOptions {
  const env = getEnv();
  return {
    secret: env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          code: { label: "2FA Code", type: "text" },
        },
        async authorize(credentials) {
          const email = credentials?.email?.toLowerCase().trim();
          const password = credentials?.password ?? "";
          const code = credentials?.code?.trim();

          if (!email || !password) return null;

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;

          if (user.twoFactorEnabled) {
            if (!user.twoFactorSecretEnc) return null;
            if (!code) return null;
            const secret = decryptString(user.twoFactorSecretEnc);
            const valid = authenticator.verify({ token: code, secret });
            if (!valid) return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user?.id) token.sub = user.id;
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.sub) {
          (session.user as { id?: string }).id = token.sub;
        }
        return session;
      },
    },
  };
}
