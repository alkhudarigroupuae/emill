"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

async function createCheckout(payload: unknown) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) throw new Error(data?.error ?? "Checkout failed");
  window.location.href = data.url;
}

export function DonateClient({
  locale,
  signedIn,
  animalSlug,
  emergency,
}: {
  locale: string;
  signedIn: boolean;
  animalSlug?: string;
  emergency?: boolean;
}) {
  const [custom, setCustom] = React.useState("25");
  const [loading, setLoading] = React.useState<string | null>(null);
  const currency = "usd";

  const quick = [500, 1000, 2500, 5000];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Card className="p-7">
          <div className="text-lg font-semibold tracking-tight">One-time donation</div>
          <div className="mt-2 text-sm text-[color:var(--muted)]">
            Fast, secure checkout with Stripe.
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {quick.map((amountCents) => (
              <button
                key={amountCents}
                className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] text-sm font-medium text-[color:var(--fg)] hover:bg-[color:rgba(255,255,255,0.05)]"
                disabled={!!loading}
                onClick={async () => {
                  setLoading(`donation:${amountCents}`);
                  try {
                    await createCheckout({
                      kind: "donation",
                      amountCents,
                      currency,
                      animalSlug,
                      emergency,
                      locale,
                    });
                  } finally {
                    setLoading(null);
                  }
                }}
                type="button"
              >
                {formatMoney(amountCents, currency)}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="text-[color:var(--muted)]">Custom amount (USD)</span>
              <input
                className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
              />
            </label>
            <Button
              onClick={async () => {
                const dollars = Number(custom);
                const amountCents = Math.round(dollars * 100);
                if (!Number.isFinite(amountCents) || amountCents < 100) return;
                setLoading("donation:custom");
                try {
                  await createCheckout({
                    kind: "donation",
                    amountCents,
                    currency,
                    animalSlug,
                    emergency,
                    locale,
                  });
                } finally {
                  setLoading(null);
                }
              }}
              disabled={!!loading}
              type="button"
            >
              Donate
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5">
        <Card className="p-7">
          <div className="text-lg font-semibold tracking-tight">Monthly supporter</div>
          <div className="mt-2 text-sm text-[color:var(--muted)]">
            Predictable monthly support funds antibiotics, surgery, and food.
          </div>

          {!signedIn ? (
            <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-5 text-sm text-[color:var(--muted)]">
              Sign in to manage your subscription and view billing history.
              <div className="mt-4">
                <Button href={`/${locale}/auth/signin?callbackUrl=/${locale}/donate`} size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3" id="monthly">
              {[
                { tier: "SUPPORTER", label: "$5 · Supporter" },
                { tier: "GUARDIAN", label: "$10 · Guardian" },
                { tier: "HERO", label: "$25 · Hero" },
              ].map((p) => (
                <button
                  key={p.tier}
                  className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] text-sm font-medium text-[color:var(--fg)] hover:bg-[color:rgba(255,255,255,0.05)]"
                  disabled={!!loading}
                  onClick={async () => {
                    setLoading(`sub:${p.tier}`);
                    try {
                      await createCheckout({ kind: "subscription", tier: p.tier, locale });
                    } finally {
                      setLoading(null);
                    }
                  }}
                  type="button"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
