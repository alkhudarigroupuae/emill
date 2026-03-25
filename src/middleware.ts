import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";

function getPreferredLocale(req: NextRequest) {
  const header = req.headers.get("accept-language");
  if (!header) return "en";
  const lower = header.toLowerCase();
  if (lower.includes("ar")) return "ar";
  return "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0] ?? "";
  const second = parts[1] ?? "";

  if (first && isLocale(first)) {
    if (second === "undefined") {
      const url = req.nextUrl.clone();
      url.pathname = `/${first}/${parts.slice(2).join("/")}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const locale = getPreferredLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
