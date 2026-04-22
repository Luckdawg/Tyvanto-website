import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getDb } from '../db';
import { orders, orderItems, products } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { notifyOwner } from './notification';

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeKey && stripeKey !== 'sk_test_placeholder_key_for_hosting'
  ? new Stripe(stripeKey, { apiVersion: '2024-04-10' as any })
  : null as unknown as Stripe;

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events for webhook verification
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const clientReferenceId = session.client_reference_id;
  const userId = session.metadata?.user_id;
  const cartData = session.metadata?.cart_data ? JSON.parse(session.metadata.cart_data) : [];

  if (!clientReferenceId || !userId) {
    console.error('Missing required metadata in checkout session');
    return;
  }

  try {
    // Create order
    const orderNumber = `ORD-${Date.now()}`;
    const subtotal = (session.amount_subtotal || 0) / 100;
    const tax = (session.total_details?.amount_tax || 0) / 100;
    const shipping = (session.total_details?.amount_shipping || 0) / 100;
    const total = (session.amount_total || 0) / 100;

    const db = await getDb();
    if (!db) throw new Error('Database not available');

    await db
      .insert(orders)
      .values({
        orderNumber,
        userId: parseInt(userId),
        customerName: session.metadata?.customer_name || 'Guest',
        customerEmail: session.customer_email || '',
        customerPhone: session.metadata?.customer_phone || '',
        shippingStreet: session.metadata?.shipping_street || '',
        shippingCity: session.metadata?.shipping_city || '',
        shippingState: session.metadata?.shipping_state || '',
        shippingZip: session.metadata?.shipping_zip || '',
        shippingCountry: session.metadata?.shipping_country || '',
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
        status: 'paid',
        stripePaymentIntentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
      });

    // Get the inserted order
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (!order) throw new Error('Failed to create order');

    // Create order items from cart data
    if (cartData && Array.isArray(cartData)) {
      for (const item of cartData) {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (product) {
          await db.insert(orderItems).values({
            orderId: order.id,
            productId: item.productId,
            productName: product.name,
            productPrice: product.price,
            quantity: item.quantity,
            lineTotal: (parseFloat(product.price.toString()) * item.quantity).toString(),
          });
        }
      }
    }

    // Send notification to owner
    await notifyOwner({
      title: `New Order Received: ${orderNumber}`,
      content: `Order from ${session.customer_email} for $${total.toFixed(2)} has been placed.`,
    });

    console.log(`Order created successfully: ${orderNumber}`);
  } catch (error: any) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}
