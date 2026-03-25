"use client";

import * as React from "react";

export function LiveDonationCounter({
  initialAmountCents,
  currency,
}: {
  initialAmountCents: number;
  currency: string;
}) {
  const [amountCents, setAmountCents] = React.useState(initialAmountCents);

  React.useEffect(() => {
    let es: EventSource | null = null;
    let alive = true;

    try {
      es = new EventSource("/api/stats/stream");
      es.onmessage = (e) => {
        if (!alive) return;
        try {
          const data = JSON.parse(e.data) as { amountCents: number };
          if (typeof data.amountCents === "number") setAmountCents(data.amountCents);
        } catch {
          setAmountCents((v) => v);
        }
      };
      es.onerror = () => {
        es?.close();
      };
    } catch {
      setAmountCents((v) => v);
    }

    return () => {
      alive = false;
      es?.close();
    };
  }, []);

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

  return (
    <span>
      {formatted}
    </span>
  );
}
