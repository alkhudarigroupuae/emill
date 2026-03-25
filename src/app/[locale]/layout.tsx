import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { isLocale, type Locale } from "@/lib/locale";
import "./../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Animal Rescue | Saving Lives That Cannot Speak",
    template: "%s · Animal Rescue",
  },
  description:
    "A premium, transparent rescue platform with medical reporting, recovery timelines, and war-zone triage support.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) return notFound();
  const locale = resolvedParams.locale as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[color:var(--bg)] text-[color:var(--fg)] antialiased">
        <div className="min-h-full flex flex-col">
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
