import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent-2)] shadow-[0_10px_30px_rgba(214,180,106,0.18)]",
  secondary:
    "bg-[color:var(--surface)] text-[color:var(--fg)] hover:bg-[color:var(--surface-2)] border border-[color:var(--border)]",
  ghost:
    "text-[color:var(--fg)] hover:bg-[color:var(--surface)] border border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-7 text-base",
};

type CommonProps = {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonLinkProps = CommonProps & {
  href: string;
  children: React.ReactNode;
};

type ButtonButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: ButtonLinkProps): React.ReactNode;
export function Button(props: ButtonButtonProps): React.ReactNode;
export function Button(props: ButtonLinkProps | ButtonButtonProps) {
  const { className, variant = "primary", size = "md" } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && typeof props.href === "string") {
    return (
      <Link href={props.href} className={classes}>
        {"children" in props ? props.children : null}
      </Link>
    );
  }

  return <button className={classes} {...(props as ButtonButtonProps)} />;
}
