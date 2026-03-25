import { prisma } from "@/lib/db";

export const runtime = "nodejs";

async function getTotalDonatedCents() {
  const sum = await prisma.donation.aggregate({
    _sum: { amountCents: true },
    where: { status: "SUCCEEDED" },
  });
  return sum._sum.amountCents ?? 0;
}

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const abort = req.signal;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = async () => {
        try {
          const amountCents = await getTotalDonatedCents();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ amountCents })}\n\n`),
          );
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ amountCents: 0 })}\n\n`));
        }
      };

      const interval = setInterval(send, 3000);
      send();

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        controller.close();
      };

      abort.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
