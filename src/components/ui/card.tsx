import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
