declare module "next/font/google" {
  type NextFont = {
    className: string;
    style: { fontFamily: string };
    variable: string;
  };

  export function Inter(options: {
    subsets: string[];
    variable?: string;
    display?: "auto" | "block" | "swap" | "fallback" | "optional";
  }): NextFont;
}

