"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SignUpForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          if (!res.ok) {
            const data = (await res.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? "Unable to create account.");
            setLoading(false);
            return;
          }

          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: `/${locale}/dashboard`,
          });
          setLoading(false);
          if (!result || result.error) {
            router.push(`/${locale}/auth/signin`);
            return;
          }
          router.push(result.url ?? `/${locale}/dashboard`);
        }}
      >
        <div className="text-xl font-semibold tracking-tight">Create account</div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[color:var(--muted)]">Name</span>
          <input
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

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

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
    </Card>
  );
}

