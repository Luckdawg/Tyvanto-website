import { getDb } from "./db";
import { products, orders, orderItems, type InsertProduct, type InsertOrder, type InsertOrderItem } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Get all active products
 */
export async function getAllProducts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(products).where(eq(products.active, 1)).orderBy(products.name);
}

/**
 * Get product by ID
 */
export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Create a new product
 */
export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

/**
 * Update product
 */
export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(data).where(eq(products.id, id));
}

/**
 * Get all orders for a user
 */
export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

/**
 * Get order by ID
 */
export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result[0] || null;
}

/**
 * Get order by Stripe Payment Intent ID
 */
export async function getOrderByStripePaymentIntentId(stripePaymentIntentId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);
  return result[0] || null;
}

/**
 * Create a new order
 */
export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  return result;
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: number, status: "pending" | "paid" | "failed" | "refunded") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set({ status }).where(eq(orders.id, id));
}

/**
 * Get order items for an order
 */
export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

/**
 * Create order items
 */
export async function createOrderItems(items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (items.length === 0) return;
  return db.insert(orderItems).values(items);
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}-${random}`;
}
