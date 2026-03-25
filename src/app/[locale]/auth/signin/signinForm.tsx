"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SignInForm({ locale }: { locale: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? `/${locale}/dashboard`;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <Card className="p-7">
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            code,
            callbackUrl,
          });
          setLoading(false);
          if (!result || result.error) {
            setError("Invalid credentials or 2FA code.");
            return;
          }
          router.push(result.url ?? callbackUrl);
        }}
      >
        <div className="text-xl font-semibold tracking-tight">Sign in</div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[color:var(--muted)]">Email</span>
          <input
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[color:var(--muted)]">Password</span>
          <input
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[color:var(--muted)]">2FA Code (if enabled)</span>
          <input
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}

