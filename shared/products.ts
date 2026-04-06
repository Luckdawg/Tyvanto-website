/**
 * Centralized product catalog for Visium Technologies.
 * These IDs must match the `id` column in the `products` database table.
 * The seed script inserts them in this order, so IDs are 1–4.
 */

export interface CatalogProduct {
  id: number;           // DB primary key
  slug: string;         // URL-safe identifier
  name: string;
  tagline: string;
  description: string;
  price: number;        // base monthly price in USD (dollars)
  interval: 'month' | 'year';
  tier: string;         // display tier label
  badge?: string;
  highlight?: boolean;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 1,
    slug: 'trucontext-starter',
    name: 'TruContext Core Platform',
    tagline: 'Explainable AI Cybersecurity & Data Analytics',
    description:
      'Starter Tier — First 10,000 nodes included. Enhanced from MITRE CyGraph with patented multi-layered graph database, MITRE ATT&CK integration, and predictive threat intelligence.',
    price: 9999,
    interval: 'month',
    tier: 'Starter',
  },
  {
    id: 2,
    slug: 'truclaw-starter',
    name: 'TruClaw Agentic AI Governance',
    tagline: 'Zero-Trust Orchestration for Autonomous AI Workforces',
    description:
      'Starter (≤10 agents) — 20M tokens included. NemoClaw zero-trust guardrails, LangGraph orchestration, human-in-the-loop approval gates, and real-time token cost dashboard.',
    price: 799,
    interval: 'month',
    tier: 'Starter',
    badge: 'Most Popular',
    highlight: true,
  },
  {
    id: 3,
    slug: 'tru-insight-base',
    name: 'Tru-InSight Video Intelligence',
    tagline: 'Proactive Camera Intelligence with Vision AI',
    description:
      'Base Platform — Core video analytics included. Gemini/Z.ai vision AI, selective frame analysis, batch processing, and real-time anomaly detection.',
    price: 2499,
    interval: 'month',
    tier: 'Base',
  },
  {
    id: 4,
    slug: 'eli-regional',
    name: 'ELI Unified Surveillance Intelligence',
    tagline: 'National & Regional Physical Security Command',
    description:
      'Regional Tier — Scaled by cameras/nodes. Unified physical + cyber intelligence, POLE analytics, live event correlation, and white-label customization.',
    price: 7500,
    interval: 'month',
    tier: 'Regional',
  },
];

/** Look up a catalog product by its DB id */
export function getCatalogProductById(id: number): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.id === id);
}

/** Look up a catalog product by its slug */
export function getCatalogProductBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}
