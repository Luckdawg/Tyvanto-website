import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  getAllProducts,
  getProductById,
  getOrdersByUserId,
  getOrderById,
  getOrderByStripePaymentIntentId,
  createOrder,
  updateOrderStatus,
  getOrderItems,
  createOrderItems,
  generateOrderNumber,
  getAllOrders,
} from "../db-ecommerce";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { products } from "../../drizzle/schema";
import { eq, gte, lte, inArray, or, like, asc, desc } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey);

export const ecommerceRouter = router({
  // Get all active products
  getAllProducts: publicProcedure.query(async () => {
    return getAllProducts();
  }),

  // Get product by ID
  getProduct: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return getProductById(input.id);
  }),

  // Create checkout session
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().min(1),
          })
        ),
        customerEmail: z.string().email(),
        customerName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Fetch product details for line items
      const lineItems: any[] = [];

      for (const item of input.items) {
        const product = await getProductById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.imageUrl ? [product.imageUrl] : undefined,
            },
            unit_amount: Math.round(parseFloat(product.price.toString()) * 100),
          },
          quantity: item.quantity,
        });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: input.customerEmail,
        success_url: `${ctx.req.headers.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/cart`,
        allow_promotion_codes: true,
        metadata: {
          customer_name: input.customerName,
          customer_email: input.customerEmail,
        },
      });

      return { url: session.url };
    }),

  // Get checkout session details
  getCheckoutSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return session;
    }),

  // Get user's orders
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    return getOrdersByUserId(ctx.user.id);
  }),

  // Get order details
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input, ctx }) => {
      const order = await getOrderById(input.orderId);
      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found");
      }
      const items = await getOrderItems(input.orderId);
      return { ...order, items };
    }),

  // Get all orders (admin only)
  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return getAllOrders();
  }),

  // Update order status (admin only)
  updateOrderStatus: protectedProcedure
    .input(z.object({ orderId: z.number(), status: z.enum(['pending', 'paid', 'failed', 'refunded']) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return updateOrderStatus(input.orderId, input.status);
    }),
});
