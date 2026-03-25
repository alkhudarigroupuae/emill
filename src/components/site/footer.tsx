import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-[color:var(--border)]">
      <Container className="flex flex-col gap-6 py-10 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-[color:var(--fg)] font-medium tracking-tight">
            Animal Rescue & Humanitarian Response
          </div>
          <div>
            Transparent missions, medical reporting, and war-zone triage support.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="hover:text-[color:var(--fg)]"
            href={`/${locale}/privacy`}
          >
            Privacy
          </a>
          <a className="hover:text-[color:var(--fg)]" href={`/${locale}/terms`}>
            Terms
          </a>
          <a className="hover:text-[color:var(--fg)]" href={`/${locale}/contact`}>
            Contact
          </a>
        </div>
      </Container>
    </footer>
  );
}
