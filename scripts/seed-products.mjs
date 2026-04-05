import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const db = drizzle(DATABASE_URL);

const sampleProducts = [
  {
    name: "Premium Widget Kit",
    description: "Complete set of high-quality widgets with custom engraving and lifetime support.",
    price: "49.99",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    sku: "WIDGET-KIT-001",
    stock: 100,
    active: 1,
  },
  {
    name: "Deluxe Tool Set",
    description: "Heavy-duty 25-piece tool collection in a rugged carrying case, perfect for home or workshop.",
    price: "129.00",
    imageUrl: "https://images.unsplash.com/photo-1578926314433-f66f1c27f422?w=500&h=500&fit=crop",
    sku: "TOOLS-DELUXE-001",
    stock: 50,
    active: 1,
  },
  {
    name: "Custom Leather Journal",
    description: "Handcrafted genuine leather notebook with personalized monogram and 200 premium pages.",
    price: "39.99",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop",
    sku: "JOURNAL-LEATHER-001",
    stock: 75,
    active: 1,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with 30-hour battery life and studio-quality sound.",
    price: "89.99",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    sku: "HEADPHONES-NC-001",
    stock: 60,
    active: 1,
  },
  {
    name: "Organic Coffee Sampler Pack",
    description: "6 single-origin coffees from around the world, freshly roasted and ground-to-order.",
    price: "34.99",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688bcf566?w=500&h=500&fit=crop",
    sku: "COFFEE-SAMPLER-001",
    stock: 200,
    active: 1,
  },
  {
    name: "Eco-Friendly Water Bottle Set",
    description: "2-pack insulated stainless steel bottles (20oz + 32oz) with leak-proof lids.",
    price: "24.99",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7e36dd5f5a0e?w=500&h=500&fit=crop",
    sku: "BOTTLE-ECO-001",
    stock: 150,
    active: 1,
  },
  {
    name: "Digital Photography Course Bundle",
    description: "Lifetime access to 10 video modules + downloadable presets and cheat sheets.",
    price: "79.00",
    imageUrl: "https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop",
    sku: "COURSE-PHOTO-001",
    stock: 999,
    active: 1,
  },
  {
    name: "Personalized Wooden Cutting Board",
    description: "Custom engraved bamboo board with family name or logo — food-safe and durable.",
    price: "59.99",
    imageUrl: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    sku: "BOARD-BAMBOO-001",
    stock: 80,
    active: 1,
  },
];

async function seedProducts() {
  try {
    console.log("🌱 Seeding products...");
    
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
      console.log(`✅ Created: ${product.name}`);
    }
    
    console.log("\n✨ All products seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
