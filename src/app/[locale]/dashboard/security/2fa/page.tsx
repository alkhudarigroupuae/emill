import QRCode from "qrcode";
import { authenticator } from "otplib";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/locale";
import { getSession } from "@/lib/session";
import { decryptString, encryptString } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export default async function TwoFactorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(
      `/${params.locale}/auth/signin?callbackUrl=/${params.locale}/dashboard/security/2fa`,
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, twoFactorEnabled: true, twoFactorSecretEnc: true },
  });
  if (!user) redirect(`/${params.locale}/auth/signin`);

  let qrDataUrl: string | null = null;
  let secretToShow: string | null = null;

  if (!user.twoFactorEnabled) {
    const existing = user.twoFactorSecretEnc
      ? decryptString(user.twoFactorSecretEnc)
      : null;
    const secret = existing ?? authenticator.generateSecret();
    if (!existing) {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecretEnc: encryptString(secret) },
      });
    }

    const otpAuth = authenticator.keyuri(user.email, "Animal Rescue", secret);
    qrDataUrl = await QRCode.toDataURL(otpAuth, { margin: 1, width: 360 });
    secretToShow = secret;
  }

  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-2xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Two-factor authentication (2FA)
          </h1>
          <p className="text-sm leading-6 text-[color:var(--muted)] md:text-base">
            Use an authenticator app to protect your account.
          </p>
        </div>

        {user.twoFactorEnabled ? (
          <Card className="mt-8 p-7">
            <div className="text-lg font-semibold tracking-tight">Enabled</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">
              To disable, confirm a current code from your authenticator app.
            </div>
            <form className="mt-5 flex flex-col gap-3" action="/api/auth/2fa/disable" method="post">
              <input
                name="token"
                className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
              <button className="h-12 rounded-full bg-[color:var(--surface)] px-6 text-sm font-medium text-[color:var(--fg)] hover:bg-[color:var(--surface-2)] border border-[color:var(--border)]">
                Disable 2FA
              </button>
            </form>
          </Card>
        ) : (
          <Card className="mt-8 p-7">
            <div className="text-lg font-semibold tracking-tight">Enable 2FA</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">
              Scan the QR code with Google Authenticator, 1Password, or any TOTP app.
            </div>
            {qrDataUrl ? (
              <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-6">
                <img
                  src={qrDataUrl}
                  alt="2FA QR code"
                  className="h-[240px] w-[240px] rounded-2xl bg-white p-3"
                />
                {secretToShow ? (
                  <div className="text-xs text-[color:var(--muted)]">
                    Manual code:{" "}
                    <span className="font-mono text-[color:var(--fg)]">
                      {secretToShow}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
            <form className="mt-6 flex flex-col gap-3" action="/api/auth/2fa/enable" method="post">
              <input
                name="token"
                className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 text-[color:var(--fg)] outline-none focus:border-[color:rgba(214,180,106,0.5)]"
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
              <button className="h-12 rounded-full bg-[color:var(--accent)] px-6 text-sm font-medium text-black hover:bg-[color:var(--accent-2)]">
                Enable 2FA
              </button>
            </form>
          </Card>
        )}
      </Container>
    </div>
  );
}
