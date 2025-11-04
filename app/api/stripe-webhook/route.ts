import Stripe from "stripe";
import { respOk } from "@/lib/resp";
import {
  handleCheckoutSession,
  handleInvoice,
} from "@/pay-provider/stripe/stripe-services/stripe";

export async function POST(req: Request) {
  try {
    const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripePrivateKey || !stripeWebhookSecret) {
      console.error("Missing Stripe configuration");
      throw new Error("invalid stripe config");
    }

    const stripe = new Stripe(stripePrivateKey, {
      // Cloudflare Workers use the Fetch API for their API requests.
      httpClient: Stripe.createFetchHttpClient(),
    });

    const sign = req.headers.get("stripe-signature") as string;
    const body = await req.text();
    if (!sign || !body) {
      console.error("Missing stripe signature or body");
      throw new Error("invalid notify data");
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      sign,
      stripeWebhookSecret,
    );

    console.log("stripe notify event: ", event.type, event.id);

    switch (event.type) {
      case "checkout.session.completed": {
        // get checkout session
        const session = event.data.object;
        console.log("Processing checkout session completed:", session.id);
        await handleCheckoutSession(stripe, session);
        console.log("Checkout session processed successfully");
        break;
      }
      case "invoice.payment_succeeded": {
        // get invoice
        const invoice = event.data.object;
        console.log("Processing invoice payment succeeded:", invoice.id);
        await handleInvoice(stripe, invoice);
        console.log("Invoice payment processed successfully");
        break;
      }

      default:
        console.log("Unhandled event type: ", event.type);
    }

    return respOk();
  } catch (e: unknown) {
    console.error("stripe notify failed: ", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return Response.json(
      { error: `handle stripe notify failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
