/**
 * setup-stripe-products.mjs
 *
 * Creates all Visium Technologies products and prices in the Stripe sandbox.
 * Run with: node scripts/setup-stripe-products.mjs
 *
 * Products are created idempotently using metadata.visium_id so re-running
 * this script will update existing products rather than creating duplicates.
 */

import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// ─── Product definitions ──────────────────────────────────────────────────────
// All prices in USD cents (Stripe requires integer cents).
// For usage-based products we create the base monthly price.
// Annual prices are base * 12 * (1 - discount).

const PRODUCTS = [
  // ── Core Platforms ────────────────────────────────────────────────────────
  {
    id: 'trucontext',
    name: 'TruContext',
    description:
      'Agentic AI-powered cybersecurity intelligence platform. Patented multi-layered graph database. MITRE ATT&CK heritage. Includes first 10,000 monitored nodes.',
    category: 'Core Platform',
    monthlyPrice: 12499_00,   // $12,499/mo
    annualDiscount: 0.15,     // 15% off
    metadata: {
      base_fee: '12499',
      included_nodes: '10000',
      tier1_rate_per_node: '0.40',
      tier1_range: '10K–100K nodes',
      tier2_rate_per_node: '0.25',
      tier2_range: '100K+ nodes',
      agent_rate: '450',
    },
  },
  {
    id: 'truclaw-starter',
    name: 'TruClaw — Starter',
    description:
      'Autonomous AI agent platform. Starter tier: up to 10 agents, 20M tokens included per month.',
    category: 'Core Platform',
    monthlyPrice: 1299_00,    // $1,299/mo
    annualDiscount: 0.15,
    metadata: {
      tier: 'starter',
      max_agents: '10',
      tokens_included: '20000000',
    },
  },
  {
    id: 'truclaw-standard',
    name: 'TruClaw — Standard',
    description:
      'Autonomous AI agent platform. Standard tier: 11–50 agents, 100M tokens included per month.',
    category: 'Core Platform',
    monthlyPrice: 9999_00,    // $9,999/mo
    annualDiscount: 0.15,
    metadata: {
      tier: 'standard',
      max_agents: '50',
      tokens_included: '100000000',
    },
  },
  {
    id: 'truclaw-enterprise',
    name: 'TruClaw — Enterprise',
    description:
      'Autonomous AI agent platform. Enterprise tier: 50+ agents, unlimited tokens. Custom pricing — contact sales.',
    category: 'Core Platform',
    monthlyPrice: null,       // Contact Sales — no price created
    annualDiscount: 0.15,
    metadata: {
      tier: 'enterprise',
      pricing: 'contact_sales',
    },
  },
  {
    id: 'truinsight',
    name: 'Tru-InSight',
    description:
      'AI-powered video intelligence and situational awareness platform. Includes core analytics platform. Per-camera metered inference at $2.20/camera/mo.',
    category: 'Core Platform',
    monthlyPrice: 7499_00,    // $7,499/mo base
    annualDiscount: 0.15,
    metadata: {
      base_fee: '7499',
      camera_rate: '2.20',
      pricing_model: 'base_plus_usage',
    },
  },
  {
    id: 'eli',
    name: 'ELI — Emergency Location Intelligence',
    description:
      'Regional emergency response and law enforcement intelligence platform. First 500 cameras/nodes included. $4.00/node overage.',
    category: 'Core Platform',
    monthlyPrice: 9499_00,    // $9,499/mo base
    annualDiscount: 0.15,
    metadata: {
      base_fee: '9499',
      included_nodes: '500',
      overage_rate_per_node: '4.00',
    },
  },
  {
    id: 'full-suite-bundle',
    name: 'Full Suite Bundle',
    description:
      'All 4 core platforms (TruContext + TruClaw Standard + Tru-InSight + ELI) at 25% bundle discount. 20,000 nodes included. $3.00/node overage. $120/agent (10 agents included).',
    category: 'Bundle',
    monthlyPrice: 27500_00,   // $27,500/mo
    annualDiscount: 0.20,     // 20% off for bundle
    metadata: {
      base_fee: '27500',
      included_nodes: '20000',
      overage_rate_per_node: '3.00',
      included_agents: '10',
      agent_rate: '120',
      bundle_discount: '25',
    },
  },

  // ── Vertical Solutions ────────────────────────────────────────────────────
  {
    id: 'trucontext-oil-gas',
    name: 'TruContext — Oil & Gas',
    description:
      'Energy and critical infrastructure cybersecurity. OT/ICS network monitoring. First 500 OT endpoints included. $2.00/endpoint overage.',
    category: 'Vertical Solution',
    monthlyPrice: 24995_00,   // $24,995/mo
    annualDiscount: 0.15,
    metadata: {
      vertical: 'oil_gas',
      base_fee: '24995',
      included_endpoints: '500',
      overage_rate: '2.00',
    },
  },
  {
    id: 'smart-city-gov',
    name: 'Smart City — Government',
    description:
      'National smart city command and control. First 1,000 IoT nodes included. $2.00/node overage. Includes 3D city visualization and AI agents.',
    category: 'Vertical Solution',
    monthlyPrice: 28000_00,   // $28,000/mo
    annualDiscount: 0.15,
    metadata: {
      vertical: 'smart_city_government',
      base_fee: '28000',
      included_nodes: '1000',
      overage_rate: '2.00',
    },
  },
  {
    id: 'smart-city-municipal',
    name: 'Smart City — Municipal',
    description:
      'Municipal smart infrastructure management. First 500 IoT devices included. $2.00/device overage.',
    category: 'Vertical Solution',
    monthlyPrice: 20000_00,   // $20,000/mo
    annualDiscount: 0.15,
    metadata: {
      vertical: 'smart_city_municipal',
      base_fee: '20000',
      included_devices: '500',
      overage_rate: '2.00',
    },
  },
  {
    id: 'campus-security',
    name: 'ELI — Campus Security Suite',
    description:
      'Campus situational awareness and security intelligence. First 100 cameras/endpoints included. $2.00/camera overage.',
    category: 'Vertical Solution',
    monthlyPrice: 9995_00,    // $9,995/mo
    annualDiscount: 0.15,
    metadata: {
      vertical: 'campus_security',
      base_fee: '9995',
      included_cameras: '100',
      overage_rate: '2.00',
    },
  },
  {
    id: 'caseforge-legal',
    name: 'CaseForge Legal Intelligence',
    description:
      'AI-powered legal research and case intelligence platform. Flat-rate monthly subscription. No usage-based charges.',
    category: 'Vertical Solution',
    monthlyPrice: 2499_00,    // $2,499/mo flat
    annualDiscount: 0.15,
    metadata: {
      vertical: 'legal',
      pricing_model: 'flat_rate',
    },
  },
  {
    id: 'aspire-reporting',
    name: 'ASPIRE Reporting Platform',
    description:
      'Automated security posture and incident reporting. Flat-rate monthly subscription. No usage-based charges.',
    category: 'Vertical Solution',
    monthlyPrice: 1499_00,    // $1,499/mo flat
    annualDiscount: 0.15,
    metadata: {
      vertical: 'reporting',
      pricing_model: 'flat_rate',
    },
  },
  {
    id: 'truaddress',
    name: 'TruAddress — National Address Intelligence',
    description:
      'National address verification and geospatial intelligence. First 100,000 records included. $0.20/1K records overage.',
    category: 'Vertical Solution',
    monthlyPrice: 19950_00,   // $19,950/mo
    annualDiscount: 0.15,
    metadata: {
      vertical: 'address_intelligence',
      base_fee: '19950',
      included_records: '100000',
      overage_rate_per_1k: '0.20',
    },
  },
  {
    id: 'panelpulse',
    name: 'PanelPulse — Utility Grid Intelligence',
    description:
      'Smart utility grid monitoring and anomaly detection. Flat-rate monthly subscription.',
    category: 'Vertical Solution',
    monthlyPrice: 995_00,     // $995/mo flat
    annualDiscount: 0.15,
    metadata: {
      vertical: 'utility_grid',
      pricing_model: 'flat_rate',
    },
  },
  {
    id: 'smart-city-demo',
    name: 'Smart City Demo Suite',
    description:
      'Full smart city demonstration environment with live data feeds. Flat-rate monthly subscription.',
    category: 'Vertical Solution',
    monthlyPrice: 4750_00,    // $4,750/mo flat
    annualDiscount: 0.15,
    metadata: {
      vertical: 'smart_city_demo',
      pricing_model: 'flat_rate',
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function annualPrice(monthlyPrice, discount) {
  // Annual = monthly * 12 * (1 - discount), rounded to nearest cent
  return Math.round(monthlyPrice * 12 * (1 - discount));
}

async function findExistingProduct(visiumId) {
  const products = await stripe.products.search({
    query: `metadata['visium_id']:'${visiumId}'`,
  });
  return products.data[0] || null;
}

async function findExistingPrice(productId, interval, lookup_key) {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 20,
  });
  return prices.data.find(p => p.lookup_key === lookup_key) || null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const results = [];

for (const product of PRODUCTS) {
  console.log(`\n──────────────────────────────────────`);
  console.log(`Processing: ${product.name}`);

  // 1. Create or update the product
  let stripeProduct = await findExistingProduct(product.id);

  if (stripeProduct) {
    console.log(`  ↳ Product exists: ${stripeProduct.id} — updating...`);
    stripeProduct = await stripe.products.update(stripeProduct.id, {
      name: product.name,
      description: product.description,
      metadata: {
        ...product.metadata,
        visium_id: product.id,
        category: product.category,
      },
    });
  } else {
    console.log(`  ↳ Creating new product...`);
    stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: {
        ...product.metadata,
        visium_id: product.id,
        category: product.category,
      },
    });
    console.log(`  ✓ Created product: ${stripeProduct.id}`);
  }

  const entry = {
    visiumId: product.id,
    name: product.name,
    stripeProductId: stripeProduct.id,
    monthlyPriceId: null,
    annualPriceId: null,
  };

  // 2. Skip price creation for Contact Sales products
  if (product.monthlyPrice === null) {
    console.log(`  ↳ Contact Sales product — no price created`);
    entry.monthlyPriceId = 'contact_sales';
    entry.annualPriceId = 'contact_sales';
    results.push(entry);
    continue;
  }

  // 3. Create monthly price
  const monthlyLookupKey = `${product.id}_monthly`;
  let monthlyPrice = await findExistingPrice(stripeProduct.id, 'month', monthlyLookupKey);

  if (!monthlyPrice) {
    monthlyPrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.monthlyPrice,
      currency: 'usd',
      recurring: { interval: 'month' },
      lookup_key: monthlyLookupKey,
      metadata: {
        visium_id: product.id,
        billing_cycle: 'monthly',
        discount_pct: '0',
      },
    });
    console.log(`  ✓ Monthly price: ${monthlyPrice.id} ($${(product.monthlyPrice / 100).toLocaleString()}/mo)`);
  } else {
    console.log(`  ↳ Monthly price exists: ${monthlyPrice.id}`);
  }
  entry.monthlyPriceId = monthlyPrice.id;

  // 4. Create annual price (billed yearly, discounted)
  const annualAmount = annualPrice(product.monthlyPrice, product.annualDiscount);
  const annualLookupKey = `${product.id}_annual`;
  let annualPriceObj = await findExistingPrice(stripeProduct.id, 'year', annualLookupKey);

  if (!annualPriceObj) {
    annualPriceObj = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: annualAmount,
      currency: 'usd',
      recurring: { interval: 'year' },
      lookup_key: annualLookupKey,
      metadata: {
        visium_id: product.id,
        billing_cycle: 'annual',
        discount_pct: String(Math.round(product.annualDiscount * 100)),
        monthly_equivalent: String(Math.round(annualAmount / 12)),
      },
    });
    const monthlyEquiv = Math.round(annualAmount / 12 / 100);
    console.log(`  ✓ Annual price:  ${annualPriceObj.id} ($${(annualAmount / 100).toLocaleString()}/yr ≈ $${monthlyEquiv.toLocaleString()}/mo)`);
  } else {
    console.log(`  ↳ Annual price exists: ${annualPriceObj.id}`);
  }
  entry.annualPriceId = annualPriceObj.id;

  results.push(entry);
}

// ─── Output price ID map ──────────────────────────────────────────────────────

console.log('\n\n══════════════════════════════════════════════════════════════');
console.log('STRIPE PRICE ID MAP — paste into server/stripe/products.ts');
console.log('══════════════════════════════════════════════════════════════\n');

console.log('export const STRIPE_PRICES: Record<string, { monthly: string; annual: string }> = {');
for (const r of results) {
  console.log(`  '${r.visiumId}': {`);
  console.log(`    monthly: '${r.monthlyPriceId}',`);
  console.log(`    annual:  '${r.annualPriceId}',`);
  console.log(`  },`);
}
console.log('};');

console.log('\n\nSTRIPE PRODUCT ID MAP:\n');
for (const r of results) {
  console.log(`  ${r.visiumId}: ${r.stripeProductId}`);
}

console.log('\n✅ All Stripe products and prices created successfully.');
