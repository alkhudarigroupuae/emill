"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function ImageCompare({
  beforeUrl,
  afterUrl,
  alt,
  className,
}: {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
  className?: string;
}) {
  const [value, setValue] = React.useState(55);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-black",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={afterUrl}
          alt={alt}
          fill
          className="object-cover opacity-95"
          sizes="(max-width: 1024px) 100vw, 900px"
          priority
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${value}%` }}
        >
          <div className="relative h-full w-full">
            <Image
              src={beforeUrl}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        </div>

        <div
          className="absolute inset-y-0"
          style={{ left: `calc(${value}% - 1px)` }}
        >
          <div className="h-full w-[2px] bg-[color:rgba(214,180,106,0.7)]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:rgba(214,180,106,0.8)] bg-[color:rgba(0,0,0,0.6)] px-3 py-2 text-xs text-[color:var(--fg)] backdrop-blur">
            Before / After
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <input
          aria-label="Image comparison slider"
          className="w-full accent-[color:var(--accent)]"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
