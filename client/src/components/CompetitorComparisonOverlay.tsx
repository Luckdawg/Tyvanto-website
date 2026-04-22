/**
 * CompetitorComparisonOverlay.tsx
 *
 * Full-screen modal overlay that shows a side-by-side feature and pricing
 * comparison between the selected Tyvanto product and major competitors:
 *   Splunk Enterprise Security, CrowdStrike Falcon, Palo Alto Cortex XSIAM,
 *   IBM QRadar SIEM.
 *
 * Pricing is dynamic — it reacts to the node/agent count passed in from the
 * PricingCalculator so the comparison is always contextual to the user's
 * actual environment.
 */

import React, { useMemo, useCallback } from 'react';
import { X, CheckCircle2, XCircle, MinusCircle, TrendingDown, Shield, Award, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

type FeatureLevel = 'full' | 'partial' | 'none';

interface FeatureRow {
  category: string;
  feature: string;
  tooltip?: string;
  tyvanto: FeatureLevel;
  splunk: FeatureLevel;
  crowdstrike: FeatureLevel;
  paloalto: FeatureLevel;
  ibmqradar: FeatureLevel;
}

interface CompetitorPricing {
  baseFee: number;       // monthly base
  nodeRate: number;      // per node/endpoint per month
  agentRate: number;     // per "agent" equivalent (analyst seat / module)
  notes: string;
}

// ─── Competitor Pricing Models ────────────────────────────────────────────────
// Industry benchmarks sourced from public pricing pages, analyst reports,
// and customer-reported TCO studies (Gartner, Forrester, IDC 2024).

const COMPETITOR_PRICING: Record<string, CompetitorPricing> = {
  splunk: {
    baseFee: 8000,
    nodeRate: 0.35,      // ~$350/GB ingest; ~$0.35/node equiv at avg 1GB/node/mo
    agentRate: 600,      // per premium app / analyst seat
    notes: 'Ingest-based pricing; costs scale rapidly with data volume',
  },
  crowdstrike: {
    baseFee: 5000,
    nodeRate: 0.22,      // Falcon Complete ~$22/endpoint/mo
    agentRate: 450,      // per module bundle
    notes: 'Per-endpoint model; add-on modules increase cost significantly',
  },
  paloalto: {
    baseFee: 7500,
    nodeRate: 0.28,      // Cortex XSIAM ~$28/endpoint/mo
    agentRate: 550,      // per XSOAR playbook pack / analyst seat
    notes: 'XSIAM bundles SIEM + SOAR; high upfront professional services',
  },
  ibmqradar: {
    baseFee: 6000,
    nodeRate: 0.20,      // QRadar Cloud ~$20/endpoint/mo
    agentRate: 400,      // per analyst seat / QRadar app
    notes: 'Legacy architecture; significant infrastructure overhead',
  },
};

// ─── Feature Comparison Matrix ────────────────────────────────────────────────

const FEATURE_ROWS: FeatureRow[] = [
  // Architecture
  {
    category: 'Architecture',
    feature: 'Graph Database (Neo4j)',
    tooltip: 'Native multi-layered graph DB for relationship-aware threat analysis',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'partial', ibmqradar: 'none',
  },
  {
    category: 'Architecture',
    feature: 'Dual DB (Graph + Relational)',
    tooltip: 'Combines Neo4j graph analytics with PostgreSQL for structured queries',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'none', ibmqradar: 'none',
  },
  {
    category: 'Architecture',
    feature: 'Real-time Kafka Event Streaming',
    tooltip: 'Processes billions of events/sec via Kafka ecosystem',
    tyvanto: 'full', splunk: 'partial', crowdstrike: 'partial', paloalto: 'partial', ibmqradar: 'partial',
  },
  {
    category: 'Architecture',
    feature: 'On-Prem + Cloud Hybrid Deployment',
    tooltip: 'Flexible deployment across air-gapped, hybrid, and cloud environments',
    tyvanto: 'full', splunk: 'full', crowdstrike: 'partial', paloalto: 'partial', ibmqradar: 'full',
  },
  // AI & Analytics
  {
    category: 'AI & Analytics',
    feature: 'Agentic AI (Autonomous Agents)',
    tooltip: 'Self-directed AI agents that continuously analyze and act on threats',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'partial', paloalto: 'partial', ibmqradar: 'none',
  },
  {
    category: 'AI & Analytics',
    feature: 'an independent research organization ATT&CK Native Integration',
    tooltip: 'Built on an independent research organization graph intelligence; ATT&CK TTPs mapped at the data layer',
    tyvanto: 'full', splunk: 'partial', crowdstrike: 'full', paloalto: 'partial', ibmqradar: 'partial',
  },
  {
    category: 'AI & Analytics',
    feature: 'Predictive Threat Modeling',
    tooltip: 'ML-based prediction of attack paths before exploitation',
    tyvanto: 'full', splunk: 'partial', crowdstrike: 'partial', paloalto: 'partial', ibmqradar: 'none',
  },
  {
    category: 'AI & Analytics',
    feature: 'Automated Root Cause Analysis',
    tooltip: 'Graph traversal auto-identifies root cause across the kill chain',
    tyvanto: 'full', splunk: 'partial', crowdstrike: 'partial', paloalto: 'partial', ibmqradar: 'partial',
  },
  {
    category: 'AI & Analytics',
    feature: 'Explainable AI (XAI)',
    tooltip: 'Every AI decision includes human-readable reasoning chain',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'partial', ibmqradar: 'none',
  },
  // Data Fusion
  {
    category: 'Data Fusion',
    feature: 'Cyber + Physical Data Fusion',
    tooltip: 'Correlates IT/OT/IoT events with physical security and video feeds',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'none', ibmqradar: 'none',
  },
  {
    category: 'Data Fusion',
    feature: 'Video Intelligence (CCTV/IP Cam)',
    tooltip: 'Tru-InSight integrates video analytics into the threat graph',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'none', ibmqradar: 'none',
  },
  {
    category: 'Data Fusion',
    feature: 'Supply Chain Risk Monitoring',
    tooltip: 'Tracks third-party and supply chain exposure in the graph',
    tyvanto: 'full', splunk: 'partial', crowdstrike: 'partial', paloalto: 'partial', ibmqradar: 'none',
  },
  {
    category: 'Data Fusion',
    feature: 'Geospatial / Smart City Integration',
    tooltip: 'Supports urban IoT, traffic, and infrastructure data sources',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'none', ibmqradar: 'none',
  },
  // Compliance & Governance
  {
    category: 'Compliance',
    feature: 'Enterprise Security Certified',
    tooltip: 'Designed for use within enterprise and government security environments',
    tyvanto: 'full', splunk: 'partial', crowdstrike: 'partial', paloalto: 'none', ibmqradar: 'partial',
  },
  {
    category: 'Compliance',
    feature: 'FedRAMP / CMMC Alignment',
    tooltip: 'Architecture supports FedRAMP High and CMMC Level 3 requirements',
    tyvanto: 'full', splunk: 'full', crowdstrike: 'full', paloalto: 'partial', ibmqradar: 'full',
  },
  {
    category: 'Compliance',
    feature: 'Patented Multi-Layer Graph Technology',
    tooltip: 'Only patented scalable multi-layered graph DB solution for cybersecurity',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'none', paloalto: 'none', ibmqradar: 'none',
  },
  // Pricing Model
  {
    category: 'Pricing',
    feature: 'Transparent Hybrid Pricing',
    tooltip: 'Fixed platform fee + per-node + per-agent; no hidden ingest charges',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'partial', paloalto: 'none', ibmqradar: 'none',
  },
  {
    category: 'Pricing',
    feature: 'No Ingest-Based Overage Fees',
    tooltip: 'Pricing is not tied to data volume — no surprise bills',
    tyvanto: 'full', splunk: 'none', crowdstrike: 'full', paloalto: 'partial', ibmqradar: 'partial',
  },
  {
    category: 'Pricing',
    feature: 'Annual Commitment Discounts',
    tooltip: 'Multi-year contracts unlock significant per-unit savings',
    tyvanto: 'full', splunk: 'full', crowdstrike: 'full', paloalto: 'full', ibmqradar: 'full',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatNodes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function FeatureIcon({ level }: { level: FeatureLevel }) {
  if (level === 'full')
    return <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" />;
  if (level === 'partial')
    return <MinusCircle className="h-5 w-5 text-amber-400 mx-auto" />;
  return <XCircle className="h-5 w-5 text-red-500/60 mx-auto" />;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CompetitorComparisonOverlayProps {
  open: boolean;
  onClose: () => void;
  selectedProduct: string;   // product id from PricingCalculator
  productLabel: string;      // display name
  productColor: string;      // accent color
  visiumMonthlyCost: number; // calculated cost from PricingCalculator
  nodes: number;
  agents: number;
  onRequestQuote: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const COMPETITORS = [
  { id: 'splunk',      label: 'Splunk ES',       logo: '🔴', tagline: 'Ingest-based SIEM' },
  { id: 'crowdstrike', label: 'CrowdStrike',      logo: '🦅', tagline: 'Endpoint-first XDR' },
  { id: 'paloalto',   label: 'Cortex XSIAM',     logo: '🟠', tagline: 'Unified SOC Platform' },
  { id: 'ibmqradar',  label: 'IBM QRadar',        logo: '🔵', tagline: 'Legacy SIEM' },
];

export default function CompetitorComparisonOverlay({
  open,
  onClose,
  selectedProduct,
  productLabel,
  productColor,
  visiumMonthlyCost,
  nodes,
  agents,
  onRequestQuote,
}: CompetitorComparisonOverlayProps) {

  // Compute competitor costs at the same scale
  const competitorCosts = useMemo(() => {
    return COMPETITORS.map((c) => {
      const p = COMPETITOR_PRICING[c.id];
      const cost = Math.round(p.baseFee + nodes * p.nodeRate + agents * p.agentRate);
      const savings = Math.max(0, cost - visiumMonthlyCost);
      const savingsPct = cost > 0 ? Math.round((savings / cost) * 100) : 0;
      return { ...c, cost, savings, savingsPct, notes: p.notes };
    });
  }, [nodes, agents, visiumMonthlyCost]);

  // Group feature rows by category
  const categories = useMemo(() => {
    const map = new Map<string, FeatureRow[]>();
    for (const row of FEATURE_ROWS) {
      if (!map.has(row.category)) map.set(row.category, []);
      map.get(row.category)!.push(row);
    }
    return Array.from(map.entries());
  }, []);

  // Count tyvanto advantages
  const visiumWins = useMemo(
    () => FEATURE_ROWS.filter((r) => r.tyvanto === 'full').length,
    []
  );

  const handleClose = useCallback(() => onClose(), [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full max-w-7xl rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #070714 0%, #0a0a1f 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-5"
          style={{
            background: 'rgba(7,7,20,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: `${productColor}20`, color: productColor, border: `1px solid ${productColor}40` }}
              >
                {productLabel}
              </div>
              <span className="text-slate-400 text-sm">vs. Industry Competitors</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Side-by-Side Comparison at Your Scale
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {formatNodes(nodes)} nodes · {agents} agents · Your estimated cost:{' '}
              <span style={{ color: productColor }} className="font-semibold">
                {formatCurrency(visiumMonthlyCost)}/mo
              </span>
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close comparison overlay"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-10">

          {/* ── Pricing Comparison Cards ── */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="h-5 w-5 text-emerald-400" />
              <h3 className="text-white font-bold text-lg">Cost Comparison at Your Scale</h3>
              <span className="text-slate-500 text-sm ml-2">
                ({formatNodes(nodes)} nodes, {agents} agents)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Tyvanto card */}
              <div
                className="rounded-2xl p-5 flex flex-col relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${productColor}18, ${productColor}08)`,
                  border: `2px solid ${productColor}50`,
                  boxShadow: `0 0 30px ${productColor}15`,
                }}
              >
                <div
                  className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: productColor, color: '#000' }}
                >
                  YOUR CHOICE
                </div>
                <div className="text-2xl mb-2">🔷</div>
                <div className="font-bold text-white text-sm mb-1">Tyvanto {productLabel}</div>
                <div
                  className="text-3xl font-black tabular-nums mt-auto mb-1"
                  style={{ color: productColor }}
                >
                  {formatCurrency(visiumMonthlyCost)}
                </div>
                <div className="text-slate-500 text-xs">/month</div>
                <div
                  className="mt-3 text-xs font-semibold px-2 py-1 rounded-lg text-center"
                  style={{ background: `${productColor}15`, color: productColor }}
                >
                  Transparent hybrid pricing
                </div>
              </div>

              {/* Competitor cards */}
              {competitorCosts.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl p-5 flex flex-col relative"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="text-2xl mb-2">{c.logo}</div>
                  <div className="font-bold text-slate-300 text-sm mb-0.5">{c.label}</div>
                  <div className="text-slate-500 text-xs mb-3">{c.tagline}</div>
                  <div className="text-3xl font-black tabular-nums text-slate-200 mt-auto mb-1">
                    {formatCurrency(c.cost)}
                  </div>
                  <div className="text-slate-500 text-xs">/month</div>
                  {c.savings > 0 && (
                    <div className="mt-3 text-xs font-semibold px-2 py-1 rounded-lg text-center bg-emerald-500/10 text-emerald-400">
                      You save {formatCurrency(c.savings)}/mo ({c.savingsPct}%)
                    </div>
                  )}
                  <div className="mt-2 text-xs text-slate-600 leading-tight">{c.notes}</div>
                </div>
              ))}
            </div>

            {/* Annual savings callout */}
            {competitorCosts.some((c) => c.savings > 0) && (
              <div
                className="mt-4 rounded-xl px-6 py-4 flex flex-wrap items-center gap-4"
                style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <Award className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-emerald-400 font-bold text-sm">
                    Annual savings vs. Splunk:{' '}
                    <span className="text-xl">
                      {formatCurrency(competitorCosts.find((c) => c.id === 'splunk')!.savings * 12)}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    Redirect those savings to expanding your security posture, not paying for ingest overages.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Feature Matrix ── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5" style={{ color: productColor }} />
              <h3 className="text-white font-bold text-lg">Feature Comparison Matrix</h3>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Tyvanto leads on <span className="text-emerald-400 font-semibold">{visiumWins} of {FEATURE_ROWS.length} capabilities</span>.
              <span className="ml-3 text-xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 inline mr-1" />Full &nbsp;
                <MinusCircle className="h-3 w-3 text-amber-400 inline mr-1" />Partial &nbsp;
                <XCircle className="h-3 w-3 text-red-500/60 inline mr-1" />Not Available
              </span>
            </p>

            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="text-left px-5 py-3 text-slate-400 font-semibold w-64">Feature</th>
                    <th className="px-4 py-3 text-center font-bold w-28" style={{ color: productColor }}>
                      Tyvanto {productLabel}
                    </th>
                    {COMPETITORS.map((c) => (
                      <th key={c.id} className="px-4 py-3 text-center text-slate-400 font-semibold w-28">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map(([category, rows], catIdx) => (
                    <React.Fragment key={category}>
                      {/* Category header row */}
                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td
                          colSpan={6}
                          className="px-5 py-2 text-xs font-bold uppercase tracking-widest"
                          style={{ color: productColor, borderTop: catIdx > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                        >
                          {category}
                        </td>
                      </tr>
                      {rows.map((row, rowIdx) => (
                        <tr
                          key={row.feature}
                          style={{
                            background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                            borderTop: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <td className="px-5 py-3">
                            <div className="text-slate-300 font-medium">{row.feature}</div>
                            {row.tooltip && (
                              <div className="text-slate-600 text-xs mt-0.5 leading-tight">{row.tooltip}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <FeatureIcon level={row.tyvanto} />
                          </td>
                          <td className="px-4 py-3 text-center"><FeatureIcon level={row.splunk} /></td>
                          <td className="px-4 py-3 text-center"><FeatureIcon level={row.crowdstrike} /></td>
                          <td className="px-4 py-3 text-center"><FeatureIcon level={row.paloalto} /></td>
                          <td className="px-4 py-3 text-center"><FeatureIcon level={row.ibmqradar} /></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Full native capability</span>
              <span className="flex items-center gap-1.5"><MinusCircle className="h-3.5 w-3.5 text-amber-400" /> Partial / add-on required</span>
              <span className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-red-500/60" /> Not available</span>
              <span className="ml-auto">Source: Public pricing pages, Gartner/Forrester TCO reports, customer disclosures (2024)</span>
            </div>
          </div>

          {/* ── Why Tyvanto Wins ── */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5" style={{ color: productColor }} />
              <h3 className="text-white font-bold">Why Tyvanto Wins at Enterprise Scale</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Graph-Native Architecture',
                  body: 'Neo4j graph DB processes relationship queries 4× faster than relational SIEM engines — critical for lateral movement detection and blast-radius analysis.',
                },
                {
                  title: 'Agentic AI, Not Just ML',
                  body: 'Autonomous agents continuously hunt, correlate, and respond — not just alert. Competitors bolt on AI; Tyvanto is built on it.',
                },
                {
                  title: 'Cyber + Physical Fusion',
                  body: 'The only platform that correlates IT/OT/IoT events with physical security and video intelligence in a single graph — a capability no competitor offers.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl p-4"
                  style={{ background: `${productColor}08`, border: `1px solid ${productColor}20` }}
                >
                  <div className="font-bold text-white text-sm mb-2">{item.title}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{item.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-slate-500 text-sm">
              Ready to see these numbers validated for your specific environment?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back to Calculator
              </Button>
              <Button
                onClick={() => { handleClose(); onRequestQuote(); }}
                className="text-black font-bold px-6"
                style={{ background: `linear-gradient(135deg, ${productColor}, #0080FF)` }}
              >
                Get Custom Quote
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
