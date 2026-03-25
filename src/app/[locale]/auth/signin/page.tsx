import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { SignInForm } from "./signinForm";

export default function SignInPage({ params }: { params: { locale: Locale } }) {
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-xl">
        <SignInForm locale={params.locale} />
        <div className="mt-4 text-sm text-[color:var(--muted)]">
          New here?{" "}
          <a
            className="text-[color:var(--fg)] hover:underline"
            href={`/${params.locale}/auth/signup`}
          >
            Create an account
          </a>
        </div>
      </Container>
    </div>
  );
}

