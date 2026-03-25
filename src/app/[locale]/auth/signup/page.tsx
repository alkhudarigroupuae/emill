import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/locale";
import { SignUpForm } from "./signupForm";

export default function SignUpPage({ params }: { params: { locale: Locale } }) {
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-xl">
        <SignUpForm locale={params.locale} />
        <div className="mt-4 text-sm text-[color:var(--muted)]">
          Already have an account?{" "}
          <a
            className="text-[color:var(--fg)] hover:underline"
            href={`/${params.locale}/auth/signin`}
          >
            Sign in
          </a>
        </div>
      </Container>
    </div>
  );
}

