"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function SaveAnimalButton({
  slug,
  initialSaved,
}: {
  slug: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      variant={saved ? "primary" : "secondary"}
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/animals/save", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ slug }),
          });
          const data = (await res.json().catch(() => null)) as { saved?: boolean } | null;
          if (typeof data?.saved === "boolean") setSaved(data.saved);
        } finally {
          setLoading(false);
        }
      }}
      type="button"
    >
      {saved ? "Saved" : "Save"}
    </Button>
  );
}

