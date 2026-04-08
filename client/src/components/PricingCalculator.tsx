/**
 * PricingCalculator.tsx
 * Interactive live pricing calculator for the /shop page.
 *
 * Pricing model — mirrors the Core Offerings cards exactly:
 *
 *   TruContext  — $9,999/mo (first 10K nodes) · $0.50/node (10K–100K) · $0.20/node (100K+)
 *                 + $150/agent
 *   TruClaw     — $799/mo (≤10 agents, 20M tokens) · $7,999/mo (11–50 agents) · Custom (50+)
 *                 Shown as $7,999 cap for 50-agent tier; enterprise shown as "Contact Sales"
 *   Tru-InSight — $2,499/mo base + $0.08/node metered inference
 *                 20% bundle discount when paired with TruContext (shown as note)
 *   ELI         — $7,500/mo base (regional, scaled by cameras/nodes) · $0.15/node above 500
 *                 Multi-region/national shown as "Contact Sales"
 *   Full Suite  — $9,999 + $2,499 + $7,500 = $19,998 base, blended node rate $0.40/node (10K–100K)
 *                 25% bundle discount applied
 */

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  Server,
  Bot,
  TrendingDown,
  ArrowRight,
  Info,
  Zap,
  Shield,
  Eye,
  Brain,
  Package,
  BarChart2,
  Phone,
  CalendarDays,
  Sparkles,
  Globe,
  Building2,
  Briefcase,
  BookOpen,
  MapPin,
  Radio,
  Users,
} from 'lucide-react';
import CompetitorComparisonOverlay from './CompetitorComparisonOverlay';

// ─── Pricing Config ───────────────────────────────────────────────────────────

interface TierRate {
  upTo: number;       // node/agent count ceiling (Infinity = no cap)
  rate: number;       // per-unit rate for this tier
}

interface ProductConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  baseFee: number;         // monthly platform fee (covers first tier)
  baseFeeLabel: string;    // human-readable description of what baseFee covers
  nodeTiers: TierRate[];   // tiered node/endpoint rates (above the base tier)
  agentRate: number;       // per active AI agent (monthly)
  agentIncluded: number;   // agents included in base fee (no extra charge)
  maxAgentsBeforeCustom: number; // above this → "Contact Sales"
  description: string;
  highlight?: string;
  customAboveNodes?: number; // above this node count → show "Contact Sales" note
  isFlat?: boolean;          // flat-rate product — no node/agent sliders
  category?: string;         // product category for grouping in selector
}

const PRODUCTS: ProductConfig[] = [
  {
    id: 'trucontext',
    label: 'TruContext',
    icon: <Shield className="h-4 w-4" />,
    color: '#00E5FF',
    baseFee: 9999,
    baseFeeLabel: 'First 10,000 nodes',
    nodeTiers: [
      { upTo: 100_000,   rate: 0.50 },   // 10K–100K: $0.50/node
      { upTo: Infinity,  rate: 0.20 },   // 100K+: $0.20/node
    ],
    agentRate: 150,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 500,
    description: 'Core cyber-physical intelligence platform',
    highlight: 'Most Popular',
  },
  {
    id: 'truclaw',
    label: 'TruClaw',
    icon: <Brain className="h-4 w-4" />,
    color: '#7C3AED',
    baseFee: 799,
    baseFeeLabel: '≤10 agents · 20M tokens included',
    nodeTiers: [],  // TruClaw is agent-based, not node-based
    agentRate: 0,   // handled via tiers below
    agentIncluded: 10,
    maxAgentsBeforeCustom: 50,
    description: 'Agentic AI governance & control layer',
  },
  {
    id: 'truinsight',
    label: 'Tru-InSight',
    icon: <Eye className="h-4 w-4" />,
    color: '#0EA5E9',
    baseFee: 2499,
    baseFeeLabel: 'Core video analytics platform',
    nodeTiers: [
      { upTo: Infinity, rate: 0.08 },  // metered inference per camera/node
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    description: 'Video intelligence & physical security fusion',
  },
  {
    id: 'eli',
    label: 'ELI',
    icon: <Zap className="h-4 w-4" />,
    color: '#F59E0B',
    baseFee: 7500,
    baseFeeLabel: 'Regional deployment (up to 500 cameras/nodes)',
    nodeTiers: [
      { upTo: Infinity, rate: 0.15 },  // above 500 nodes: $0.15/node
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    customAboveNodes: 5000,  // multi-region/national → Contact Sales
    description: 'Unified surveillance intelligence platform',
  },
  {
    id: 'bundle',
    label: 'Full Suite',
    icon: <Package className="h-4 w-4" />,
    color: '#10B981',
    // Base = TruContext $9,999 + Tru-InSight $2,499 + ELI $7,500 = $19,998 → 25% discount = $14,999
    baseFee: 14999,
    baseFeeLabel: 'All 4 platforms · 25% bundle discount applied',
    nodeTiers: [
      { upTo: 100_000,  rate: 0.40 },  // blended rate (vs $0.50 TruContext alone)
      { upTo: Infinity, rate: 0.16 },  // blended volume rate
    ],
    agentRate: 120,   // blended agent rate (vs $150 TruContext alone)
    agentIncluded: 10,
    maxAgentsBeforeCustom: 500,
    description: 'All 4 products — best per-unit value',
    highlight: 'Best Value',
    category: 'Core',
  },
  // ── Vertical / Industry Solutions ──────────────────────────────────────────
  {
    id: 'oil-gas',
    label: 'Oil & Gas',
    icon: <Zap className="h-4 w-4" />,
    color: '#FFA500',
    baseFee: 18500,
    baseFeeLabel: 'Refinery operations intelligence platform',
    nodeTiers: [
      { upTo: Infinity, rate: 0.12 },  // per SCADA/OT endpoint above 500
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    customAboveNodes: 10000,
    description: 'Energy & critical infrastructure OT/IT',
    category: 'Vertical',
  },
  {
    id: 'smart-city-gov',
    label: 'Smart City Gov',
    icon: <Globe className="h-4 w-4" />,
    color: '#4A90D9',
    baseFee: 28000,
    baseFeeLabel: 'National smart city command platform',
    nodeTiers: [
      { upTo: Infinity, rate: 0.10 },  // per IoT/sensor node above 1000
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    customAboveNodes: 50000,
    description: 'National government smart city suite',
    category: 'Vertical',
  },
  {
    id: 'smart-city-municipal',
    label: 'Smart City Municipal',
    icon: <Building2 className="h-4 w-4" />,
    color: '#64C864',
    baseFee: 12500,
    baseFeeLabel: 'Municipal IoT monitoring platform',
    nodeTiers: [
      { upTo: Infinity, rate: 0.08 },  // per IoT device above 200
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    customAboveNodes: 20000,
    description: 'Municipal smart infrastructure command',
    category: 'Vertical',
  },
  {
    id: 'campus-security',
    label: 'Campus Security',
    icon: <Shield className="h-4 w-4" />,
    color: '#9370DB',
    baseFee: 5500,
    baseFeeLabel: 'Campus security intelligence platform',
    nodeTiers: [
      { upTo: Infinity, rate: 0.06 },  // per camera/endpoint above 100
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    customAboveNodes: 5000,
    description: 'ELI campus situational awareness',
    category: 'Vertical',
  },
  {
    id: 'caseforge',
    label: 'CaseForge Legal',
    icon: <Briefcase className="h-4 w-4" />,
    color: '#DAA520',
    baseFee: 2499,
    baseFeeLabel: 'Legal case intelligence platform (flat rate)',
    nodeTiers: [],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    description: 'AI-powered litigation command center',
    isFlat: true,
    category: 'Vertical',
  },
  {
    id: 'aspire',
    label: 'ASPIRE Reporting',
    icon: <BookOpen className="h-4 w-4" />,
    color: '#6495ED',
    baseFee: 1499,
    baseFeeLabel: 'Public reporting platform (flat rate)',
    nodeTiers: [],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    description: 'ADA-compliant charter school reporting',
    isFlat: true,
    category: 'Vertical',
  },
  {
    id: 'truaddress',
    label: 'TruAddress',
    icon: <MapPin className="h-4 w-4" />,
    color: '#DC143C',
    baseFee: 8500,
    baseFeeLabel: 'National address intelligence platform',
    nodeTiers: [
      { upTo: Infinity, rate: 0.002 },  // per verified address record above 100K
    ],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    customAboveNodes: 5000000,
    description: 'AI national address data collection',
    category: 'Vertical',
  },
  {
    id: 'panelpulse',
    label: 'PanelPulse',
    icon: <Radio className="h-4 w-4" />,
    color: '#00CED1',
    baseFee: 799,
    baseFeeLabel: 'Research panel management (flat rate)',
    nodeTiers: [],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    description: 'WhatsApp/SMS survey panel platform',
    isFlat: true,
    category: 'Vertical',
  },
  {
    id: 'smart-city-demo',
    label: 'Smart City Demo',
    icon: <Users className="h-4 w-4" />,
    color: '#FF69B4',
    baseFee: 2499,
    baseFeeLabel: 'Smart city proposal & demo suite (flat rate)',
    nodeTiers: [],
    agentRate: 0,
    agentIncluded: 0,
    maxAgentsBeforeCustom: 0,
    description: 'RFP toolkit & white-label demo suite',
    isFlat: true,
    category: 'Vertical',
  },
];

// ─── Cost calculation ─────────────────────────────────────────────────────────

/**
 * Calculate node cost using tiered rates.
 * The baseFee covers the first tier (e.g., first 10K nodes for TruContext).
 * Tiers are applied to nodes ABOVE the base tier threshold.
 */
function calcNodeCost(product: ProductConfig, nodes: number): number {
  if (product.nodeTiers.length === 0) return 0;

  // Determine the base tier threshold (nodes included in baseFee)
  const baseTierNodes =
    product.id === 'trucontext' ? 10_000 :
    product.id === 'eli'        ? 500 :
    0;  // Tru-InSight and bundle: all nodes are metered

  const billableNodes = Math.max(0, nodes - baseTierNodes);
  if (billableNodes === 0) return 0;

  let remaining = billableNodes;
  let cost = 0;
  let prevCap = 0;

  for (const tier of product.nodeTiers) {
    const tierCap = tier.upTo === Infinity ? Infinity : Math.max(0, tier.upTo - baseTierNodes);
    const tierNodes = Math.min(remaining, tierCap - prevCap);
    if (tierNodes <= 0) break;
    cost += tierNodes * tier.rate;
    remaining -= tierNodes;
    prevCap = tierCap;
    if (remaining <= 0) break;
  }

  return Math.round(cost);
}

/**
 * Calculate TruClaw agent cost using its tier model:
 *   ≤10 agents: included in $799 base
 *   11–50 agents: $7,999/mo flat (Standard tier)
 *   50+ agents: Enterprise — show "Contact Sales"
 */
function calcTruClawCost(agents: number): { base: number; agentCost: number; isCustom: boolean } {
  if (agents <= 10) return { base: 799, agentCost: 0, isCustom: false };
  if (agents <= 50) return { base: 7999, agentCost: 0, isCustom: false };
  return { base: 7999, agentCost: 0, isCustom: true };
}

// ─── Slider helpers ───────────────────────────────────────────────────────────

function sliderToNodes(v: number): number {
  if (v === 0) return 0;
  return Math.round(Math.pow(10, (v / 100) * 6));
}

function nodesToSlider(n: number): number {
  if (n <= 0) return 0;
  return Math.round((Math.log10(n) / 6) * 100);
}

function formatNodes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

// Annual discount rates per product tier
const ANNUAL_DISCOUNT: Record<string, number> = {
  trucontext:          0.15,
  truclaw:             0.15,
  truinsight:          0.15,
  eli:                 0.15,
  bundle:              0.20,
  'oil-gas':           0.15,
  'smart-city-gov':    0.15,
  'smart-city-municipal': 0.15,
  'campus-security':   0.15,
  caseforge:           0.15,
  aspire:              0.15,
  truaddress:          0.15,
  panelpulse:          0.15,
  'smart-city-demo':   0.15,
};

type BillingCycle = 'monthly' | 'annual';

interface PricingCalculatorProps {
  onRequestQuote: (snapshot: {
    productInterest: string;
    estimatedNodes: number;
    estimatedAgents: number;
    estimatedMonthlyBudget: string;
    billingCycle: BillingCycle;
  }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingCalculator({ onRequestQuote }: PricingCalculatorProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('trucontext');
  const [nodeSlider, setNodeSlider] = useState<number>(40); // ~10K nodes default
  const [agents, setAgents] = useState<number>(10);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const nodes = useMemo(() => sliderToNodes(nodeSlider), [nodeSlider]);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProduct) ?? PRODUCTS[0],
    [selectedProduct]
  );

  const breakdown = useMemo(() => {
    if (product.id === 'truclaw') {
      const { base, agentCost, isCustom } = calcTruClawCost(agents);
      return {
        base,
        nodeCost: 0,
        agentCost,
        total: base + agentCost,
        annualTotal: (base + agentCost) * 12,
        isCustom,
        agentTierLabel:
          agents <= 10 ? '≤10 agents (Starter)' :
          agents <= 50 ? '11–50 agents (Standard)' :
          '50+ agents (Enterprise)',
      };
    }

    const base = product.baseFee;
    const nodeCost = calcNodeCost(product, nodes);
    const agentCost = product.agentRate > 0
      ? Math.max(0, agents - product.agentIncluded) * product.agentRate
      : 0;
    const isCustom =
      (product.customAboveNodes !== undefined && nodes > product.customAboveNodes) ||
      (product.maxAgentsBeforeCustom > 0 && agents > product.maxAgentsBeforeCustom);
    const total = base + nodeCost + agentCost;

    return {
      base,
      nodeCost,
      agentCost,
      total,
      annualTotal: total * 12,
      isCustom,
      agentTierLabel: null,
    };
  }, [product, nodes, agents]);

  // Annual discount
  const annualDiscountRate = ANNUAL_DISCOUNT[selectedProduct] ?? 0.15;
  const effectiveMonthly = useMemo(() => {
    if (billingCycle === 'annual' && !breakdown.isCustom) {
      return Math.round(breakdown.total * (1 - annualDiscountRate));
    }
    return breakdown.total;
  }, [billingCycle, breakdown.total, breakdown.isCustom, annualDiscountRate]);

  const annualSavings = useMemo(() => {
    if (billingCycle === 'annual' && !breakdown.isCustom) {
      return Math.round(breakdown.total * annualDiscountRate * 12);
    }
    return 0;
  }, [billingCycle, breakdown.total, breakdown.isCustom, annualDiscountRate]);

  const annualTotal = effectiveMonthly * 12;

  // Comparison: what legacy SIEM/SOC tooling would cost at this scale
  const legacyCost = useMemo(() => {
    return Math.round(5000 + nodes * 0.25 + agents * 500);
  }, [nodes, agents]);

  const savings = Math.max(0, legacyCost - effectiveMonthly);
  const savingsPct = legacyCost > 0 ? Math.round((savings / legacyCost) * 100) : 0;

  const handleRequestQuote = useCallback(() => {
    onRequestQuote({
      productInterest: selectedProduct,
      estimatedNodes: nodes,
      estimatedAgents: agents,
      estimatedMonthlyBudget: breakdown.isCustom
        ? 'Enterprise / Custom'
        : `${formatCurrency(effectiveMonthly)}/mo (${billingCycle})`,
      billingCycle,
    });
  }, [selectedProduct, nodes, agents, effectiveMonthly, breakdown.isCustom, billingCycle, onRequestQuote]);

  // Show "Contact Sales" for enterprise-scale configs
  const showCustomPricing = breakdown.isCustom;

  return (
    <section
      id="pricing-calculator"
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a1f 50%, #050510 100%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.2)',
              color: '#00E5FF',
            }}
          >
            <Calculator className="h-3.5 w-3.5" />
            LIVE PRICING CALCULATOR
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Estimate Your Monthly Investment
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Adjust the sliders to match your environment. Pricing mirrors the Core Offerings
            cards exactly — no hidden fees, no surprise overages.
          </p>
        </div>

        {/* ── Billing Cycle Toggle ── */}
        <div className="flex justify-center mb-8">
          <div
            className="relative inline-flex items-center rounded-full p-1 gap-1"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background: billingCycle === 'monthly' ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: billingCycle === 'monthly' ? '#fff' : '#64748b',
                boxShadow: billingCycle === 'monthly' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              <CalendarDays className="h-4 w-4" />
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background: billingCycle === 'annual' ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: billingCycle === 'annual' ? '#00E5FF' : '#64748b',
                boxShadow: billingCycle === 'annual' ? '0 2px 8px rgba(0,229,255,0.2)' : 'none',
                border: billingCycle === 'annual' ? '1px solid rgba(0,229,255,0.3)' : '1px solid transparent',
              }}
            >
              <Sparkles className="h-4 w-4" />
              Annual
              <span
                className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: billingCycle === 'annual' ? '#00E5FF' : 'rgba(0,229,255,0.2)',
                  color: billingCycle === 'annual' ? '#000' : '#00E5FF',
                }}
              >
                Save {selectedProduct === 'bundle' ? '20%' : '15%'}
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* ── Left: Controls ── */}
              <div className="lg:col-span-3 p-8 space-y-8">

                {/* Product selector — grouped by Core / Vertical */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3 uppercase tracking-wide">
                    Select Product
                  </label>

                  {/* Core Platforms group */}
                  <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2">Core Platforms</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {PRODUCTS.filter((p) => !p.category || p.category === 'Core').map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProduct(p.id)}
                        className="relative flex flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition-all duration-200"
                        style={{
                          background: selectedProduct === p.id ? `${p.color}18` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selectedProduct === p.id ? p.color + '50' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: selectedProduct === p.id ? `0 0 16px ${p.color}20` : 'none',
                        }}
                      >
                        {p.highlight && (
                          <span
                            className="absolute -top-2 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: p.color, color: '#000' }}
                          >
                            {p.highlight}
                          </span>
                        )}
                        <span style={{ color: selectedProduct === p.id ? p.color : '#64748b' }}>
                          {p.icon}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: selectedProduct === p.id ? '#fff' : '#94a3b8' }}
                        >
                          {p.label}
                        </span>
                        <span className="text-xs text-slate-500 leading-tight">{p.description}</span>
                      </button>
                    ))}
                  </div>

                  {/* Vertical Solutions group */}
                  <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2">Vertical Solutions</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRODUCTS.filter((p) => p.category === 'Vertical').map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProduct(p.id)}
                        className="relative flex flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition-all duration-200"
                        style={{
                          background: selectedProduct === p.id ? `${p.color}18` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selectedProduct === p.id ? p.color + '50' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: selectedProduct === p.id ? `0 0 16px ${p.color}20` : 'none',
                        }}
                      >
                        <span style={{ color: selectedProduct === p.id ? p.color : '#64748b' }}>
                          {p.icon}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: selectedProduct === p.id ? '#fff' : '#94a3b8' }}
                        >
                          {p.label}
                        </span>
                        <span className="text-xs text-slate-500 leading-tight">{p.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flat-rate product info */}
                {product.isFlat && (
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-4"
                    style={{ background: `${product.color}10`, border: `1px solid ${product.color}30` }}
                  >
                    <div className="p-2 rounded-lg" style={{ background: `${product.color}20`, color: product.color }}>
                      {product.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{product.label}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Flat-rate product — one predictable monthly fee with no usage-based charges.
                        Price shown is the base rate; volume discounts available for multi-seat or multi-region deployments.
                      </p>
                    </div>
                  </div>
                )}

                {/* Node slider — hidden for TruClaw (agent-only) and flat-rate products */}
                {product.id !== 'truclaw' && !product.isFlat && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold uppercase tracking-wide">
                        <Server className="h-4 w-4 text-slate-500" />
                        {product.id === 'truinsight' ? 'Cameras / Endpoints' :
                         product.id === 'eli' ? 'Cameras / Nodes' :
                         product.id === 'oil-gas' ? 'OT/SCADA Endpoints' :
                         product.id === 'smart-city-gov' ? 'IoT Sensor Nodes' :
                         product.id === 'smart-city-municipal' ? 'IoT Devices' :
                         product.id === 'campus-security' ? 'Cameras / Endpoints' :
                         product.id === 'truaddress' ? 'Address Records (×1K)' :
                         'Monitored Nodes / Endpoints'}
                      </label>
                      <span
                        className="text-lg font-bold tabular-nums"
                        style={{ color: product.color }}
                      >
                        {formatNodes(nodes)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={nodeSlider}
                      onChange={(e) => setNodeSlider(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${product.color} 0%, ${product.color} ${nodeSlider}%, rgba(255,255,255,0.1) ${nodeSlider}%, rgba(255,255,255,0.1) 100%)`,
                        accentColor: product.color,
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>0</span>
                      <span>1K</span>
                      <span>10K</span>
                      <span>100K</span>
                      <span>1M+</span>
                    </div>
                  </div>
                )}

                {/* Agent slider — shown for TruContext, TruClaw, Full Suite */}
                {(product.id === 'trucontext' || product.id === 'truclaw' || product.id === 'bundle') && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold uppercase tracking-wide">
                        <Bot className="h-4 w-4 text-slate-500" />
                        Active AI Agents
                      </label>
                      <span
                        className="text-lg font-bold tabular-nums"
                        style={{ color: product.color }}
                      >
                        {agents}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={product.id === 'truclaw' ? 60 : 500}
                      value={agents}
                      onChange={(e) => setAgents(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${product.color} 0%, ${product.color} ${(agents / (product.id === 'truclaw' ? 60 : 500)) * 100}%, rgba(255,255,255,0.1) ${(agents / (product.id === 'truclaw' ? 60 : 500)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                        accentColor: product.color,
                      }}
                    />
                    {product.id === 'truclaw' ? (
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>1</span>
                        <span>10 (Starter)</span>
                        <span>50 (Standard)</span>
                        <span>50+ →</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>1</span>
                        <span>100</span>
                        <span>250</span>
                        <span>500</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing rate info — aligned with core offerings cards */}
                <div
                  className="flex items-start gap-2 rounded-lg px-4 py-3 text-xs text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span>
                    {product.id === 'trucontext' && (
                      <>
                        <strong className="text-slate-300">TruContext</strong>: $9,999/mo (first 10K nodes) ·
                        $0.50/node (10K–100K) · $0.20/node (100K+) · $150/agent.
                        Matches the <em>Core Offerings</em> Starter/Growth/Enterprise tiers.
                      </>
                    )}
                    {product.id === 'truclaw' && (
                      <>
                        <strong className="text-slate-300">TruClaw</strong>: $799/mo Starter (≤10 agents, 20M tokens) ·
                        $7,999/mo Standard (11–50 agents, 150M tokens) · Enterprise custom (50+ agents).
                        Matches the <em>Core Offerings</em> tiers exactly.
                      </>
                    )}
                    {product.id === 'truinsight' && (
                      <>
                        <strong className="text-slate-300">Tru-InSight</strong>: $2,499/mo base platform ·
                        $0.08/camera metered inference. Save 20% when bundled with TruContext.
                        Matches the <em>Core Offerings</em> card.
                      </>
                    )}
                    {product.id === 'eli' && (
                      <>
                        <strong className="text-slate-300">ELI</strong>: $7,500/mo regional base (up to 500 cameras/nodes) ·
                        $0.15/node above 500. Multi-region and national deployments: contact sales.
                        Matches the <em>Core Offerings</em> card.
                      </>
                    )}
                    {product.id === 'bundle' && (
                      <>
                        <strong className="text-slate-300">Full Suite</strong>: $14,999/mo (all 4 platforms, 25% bundle discount) ·
                        $0.40/node (10K–100K) · $0.16/node (100K+) · $120/agent.
                        Best per-unit value across the portfolio.
                      </>
                    )}
                    {product.id === 'oil-gas' && (
                      <>
                        <strong className="text-slate-300">TruContext Oil &amp; Gas</strong>: $18,500/mo base (refinery operations intelligence) ·
                        $0.12/OT endpoint above 500. Contact sales above 10,000 endpoints.
                        Includes 3D digital twin, SCADA/IT-OT threat detection, and ESG dashboards.
                      </>
                    )}
                    {product.id === 'smart-city-gov' && (
                      <>
                        <strong className="text-slate-300">Smart City Government Edition</strong>: $28,000/mo base (national command platform) ·
                        $0.10/IoT sensor node above 1,000. Contact sales above 50,000 nodes.
                        Covers 10+ urban domains with AI agents and 3D geospatial visualization.
                      </>
                    )}
                    {product.id === 'smart-city-municipal' && (
                      <>
                        <strong className="text-slate-300">Smart City Municipal</strong>: $12,500/mo base (municipal IoT monitoring) ·
                        $0.08/IoT device above 200. Contact sales above 20,000 devices.
                        Includes Mapbox 3D, AI command assistant, and predictive maintenance scoring.
                      </>
                    )}
                    {product.id === 'campus-security' && (
                      <>
                        <strong className="text-slate-300">ELI Campus Security</strong>: $5,500/mo base (campus situational awareness) ·
                        $0.06/camera or endpoint above 100. Contact sales above 5,000 endpoints.
                        Includes Wi-Fi/RFID fusion, AI threat detection, and privacy-by-design controls.
                      </>
                    )}
                    {product.id === 'caseforge' && (
                      <>
                        <strong className="text-slate-300">CaseForge Legal</strong>: $2,499/mo flat rate — no usage-based charges.
                        Includes AI legal research, TruClaw autonomous agents, and interactive case analytics.
                        Annual billing saves 15%.
                      </>
                    )}
                    {product.id === 'aspire' && (
                      <>
                        <strong className="text-slate-300">ASPIRE Reporting</strong>: $1,499/mo flat rate — no usage-based charges.
                        Includes ADA-compliant public reporting, AWS data warehouse integration, and progressive disclosure design.
                        Annual billing saves 15%.
                      </>
                    )}
                    {product.id === 'truaddress' && (
                      <>
                        <strong className="text-slate-300">TruAddress</strong>: $8,500/mo base (national address intelligence) ·
                        $0.002/verified address record above 100K. Contact sales above 5M records.
                        Includes satellite AI detection, province analytics, and 10,000+ surveyor management.
                      </>
                    )}
                    {product.id === 'panelpulse' && (
                      <>
                        <strong className="text-slate-300">PanelPulse</strong>: $799/mo flat rate — no usage-based charges.
                        Includes WhatsApp/SMS survey distribution, airtime incentive management, and AI analysis.
                        Annual billing saves 15%.
                      </>
                    )}
                    {product.id === 'smart-city-demo' && (
                      <>
                        <strong className="text-slate-300">Smart City Demo Suite</strong>: $2,499/mo flat rate — no usage-based charges.
                        Includes GPU-accelerated 3D visualization, ROI models, standards documentation, and white-label licensing.
                        Annual billing saves 15%.
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* ── Right: Cost Summary ── */}
              <div
                className="lg:col-span-2 p-8 flex flex-col"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-4">
                  {billingCycle === 'annual' ? 'Estimated Annual Cost' : 'Estimated Monthly Cost'}
                </h3>

                {/* Annual savings banner */}
                {billingCycle === 'annual' && !breakdown.isCustom && (
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-xs font-semibold"
                    style={{
                      background: 'rgba(0,229,255,0.08)',
                      border: '1px solid rgba(0,229,255,0.2)',
                      color: '#00E5FF',
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                    Annual billing saves you{' '}
                    <span className="font-black">{formatCurrency(annualSavings)}/yr</span>
                    {' '}({Math.round(annualDiscountRate * 100)}% off)
                  </div>
                )}

                {/* Total — or Contact Sales for enterprise */}
                <div className="mb-6">
                  {showCustomPricing ? (
                    <div>
                      <div
                        className="text-3xl font-black mb-1 flex items-center gap-2"
                        style={{ color: product.color }}
                      >
                        <Phone className="h-6 w-6" />
                        Contact Sales
                      </div>
                      <div className="text-slate-400 text-sm mt-1">
                        {product.id === 'truclaw'
                          ? 'Enterprise: unlimited tokens + dedicated optimization'
                          : 'Multi-region / national deployment'}
                      </div>
                      <div className="text-slate-500 text-xs mt-2">
                        Based on your scale, a custom proposal will provide the best value.
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Monthly price — struck through when annual is selected */}
                      {billingCycle === 'annual' && (
                        <div className="text-slate-600 text-lg line-through tabular-nums mb-1">
                          {formatCurrency(breakdown.total)}/mo
                        </div>
                      )}
                      <div
                        className="text-5xl font-black tabular-nums mb-1"
                        style={{ color: product.color }}
                      >
                        {formatCurrency(effectiveMonthly)}
                      </div>
                      <div className="text-slate-500 text-sm">
                        {billingCycle === 'annual' ? 'per month (billed annually)' : 'per month'}
                      </div>
                      <div className="text-slate-400 text-sm mt-1">
                        {formatCurrency(annualTotal)}{' '}
                        <span className="text-slate-600">/ year</span>
                        {billingCycle === 'monthly' && (
                          <>
                            {' '}
                            <span className="text-cyan-500 text-xs">
                              (save {selectedProduct === 'bundle' ? '20%' : '15%'} with annual)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Breakdown toggle */}
                {!showCustomPricing && (
                  <button
                    onClick={() => setShowBreakdown((v) => !v)}
                    className="flex items-center gap-1.5 text-xs font-medium mb-4 transition-colors"
                    style={{ color: showBreakdown ? product.color : '#64748b' }}
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    {showBreakdown ? 'Hide' : 'Show'} cost breakdown
                  </button>
                )}

                {showBreakdown && !showCustomPricing && (
                  <div
                    className="rounded-xl p-4 mb-4 space-y-2 text-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Platform fee
                        <span className="block text-xs text-slate-600">{product.baseFeeLabel}</span>
                      </span>
                      <span className="text-white font-medium">{formatCurrency(breakdown.base)}</span>
                    </div>

                    {product.id !== 'truclaw' && breakdown.nodeCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          {product.id === 'trucontext' && nodes <= 100_000
                            ? `${formatNodes(nodes - 10_000)} nodes × $0.50`
                            : product.id === 'trucontext' && nodes > 100_000
                            ? `Tiered node cost`
                            : `${formatNodes(nodes)} nodes × $${product.nodeTiers[0]?.rate.toFixed(2)}`}
                        </span>
                        <span className="text-white font-medium">{formatCurrency(breakdown.nodeCost)}</span>
                      </div>
                    )}

                    {product.id !== 'truclaw' && breakdown.nodeCost === 0 && product.id !== 'truinsight' && product.id !== 'eli' && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          {formatNodes(nodes)} nodes
                          <span className="block text-xs text-slate-600">Included in base fee</span>
                        </span>
                        <span className="text-slate-600 font-medium">$0</span>
                      </div>
                    )}

                    {product.id === 'truclaw' && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          {breakdown.agentTierLabel}
                        </span>
                        <span className="text-slate-600 font-medium">Included</span>
                      </div>
                    )}

                    {breakdown.agentCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          {agents - product.agentIncluded} agents × ${product.agentRate}
                        </span>
                        <span className="text-white font-medium">{formatCurrency(breakdown.agentCost)}</span>
                      </div>
                    )}

                    <div
                      className="flex justify-between pt-2 mt-2 font-semibold"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <span className="text-slate-300">Total / month</span>
                      <span style={{ color: product.color }}>
                        {billingCycle === 'annual' ? (
                          <>
                            <span className="line-through text-slate-600 mr-1.5 text-sm font-normal">
                              {formatCurrency(breakdown.total)}
                            </span>
                            {formatCurrency(effectiveMonthly)}
                          </>
                        ) : (
                          formatCurrency(breakdown.total)
                        )}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div
                        className="flex justify-between text-xs pt-1"
                        style={{ color: '#00E5FF' }}
                      >
                        <span>Annual total (billed once)</span>
                        <span className="font-mono font-semibold">{formatCurrency(annualTotal)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Savings vs legacy */}
                {savings > 0 && !showCustomPricing && (
                  <div
                    className="rounded-xl p-4 mb-6"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.2)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-semibold">
                        Save ~{savingsPct}% vs. legacy tooling
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Comparable SIEM + SOC stack estimated at{' '}
                      <span className="text-slate-300 font-medium">{formatCurrency(legacyCost)}/mo</span>.
                      You save approximately{' '}
                      <span className="text-emerald-400 font-medium">{formatCurrency(savings)}/mo</span>.
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-auto space-y-3">
                  <Button
                    onClick={handleRequestQuote}
                    className="w-full text-black font-bold py-3"
                    style={{ background: `linear-gradient(135deg, ${product.color}, #0080FF)` }}
                  >
                    {showCustomPricing ? 'Request Enterprise Quote' : 'Get Custom Quote'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <button
                    onClick={() => setShowComparison(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/10"
                    style={{
                      border: `1px solid ${product.color}40`,
                      color: product.color,
                      background: `${product.color}08`,
                    }}
                  >
                    <BarChart2 className="h-4 w-4" />
                    Compare vs. Competitors
                  </button>
                  <p className="text-center text-slate-600 text-xs">
                    No commitment required · Response within 1 business day
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fine print */}
          <p className="text-center text-slate-600 text-xs mt-6">
            Estimates are indicative only and mirror the Core Offerings pricing tiers. Final pricing
            depends on contract term, support tier, and deployment configuration. Contact sales for
            a formal proposal.
          </p>
        </div>
      </div>

      {/* Competitor Comparison Overlay */}
      <CompetitorComparisonOverlay
        open={showComparison}
        onClose={() => setShowComparison(false)}
        selectedProduct={selectedProduct}
        productLabel={product.label}
        productColor={product.color}
        visiumMonthlyCost={breakdown.total}
        nodes={nodes}
        agents={agents}
        onRequestQuote={handleRequestQuote}
      />
    </section>
  );
}
