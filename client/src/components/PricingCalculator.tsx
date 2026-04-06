/**
 * PricingCalculator.tsx
 * Interactive live pricing calculator for the /shop page.
 *
 * Pricing model (hybrid):
 *   Monthly cost = Platform Fee + (nodes × nodeRate) + (agents × agentRate) + (events × eventRate)
 *
 * Products:
 *   TruContext  — $2,500/mo base + $0.08/node + $150/agent
 *   TruClaw     — $1,800/mo base + $0.05/node + $200/agent
 *   Tru-InSight — $3,200/mo base + $0.12/node + $180/agent
 *   ELI         — $4,000/mo base + $0.10/node + $250/agent
 *   Bundle      — $8,500/mo base + $0.07/node + $175/agent (blended)
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
} from 'lucide-react';
import CompetitorComparisonOverlay from './CompetitorComparisonOverlay';

// ─── Pricing Config ───────────────────────────────────────────────────────────

interface ProductConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  baseFee: number;       // monthly platform fee
  nodeRate: number;      // per monitored node/endpoint
  agentRate: number;     // per active AI agent
  description: string;
  highlight?: string;
}

const PRODUCTS: ProductConfig[] = [
  {
    id: 'trucontext',
    label: 'TruContext',
    icon: <Shield className="h-4 w-4" />,
    color: '#00E5FF',
    baseFee: 2500,
    nodeRate: 0.08,
    agentRate: 150,
    description: 'Core cyber-physical intelligence platform',
    highlight: 'Most Popular',
  },
  {
    id: 'truclaw',
    label: 'TruClaw',
    icon: <Brain className="h-4 w-4" />,
    color: '#7C3AED',
    baseFee: 1800,
    nodeRate: 0.05,
    agentRate: 200,
    description: 'Agentic AI governance & control layer',
  },
  {
    id: 'truinsight',
    label: 'Tru-InSight',
    icon: <Eye className="h-4 w-4" />,
    color: '#0EA5E9',
    baseFee: 3200,
    nodeRate: 0.12,
    agentRate: 180,
    description: 'Video intelligence & physical security fusion',
  },
  {
    id: 'eli',
    label: 'ELI',
    icon: <Zap className="h-4 w-4" />,
    color: '#F59E0B',
    baseFee: 4000,
    nodeRate: 0.10,
    agentRate: 250,
    description: 'Unified surveillance intelligence platform',
  },
  {
    id: 'bundle',
    label: 'Full Suite',
    icon: <Package className="h-4 w-4" />,
    color: '#10B981',
    baseFee: 8500,
    nodeRate: 0.07,
    agentRate: 175,
    description: 'All 4 products — best per-unit value',
    highlight: 'Best Value',
  },
];

// ─── Slider helpers ───────────────────────────────────────────────────────────

// Logarithmic scale: map 0–100 slider to 0–1,000,000 nodes
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

// Linear scale: 0–500 agents
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PricingCalculatorProps {
  onRequestQuote: (snapshot: {
    productInterest: string;
    estimatedNodes: number;
    estimatedAgents: number;
    estimatedMonthlyBudget: string;
  }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingCalculator({ onRequestQuote }: PricingCalculatorProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('trucontext');
  const [nodeSlider, setNodeSlider] = useState<number>(40); // ~10K nodes default
  const [agents, setAgents] = useState<number>(10);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const nodes = useMemo(() => sliderToNodes(nodeSlider), [nodeSlider]);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProduct) ?? PRODUCTS[0],
    [selectedProduct]
  );

  const breakdown = useMemo(() => {
    const base = product.baseFee;
    const nodeCost = Math.round(nodes * product.nodeRate);
    const agentCost = agents * product.agentRate;
    const total = base + nodeCost + agentCost;
    const annualTotal = total * 12;
    return { base, nodeCost, agentCost, total, annualTotal };
  }, [product, nodes, agents]);

  // Comparison: what legacy SIEM/SOC tooling would cost at this scale
  const legacyCost = useMemo(() => {
    // Rough industry benchmark: $0.25/node + $500/agent + $5000 base for comparable coverage
    return Math.round(5000 + nodes * 0.25 + agents * 500);
  }, [nodes, agents]);

  const savings = Math.max(0, legacyCost - breakdown.total);
  const savingsPct = legacyCost > 0 ? Math.round((savings / legacyCost) * 100) : 0;

  const handleRequestQuote = useCallback(() => {
    onRequestQuote({
      productInterest: selectedProduct,
      estimatedNodes: nodes,
      estimatedAgents: agents,
      estimatedMonthlyBudget: `${formatCurrency(breakdown.total)}/mo`,
    });
  }, [selectedProduct, nodes, agents, breakdown.total, onRequestQuote]);

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
            Adjust the sliders to match your environment. Pricing is fully transparent — no
            hidden fees, no surprise overages.
          </p>
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
            <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}>

              {/* ── Left: Controls ── */}
              <div className="lg:col-span-3 p-8 space-y-8">

                {/* Product selector */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3 uppercase tracking-wide">
                    Select Product
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRODUCTS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProduct(p.id)}
                        className="relative flex flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition-all duration-200"
                        style={{
                          background:
                            selectedProduct === p.id
                              ? `rgba(${p.color === '#00E5FF' ? '0,229,255' : p.color === '#7C3AED' ? '124,58,237' : p.color === '#0EA5E9' ? '14,165,233' : p.color === '#F59E0B' ? '245,158,11' : '16,185,129'},0.12)`
                              : 'rgba(255,255,255,0.04)',
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
                </div>

                {/* Node slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold uppercase tracking-wide">
                      <Server className="h-4 w-4 text-slate-500" />
                      Monitored Nodes / Endpoints
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

                {/* Agent slider */}
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
                    max={500}
                    value={agents}
                    onChange={(e) => setAgents(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${product.color} 0%, ${product.color} ${(agents / 500) * 100}%, rgba(255,255,255,0.1) ${(agents / 500) * 100}%, rgba(255,255,255,0.1) 100%)`,
                      accentColor: product.color,
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>1</span>
                    <span>100</span>
                    <span>250</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Pricing rate info */}
                <div
                  className="flex items-start gap-2 rounded-lg px-4 py-3 text-xs text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span>
                    <strong className="text-slate-300">{product.label}</strong> rates:{' '}
                    ${product.baseFee.toLocaleString()}/mo platform fee ·{' '}
                    ${product.nodeRate.toFixed(2)}/node ·{' '}
                    ${product.agentRate}/agent. Annual commitment discounts available.
                  </span>
                </div>
              </div>

              {/* ── Right: Cost Summary ── */}
              <div
                className="lg:col-span-2 p-8 flex flex-col"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-6">
                  Estimated Monthly Cost
                </h3>

                {/* Total */}
                <div className="mb-6">
                  <div
                    className="text-5xl font-black tabular-nums mb-1"
                    style={{ color: product.color }}
                  >
                    {formatCurrency(breakdown.total)}
                  </div>
                  <div className="text-slate-500 text-sm">per month</div>
                  <div className="text-slate-400 text-sm mt-1">
                    {formatCurrency(breakdown.annualTotal)}{' '}
                    <span className="text-slate-600">/ year</span>
                  </div>
                </div>

                {/* Breakdown toggle */}
                <button
                  onClick={() => setShowBreakdown((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium mb-4 transition-colors"
                  style={{ color: showBreakdown ? product.color : '#64748b' }}
                >
                  <Calculator className="h-3.5 w-3.5" />
                  {showBreakdown ? 'Hide' : 'Show'} cost breakdown
                </button>

                {showBreakdown && (
                  <div
                    className="rounded-xl p-4 mb-4 space-y-2 text-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex justify-between">
                      <span className="text-slate-400">Platform fee</span>
                      <span className="text-white font-medium">{formatCurrency(breakdown.base)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {formatNodes(nodes)} nodes × ${product.nodeRate.toFixed(2)}
                      </span>
                      <span className="text-white font-medium">{formatCurrency(breakdown.nodeCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {agents} agents × ${product.agentRate}
                      </span>
                      <span className="text-white font-medium">{formatCurrency(breakdown.agentCost)}</span>
                    </div>
                    <div
                      className="flex justify-between pt-2 mt-2 font-semibold"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <span className="text-slate-300">Total</span>
                      <span style={{ color: product.color }}>{formatCurrency(breakdown.total)}</span>
                    </div>
                  </div>
                )}

                {/* Savings vs legacy */}
                {savings > 0 && (
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
                    Get Custom Quote
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
            Estimates are indicative only. Final pricing depends on contract term, support tier, and
            deployment configuration. Contact sales for a formal proposal.
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
