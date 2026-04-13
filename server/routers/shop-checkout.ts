/**
 * server/routers/shop-checkout.ts
 *
 * tRPC router for the /shop page Stripe subscription checkout flow.
 * Handles:
 *   - createSubscriptionCheckout: creates a Stripe Checkout Session for any
 *     product/billing-cycle combination from the shop page
 *   - getSubscriptionStatus: returns the current user's active subscriptions
 *   - listVisiumProducts: returns the full product catalogue for the frontend
 */

import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import Stripe from 'stripe';
import { ENV } from '../_core/env';
import { notifyOwner } from '../_core/notification';
import {
  VISIUM_PRODUCTS,
  getStripePrice,
  getProductsByCategory,
  type BillingCycle,
} from '../stripe/products';

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2024-06-20',
});

const billingCycleSchema = z.enum(['monthly', 'annual']);

export const shopCheckoutRouter = router({
  /**
   * Returns the full Visium product catalogue.
   * Used by the frontend to display product details and pricing.
   */
  listProducts: publicProcedure.query(() => {
    return Object.entries(VISIUM_PRODUCTS).map(([id, product]) => ({
      id,
      name: product.name,
      category: product.category,
      monthlyBaseUsd: product.monthlyBaseUsd,
      annualDiscount: product.annualDiscount,
      contactSales: product.contactSales ?? false,
      annualBaseUsd: product.contactSales
        ? 0
        : Math.round(product.monthlyBaseUsd * 12 * (1 - product.annualDiscount)),
    }));
  }),

  /**
   * Creates a Stripe Checkout Session for a subscription.
   * Accepts a product ID and billing cycle (monthly | annual).
   * Returns the Stripe-hosted checkout URL.
   */
  createSubscriptionCheckout: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        billingCycle: billingCycleSchema,
        /** Optional: pre-fill customer email */
        customerEmail: z.string().email().optional(),
        /** Optional: pre-fill customer name */
        customerName: z.string().optional(),
        /** Optional: estimated monthly cost from the calculator (for metadata) */
        estimatedMonthlyCost: z.number().optional(),
        /** Optional: usage context from the calculator */
        usageContext: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = VISIUM_PRODUCTS[input.productId];

      if (!product) {
        throw new Error(`Unknown product: ${input.productId}`);
      }

      // Contact Sales products cannot be purchased via Stripe
      if (product.contactSales) {
        throw new Error(
          `${product.name} requires a custom quote. Please contact sales.`
        );
      }

      const priceId = getStripePrice(input.productId, input.billingCycle);
      if (!priceId) {
        throw new Error(
          `No Stripe price found for ${input.productId} (${input.billingCycle})`
        );
      }

      const origin = ctx.req.headers.origin || 'https://visiumtechnologies.com';

      // Determine customer email — use authenticated user's email if available
      const customerEmail =
        (ctx.user as any)?.email ?? input.customerEmail;

      const userId = (ctx.user as any)?.id;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        ...(customerEmail ? { customer_email: customerEmail } : {}),
        allow_promotion_codes: true,
        // Link back to the user account if authenticated
        ...(userId
          ? { client_reference_id: String(userId) }
          : {}),
        success_url: `${origin}/shop?checkout=success&session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(input.productId)}`,
        cancel_url: `${origin}/shop?checkout=cancelled`,
        metadata: {
          visium_product_id: input.productId,
          product_name: product.name,
          billing_cycle: input.billingCycle,
          customer_name: input.customerName ?? '',
          customer_email: customerEmail ?? '',
          user_id: userId ? String(userId) : '',
          estimated_monthly_cost: input.estimatedMonthlyCost
            ? String(input.estimatedMonthlyCost)
            : '',
          usage_context: input.usageContext ?? '',
          environment: 'sandbox',
        },
        subscription_data: {
          metadata: {
            visium_product_id: input.productId,
            billing_cycle: input.billingCycle,
            user_id: userId ? String(userId) : '',
          },
        },
      });

      // Notify the owner of a new checkout initiation
      await notifyOwner({
        title: `Shop Checkout Started: ${product.name}`,
        content: `A ${input.billingCycle} checkout session was created for ${product.name}${customerEmail ? ` by ${customerEmail}` : ''}.${input.estimatedMonthlyCost ? ` Estimated monthly cost: $${input.estimatedMonthlyCost.toLocaleString()}.` : ''}`,
      }).catch(() => {
        // Non-fatal — don't block checkout if notification fails
      });

      return {
        url: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Retrieves the details of a completed checkout session.
   * Used on the success page to confirm the subscription.
   */
  getCheckoutSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
        expand: ['subscription', 'customer'],
      });

      return {
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        productId: session.metadata?.visium_product_id,
        productName: session.metadata?.product_name,
        billingCycle: session.metadata?.billing_cycle as BillingCycle | undefined,
        subscriptionId:
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id,
      };
    }),

  /**
   * Returns all active Visium subscriptions for the authenticated user.
   * Looks up by customer email in Stripe.
   */
  getMySubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const userEmail = (ctx.user as any)?.email;
    if (!userEmail) return [];

    // Find Stripe customers with this email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 5,
    });

    if (customers.data.length === 0) return [];

    const subscriptions: Array<{
      id: string;
      productId: string;
      productName: string;
      billingCycle: string;
      status: string;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd: boolean;
    }> = [];

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 20,
        expand: ['data.items.data.price.product'],
      });

      for (const sub of subs.data) {
        const productId = sub.metadata?.visium_product_id;
        const product = productId ? VISIUM_PRODUCTS[productId] : null;

        subscriptions.push({
          id: sub.id,
          productId: productId ?? 'unknown',
          productName: product?.name ?? 'Unknown Product',
          billingCycle: sub.metadata?.billing_cycle ?? 'monthly',
          status: sub.status,
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
      }
    }

    return subscriptions;
  }),
});
