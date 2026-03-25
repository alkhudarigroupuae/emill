import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export function Navbar({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:rgba(10,10,10,0.7)] backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] shadow-[0_0_40px_rgba(214,180,106,0.55)]" />
          <span>Animal Rescue</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          <Link href={`/${locale}/animals`} className="hover:text-[color:var(--fg)]">
            {t.nav.animals}
          </Link>
          <Link href={`/${locale}/war`} className="hover:text-[color:var(--fg)]">
            {t.nav.war}
          </Link>
          <Link href={`/${locale}/reports`} className="hover:text-[color:var(--fg)]">
            {t.nav.reports}
          </Link>
          <Link href={`/${locale}/team`} className="hover:text-[color:var(--fg)]">
            {t.nav.team}
          </Link>
          <Link href={`/${locale}/blog`} className="hover:text-[color:var(--fg)]">
            {t.nav.blog}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button href={`/${locale}/donate`} size="sm">
            {t.nav.donate}
          </Button>
          <Button href={`/${locale}/auth/signin`} variant="secondary" size="sm">
            {t.nav.signIn}
          </Button>
        </div>
      </Container>
    </header>
  );
}
