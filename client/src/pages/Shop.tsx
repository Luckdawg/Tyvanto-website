/**
 * Shop.tsx — Completely Revamped (Apr 2026)
 *
 * Changes from previous version:
 * - Full dark theme (#050510 deep navy/black) with cyan (#00E5FF) accents
 * - Enterprise cybersecurity aesthetic: glassmorphism cards, spotlight effects, subtle animations
 * - New hybrid pricing model: fixed platform fee + transparent token/usage component
 * - 5 structured sections: Hero, Product Cards, Token Transparency, Bundle Table, Final CTA
 * - 4 core product offerings: TruContext, TruClaw, Tru-InSight, ELI
 * - SEO schema.org Product markup via Helmet-style meta injection
 * - Fully responsive, mobile-first layout
 * - Preserved existing cart/auth hooks and tRPC integration
 * - Removed old filter sidebar (replaced with enterprise pricing layout)
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import PricingCalculator from '@/components/PricingCalculator';
import RequestQuoteModal from '@/components/RequestQuoteModal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import {
  Shield,
  Brain,
  Eye,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  TrendingDown,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Activity,
  DollarSign,
  AlertCircle,
  Cpu,
  Network,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingTier {
  label: string;
  price: string;
  included: string;
}

interface Product {
  id: string;
  dbId: number;        // matches products.id in the database
  basePrice: number;   // base monthly price in USD (cents)
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  type: string;
  pricingTiers: PricingTier[];
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
}

interface Bundle {
  name: string;
  includes: string;
  monthlyRange: string;
  bestFor: string;
  highlight?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 'trucontext',
    dbId: 1,
    basePrice: 9999,
    icon: <Network className="h-8 w-8" />,
    name: 'TruContext Core Platform',
    tagline: 'Explainable AI Cybersecurity & Data Analytics',
    description:
      "Visium's flagship graph-based intelligence platform. Real-time correlation across billions of events with full explainability, MITRE ATT&CK mapping, and 30-day time-to-value. Enhanced from MITRE Corporation's CyGraph — the only patented scalable multi-layered graph database for cybersecurity.",
    type: 'Monthly SaaS (Hybrid)',
    pricingTiers: [
      { label: 'Starter', price: '$9,999/mo', included: 'First 10,000 nodes' },
      { label: 'Growth', price: '$0.50/node', included: 'Nodes 10K–100K' },
      { label: 'Enterprise', price: '$0.20/node', included: 'Volume discount 100K+' },
    ],
    features: [
      'Real-time graph correlation across billions of events',
      'MITRE ATT&CK framework integration',
      'Predictive threat intelligence & root cause analysis',
      '30-day time-to-value guarantee',
      'Annual billing saves ~15–20%',
      'DoD & Army Cyber Command heritage',
    ],
    cta: 'Request Demo',
    ctaHref: '/demo',
  },
  {
    id: 'truclaw',
    dbId: 2,
    basePrice: 799,
    badge: 'Most Popular',
    badgeColor: 'cyan',
    icon: <Shield className="h-8 w-8" />,
    name: 'TruClaw Agentic AI Governance',
    tagline: 'Zero-Trust Orchestration for Autonomous AI Workforces',
    description:
      'Safely orchestrate your autonomous AI workforce with LangGraph, NemoClaw zero-trust guardrails, human approval gates, and real-time cost monitoring. Built-in token optimizations reduce agent spend by 40–70% without sacrificing capability.',
    type: 'Monthly SaaS (Hybrid)',
    pricingTiers: [
      { label: 'Starter (≤10 agents)', price: '$799/mo', included: '20M tokens included' },
      { label: 'Standard (50+ agents)', price: '$7,999/mo', included: '150M tokens included' },
      { label: 'Enterprise', price: 'Custom', included: 'Unlimited tokens + dedicated optimization' },
    ],
    features: [
      'NemoClaw zero-trust AI guardrails',
      'LangGraph multi-agent orchestration',
      'Human-in-the-loop approval gates',
      'Real-time token cost dashboard',
      '40–70% token spend reduction',
      'Per-agent workflow budgets & caps',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/demo',
    highlight: true,
  },
  {
    id: 'truinsight',
    dbId: 3,
    basePrice: 2499,
    icon: <Eye className="h-8 w-8" />,
    name: 'Tru-InSight Video Intelligence',
    tagline: 'Proactive Camera Intelligence with Vision AI',
    description:
      'Turn existing cameras into proactive intelligence assets with Gemini/Z.ai vision AI. Selective frame analysis and batch processing keep inference costs low while delivering enterprise-grade situational awareness.',
    type: 'Monthly Add-on (Hybrid)',
    pricingTiers: [
      { label: 'Base Platform', price: '$2,499/mo', included: 'Core video analytics' },
      { label: 'Metered Inference', price: 'Usage-based', included: 'Optimized for video snapshots' },
      { label: 'Bundle Discount', price: 'Save 20%', included: 'When paired with TruContext' },
    ],
    features: [
      'Gemini/Z.ai vision AI integration',
      'Selective frame analysis (cost-optimized)',
      'Batch processing for off-peak savings',
      'Real-time anomaly detection',
      'Integrates with TruContext graph',
      'Camera-agnostic deployment',
    ],
    cta: 'Learn More',
    ctaHref: '/demo',
  },
  {
    id: 'eli',
    dbId: 4,
    basePrice: 7500,
    icon: <BarChart3 className="h-8 w-8" />,
    name: 'ELI Unified Surveillance Intelligence',
    tagline: 'National & Regional Physical Security Command',
    description:
      'White-label unified intelligence dashboard for physical security operations. Cameras, topology, POLE analytics, and live event correlation in one command view. Scales from regional deployments to national infrastructure.',
    type: 'Monthly SaaS (Hybrid Scaling)',
    pricingTiers: [
      { label: 'Regional', price: '$7,500–$15,000/mo', included: 'Scaled by cameras/nodes' },
      { label: 'Multi-Region', price: 'Custom', included: 'Multi-jurisdiction deployments' },
      { label: 'National', price: 'Custom', included: 'Full national infrastructure' },
    ],
    features: [
      'Unified physical + cyber intelligence',
      'POLE analytics (Person, Object, Location, Event)',
      'Live event correlation & alerting',
      'White-label customization',
      'Multi-jurisdiction support',
      'Critical infrastructure hardened',
    ],
    cta: 'Get Custom Quote',
    ctaHref: '/demo',
  },
];

const bundles: Bundle[] = [
  {
    name: 'TruContext Essentials',
    includes: 'TruContext Core',
    monthlyRange: 'From $9,999/mo',
    bestFor: 'SOC teams & threat analysts',
  },
  {
    name: 'TruClaw Secure AI',
    includes: 'TruClaw Governance',
    monthlyRange: 'From $799/mo',
    bestFor: 'AI teams deploying autonomous agents',
    highlight: true,
  },
  {
    name: 'Tru-InSight Intelligence',
    includes: 'TruContext + Tru-InSight',
    monthlyRange: 'From $11,999/mo',
    bestFor: 'Physical + cyber convergence',
  },
  {
    name: 'Complete Defense Suite',
    includes: 'TruContext + TruClaw + Tru-InSight',
    monthlyRange: 'Custom (save 25%)',
    bestFor: 'Enterprise full-stack defense',
  },
  {
    name: 'ELI National',
    includes: 'ELI + TruContext',
    monthlyRange: 'Custom',
    bestFor: 'National infrastructure & government',
  },
];

const costFeatures = [
  {
    icon: <Activity className="h-5 w-5" />,
    title: 'Real-Time Token Dashboard',
    desc: 'Live usage monitoring with configurable alerts before you hit budget thresholds.',
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'Smart Model Routing',
    desc: 'NemoClaw automatically routes triage tasks to cost-efficient models, reserving premium LLMs for complex reasoning.',
  },
  {
    icon: <DollarSign className="h-5 w-5" />,
    title: 'Per-Agent Token Budgets',
    desc: 'Set hard caps per agent or workflow. Agents that exceed budget pause and request human approval.',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Prompt Caching & Compression',
    desc: 'Semantic caching and context compression reduce redundant token consumption by up to 60%.',
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: 'Reflection Loop Governors',
    desc: 'Prevent runaway agent loops with configurable iteration limits and automatic escalation.',
  },
  {
    icon: <TrendingDown className="h-5 w-5" />,
    title: 'Monthly Optimization Reports',
    desc: 'Actionable cost reports with model-level breakdowns, waste identification, and tuning recommendations.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Shop() {
  const { addItem, items } = useCart();
  const [, navigate] = useLocation();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteDefaultProduct, setQuoteDefaultProduct] = useState<string>('');
  const [pricingSnapshot, setPricingSnapshot] = useState<{
    productInterest: string;
    estimatedNodes: number;
    estimatedAgents: number;
    estimatedMonthlyBudget: string;
    billingCycle?: 'monthly' | 'annual';
  } | undefined>(undefined);

  const handleRequestQuote = useCallback((snapshot: {
    productInterest: string;
    estimatedNodes: number;
    estimatedAgents: number;
    estimatedMonthlyBudget: string;
    billingCycle?: 'monthly' | 'annual';
  }) => {
    setPricingSnapshot(snapshot);
    setQuoteDefaultProduct(snapshot.productInterest);
    setQuoteModalOpen(true);
  }, []);

  const openQuoteModal = useCallback((productId?: string) => {
    setQuoteDefaultProduct(productId ?? '');
    setPricingSnapshot(undefined);
    setQuoteModalOpen(true);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    addItem({
      productId: product.dbId,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
    });
    setAddedProducts((prev) => new Set(Array.from(prev).concat(product.id)));
    toast.success(`${product.name} added to cart`, {
      description: 'Click the cart icon in the nav to review your order.',
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  }, [addItem, navigate]);

  // Animate the node counter in the hero
  useEffect(() => {
    const target = 10000;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimatedNodes(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a1f 40%, #050510 100%)' }}
    >
      {/* ── SEO Schema.org Product Markup ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Visium Technologies Enterprise AI Products',
            description:
              'Agentic AI governance, explainable AI cybersecurity, and token-efficient agent platforms',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: p.name,
                description: p.description,
                brand: { '@type': 'Brand', name: 'Visium Technologies' },
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                },
              },
            })),
          }),
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,229,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Spotlight glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #00E5FF 0%, transparent 70%)' }}
        />

        <div className="container relative z-10 text-center max-w-5xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-8">
            <Shield className="h-4 w-4" />
            MITRE CyGraph Heritage · Used by Critical Infrastructure &amp; Government
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Enterprise AI Agents &amp; Intelligence Platforms —{' '}
            <span style={{ color: '#00E5FF' }}>Governed, Transparent, and Cost-Optimized</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Deploy autonomous agents with TruContext intelligence and NemoClaw security. Our hybrid
            pricing gives you predictable costs even at scale — because runaway token spend is a
            security risk too.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#pricing-calculator">
              <Button
                size="lg"
                className="text-black font-bold px-8 py-4 text-base"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Calculate Your Price
              </Button>
            </a>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 text-base"
              >
                <Clock className="h-5 w-5 mr-2" />
                Schedule a Cost-Optimization Demo
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '40–70%', label: 'Token Cost Reduction' },
              { value: '30 Days', label: 'Time to Value' },
              { value: `${animatedNodes.toLocaleString()}+`, label: 'Nodes Supported' },
              { value: '99.9%', label: 'Platform Uptime SLA' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4"
              >
                <p className="text-2xl font-bold" style={{ color: '#00E5FF' }}>
                  {stat.value}
                </p>
                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. PRODUCT CARDS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" id="products">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Core Offerings
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Four Platforms. One Unified Defense.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Each platform is available as a standalone monthly subscription or as part of a
              bundled suite. All pricing is hybrid: a predictable base fee plus transparent
              metered usage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                  product.highlight
                    ? 'border-cyan-500/60 shadow-[0_0_40px_rgba(0,229,255,0.15)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
                style={{
                  background: product.highlight
                    ? 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(0,128,255,0.05) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Popular badge */}
                {product.badge && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                  >
                    <Star className="h-3 w-3 inline mr-1" />
                    {product.badge}
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,128,255,0.1))',
                        color: '#00E5FF',
                      }}
                    >
                      {product.icon}
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                        {product.type}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">{product.name}</h3>
                      <p className="text-cyan-400 text-sm mt-0.5">{product.tagline}</p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Pricing tiers */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">
                      Hybrid Pricing (billed monthly)
                    </p>
                    {product.pricingTiers.map((tier) => (
                      <div
                        key={tier.label}
                        className="flex items-center justify-between rounded-lg px-4 py-3 border border-white/8"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        <span className="text-slate-400 text-sm">{tier.label}</span>
                        <div className="text-right">
                          <span className="text-white font-bold text-sm">{tier.price}</span>
                          <span className="text-slate-500 text-xs block">{tier.included}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500 mt-2">
                      Annual billing saves 15–20%. Volume discounts available.
                    </p>
                  </div>

                  {/* Features toggle */}
                  <button
                    onClick={() =>
                      setExpandedProduct(expandedProduct === product.id ? null : product.id)
                    }
                    className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-300 transition-colors"
                  >
                    {expandedProduct === product.id ? (
                      <>
                        <ChevronUp className="h-4 w-4" /> Hide features
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" /> Show all features
                      </>
                    )}
                  </button>

                  {expandedProduct === product.id && (
                    <ul className="space-y-2 mb-6">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2
                            className="h-4 w-4 flex-shrink-0 mt-0.5"
                            style={{ color: '#00E5FF' }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA — Add to Cart + secondary action */}
                  <div className="space-y-2">
                    {addedProducts.has(product.id) ? (
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 font-semibold border-green-500/40 text-green-400 hover:bg-green-500/10"
                          variant="outline"
                          disabled
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Added to Cart
                        </Button>
                        <Link href="/cart">
                          <Button
                            className="font-semibold text-black"
                            style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            View Cart
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full font-semibold ${
                          product.highlight
                            ? 'text-black'
                            : 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10'
                        }`}
                        style={
                          product.highlight
                            ? { background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }
                            : {}
                        }
                        variant={product.highlight ? 'default' : 'outline'}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                    <button
                      onClick={() => openQuoteModal(product.id)}
                      className="w-full text-center text-xs text-slate-500 hover:text-cyan-400 transition-colors py-1"
                    >
                      Need custom pricing? Request a quote →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TOKEN TRANSPARENCY & COST-CONTROL SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" id="pricing-calculator">
        <div className="container max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              NemoClaw Cost Intelligence
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Sustainable Agent Operations
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Autonomous agents can be token-heavy. NemoClaw's cost intelligence layer makes
              hybrid pricing predictable — not a liability. Every dollar of token spend is
              visible, budgeted, and optimizable.
            </p>
          </div>

          {/* Cost features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {costFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 p-6 hover:border-cyan-500/30 transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,128,255,0.1))',
                    color: '#00E5FF',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Illustrative cost comparison bar */}
          <div
            className="rounded-2xl border border-cyan-500/20 p-8"
            style={{ background: 'rgba(0,229,255,0.04)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="h-6 w-6 text-cyan-400" />
              <h3 className="text-white font-bold text-lg">
                Typical Token Spend: Unoptimized vs. NemoClaw-Governed
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Unoptimized Agent Workflow', pct: 100, color: '#ef4444' },
                { label: 'With Smart Model Routing', pct: 65, color: '#f59e0b' },
                { label: 'With Caching + Compression', pct: 45, color: '#3b82f6' },
                { label: 'Full NemoClaw Optimization', pct: 30, color: '#00E5FF' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{row.label}</span>
                    <span className="font-bold" style={{ color: row.color }}>
                      {row.pct}% of baseline
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${row.pct}%`, background: row.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-4">
              * Illustrative example based on typical enterprise agentic AI deployments. Actual
              savings vary by workflow complexity and model mix.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. BUNDLE PACKAGES TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Bundle Packages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bundled Suites — Save Up to 25%
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Combine platforms for deeper integration, unified billing, and significant volume
              discounts. All bundles include dedicated onboarding and a named customer success
              manager.
            </p>
          </div>

          <div
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/10 bg-white/5">
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">
                Bundle
              </span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">
                Includes
              </span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">
                Monthly (Annual Billing)
              </span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">
                Best For
              </span>
            </div>

            {/* Table rows */}
            {bundles.map((bundle, i) => (
              <div
                key={bundle.name}
                className={`grid grid-cols-4 gap-4 px-6 py-5 border-b border-white/8 transition-colors hover:bg-white/5 ${
                  bundle.highlight ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
                } ${i === bundles.length - 1 ? 'border-b-0' : ''}`}
              >
                <div>
                  <span className="text-white font-semibold text-sm">{bundle.name}</span>
                  {bundle.highlight && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded text-xs font-bold text-black"
                      style={{ background: '#00E5FF' }}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <span className="text-slate-300 text-sm">{bundle.includes}</span>
                <span className="font-bold text-sm" style={{ color: '#00E5FF' }}>
                  {bundle.monthlyRange}
                </span>
                <span className="text-slate-400 text-sm">{bundle.bestFor}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            All prices shown for annual billing. Monthly billing available at +10%. Contact sales
            for multi-year agreements and government procurement vehicles.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. LIVE PRICING CALCULATOR
      ══════════════════════════════════════════════════════════════════════ */}
      <PricingCalculator onRequestQuote={handleRequestQuote} />

      {/* ══════════════════════════════════════════════════════════════════════
          6. FINAL CTA SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl border border-cyan-500/30 p-12 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(0,128,255,0.05) 100%)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.3) 0%, transparent 60%)',
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
                <AlertCircle className="h-4 w-4" />
                Limited onboarding slots available Q2 2026
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to deploy governed, cost-optimized AI agents?
              </h2>

              <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                Join critical infrastructure operators, government agencies, and Fortune 500
                security teams who trust Visium's NemoClaw-governed AI platforms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => openQuoteModal()}
                  className="text-black font-bold px-10 py-4 text-base"
                  style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                >
                  Get Custom Quote
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-10 py-4 text-base"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              <p className="text-slate-500 text-sm mt-6">
                Free trial includes up to 5 agents + 5M token budget. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Request a Quote Modal ── */}
      <RequestQuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultProduct={quoteDefaultProduct}
        pricingSnapshot={pricingSnapshot}
      />
    </div>
  );
}
