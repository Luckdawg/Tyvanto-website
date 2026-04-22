/**
 * PricingCalculator.tsx
 * Interactive live pricing calculator for the /shop page.
 *
 * Pricing sourced from Visium_Pricing_Formulas-01.xlsx (Apr 2026):
 *
 *   Arqen  — $7,995/mo (first 10K nodes) · $0.40/node (10K–100K) · $0.25/node (100K+)
 *                 + $450/agent
 *   TruClaw     — $1,299/mo Starter (≤10 agents) · $6,995/mo Standard (11–50) · Enterprise (50+)
 *   Tru-InSight — $7,499/mo base + $2.00/camera metered
 *   ELI         — $9,499/mo base (first 500 nodes) · $4.00/node above 500
 *   Full Suite  — $14,995/mo (20K nodes included) · $3.00/node T1 · $3.00/node T2 · $120/agent
 *   Oil & Gas   — $8,000/mo (500 endpoints) · $2.00/endpoint above 500
 *   Smart City Gov — $16,000/mo (1,000 nodes) · $2.00/node above 1,000
 *   Smart City Muni — $12,495/mo (500 devices) · $2.00/device above 500
 *   Campus Security — $7,995/mo (100 cameras) · $2.00/camera above 100
 *   CaseForge Legal — $3,499/mo flat
 *   ASPIRE Reporting — $3,499/mo flat
 *   TruAddress  — $19,950/mo (100K records) · $0.20/1K records above 100K
 *   PanelPulse  — $3,995/mo flat
 *   Smart City Demo — $4,750/mo flat
 *
 * All products: 10% annual discount (uniform across all products)
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
  ChevronRight,
} from 'lucide-react';
import CompetitorComparisonOverlay from './CompetitorComparisonOverlay';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category: 'Core' | 'Vertical';

  // Pricing model
  isFlat: boolean;          // flat-rate: no sliders
  baseFee: number;          // monthly base fee
  baseFeeLabel: string;     // what the base fee covers

  // Node/unit slider config (non-flat products)
  unitLabel: string;        // e.g. "Nodes", "Cameras", "OT Endpoints"
  unitsIncluded: number;    // units covered by base fee (0 = all metered)
  unitRate: number;         // per-unit rate above unitsIncluded
  unitRate2?: number;       // optional second tier rate (100K+)
  unitTier2Threshold?: number; // threshold for second tier
  sliderMin: number;        // slider minimum value
  sliderMax: number;        // slider maximum value (for linear slider)
  sliderDefault: number;    // default slider value
  sliderIsLog: boolean;     // use logarithmic scale for wide ranges
  sliderMarks: { value: number; label: string }[]; // tick marks on slider

  // Agent slider (Arqen, Full Suite)
  hasAgentSlider: boolean;
  agentRate: number;
  agentIncluded: number;
  agentMin: number;
  agentMax: number;
  agentDefault: number;

  // TruClaw special tier model
  isTruClaw?: boolean;
  truClawStarterFee?: number;   // ≤10 agents
  truClawStandardFee?: number;  // 11–50 agents
  truClawEnterpriseThreshold?: number; // above this → Contact Sales

  // Display
  description: string;
  highlight?: string;
  customAboveUnits?: number;    // above this → show "Contact Sales" note
  annualDiscount: number;       // e.g. 0.15 = 15%
  infoText: React.ReactNode;
}

const PRODUCTS: ProductConfig[] = [
  // ── Core Platforms ──────────────────────────────────────────────────────────
  {
    id: 'arqen',
    label: 'Arqen',
    icon: <Shield className="h-4 w-4" />,
    color: '#00E5FF',
    category: 'Core',
    isFlat: false,
    baseFee: 12499,
    baseFeeLabel: 'First 10,000 nodes included',
    unitLabel: 'Monitored Nodes / Endpoints',
    unitsIncluded: 10_000,
    unitRate: 0.40,          // $0.40/node (10K–100K)
    unitRate2: 0.25,         // $0.25/node (100K+)
    unitTier2Threshold: 100_000,
    sliderMin: 0,
    sliderMax: 100,          // logarithmic 0–1M
    sliderDefault: 40,       // ~10K
    sliderIsLog: true,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 17, label: '1K' },
      { value: 33, label: '10K' },
      { value: 50, label: '100K' },
      { value: 67, label: '500K' },
      { value: 83, label: '750K' },
      { value: 100, label: '1M' },
    ],
    hasAgentSlider: true,
    agentRate: 450,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 100,
    agentDefault: 0,
    description: 'Core cyber-physical intelligence platform',
    highlight: 'Most Popular',
    customAboveUnits: 1_000_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Arqen</strong>: $7,995/mo (first 10K nodes) ·
        $0.40/node (10K–100K) · $0.25/node (100K+) · $450/agent.
        Tiered pricing rewards scale — the more you monitor, the lower the per-unit cost.
      </>
    ),
  },
  {
    id: 'truclaw',
    label: 'TruClaw',
    icon: <Brain className="h-4 w-4" />,
    color: '#7C3AED',
    category: 'Core',
    isFlat: false,
    baseFee: 1299,
    baseFeeLabel: 'Starter tier — ≤10 agents, 20M tokens included',
    unitLabel: 'Active AI Agents',
    unitsIncluded: 10,
    unitRate: 0,
    sliderMin: 1,
    sliderMax: 60,
    sliderDefault: 10,
    sliderIsLog: false,
    sliderMarks: [
      { value: 1, label: '1' },
      { value: 10, label: '10\nStarter' },
      { value: 50, label: '50\nStandard' },
      { value: 60, label: '60+\nEnterprise' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    isTruClaw: true,
    truClawStarterFee: 1299,
    truClawStandardFee: 6995,
    truClawEnterpriseThreshold: 50,
    description: 'Agentic AI governance & control layer',
    customAboveUnits: 50,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">TruClaw</strong>: $1,299/mo Starter (≤10 agents, 20M tokens) ·
        $6,995/mo Standard (11–50 agents, 200M tokens) · Enterprise custom pricing (50+ agents).
        Token overages above included limits billed at $0.002/1K tokens.
      </>
    ),
  },
  {
    id: 'truinsight',
    label: 'Tru-InSight',
    icon: <Eye className="h-4 w-4" />,
    color: '#0EA5E9',
    category: 'Core',
    isFlat: false,
    baseFee: 7499,
    baseFeeLabel: 'Core video analytics platform',
    unitLabel: 'Cameras / Endpoints',
    unitsIncluded: 0,          // all cameras metered
    unitRate: 2.00,            // $2.00/camera
    sliderMin: 0,
    sliderMax: 5000,
    sliderDefault: 100,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 500, label: '500' },
      { value: 1000, label: '1K' },
      { value: 2500, label: '2.5K' },
      { value: 5000, label: '5K' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'Video intelligence & physical security fusion',
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Tru-InSight</strong>: $7,499/mo base platform ·
        $2.00/camera metered inference. All cameras are metered — no included allowance.
        Save 10% when bundled with Arqen via the Full Suite.
      </>
    ),
  },
  {
    id: 'eli',
    label: 'ELI',
    icon: <Zap className="h-4 w-4" />,
    color: '#F59E0B',
    category: 'Core',
    isFlat: false,
    baseFee: 9499,
    baseFeeLabel: 'Regional deployment — first 500 cameras/nodes',
    unitLabel: 'Cameras / Nodes',
    unitsIncluded: 500,
    unitRate: 4.00,            // $4.00/node above 500
    sliderMin: 0,
    sliderMax: 10000,
    sliderDefault: 500,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 500, label: '500\n(included)' },
      { value: 2000, label: '2K' },
      { value: 5000, label: '5K' },
      { value: 10000, label: '10K' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'Unified surveillance intelligence platform',
    customAboveUnits: 50_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">ELI</strong>: $9,499/mo regional base (first 500 cameras/nodes) ·
        $4.00/node above 500. Multi-region and national deployments: contact sales.
        Example: 2,000 nodes → $9,499 + (1,500 × $4.00) = $15,499/mo.
      </>
    ),
  },
  {
    id: 'bundle',
    label: 'Full Suite',
    icon: <Package className="h-4 w-4" />,
    color: '#10B981',
    category: 'Core',
    isFlat: false,
    baseFee: 14995,
    baseFeeLabel: 'All 4 platforms — 10% bundle discount · 20K nodes included',
    unitLabel: 'Monitored Nodes / Endpoints',
    unitsIncluded: 20_000,
    unitRate: 3.00,            // $3.00/node T1 (above 20K)
    unitRate2: 3.00,           // $3.00/node T2 (same per spreadsheet)
    unitTier2Threshold: 100_000,
    sliderMin: 0,
    sliderMax: 100,
    sliderDefault: 40,
    sliderIsLog: true,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 17, label: '1K' },
      { value: 33, label: '10K' },
      { value: 50, label: '100K' },
      { value: 67, label: '500K' },
      { value: 83, label: '750K' },
      { value: 100, label: '1M' },
    ],
    hasAgentSlider: true,
    agentRate: 120,
    agentIncluded: 10,
    agentMin: 0,
    agentMax: 500,
    agentDefault: 10,
    description: 'All 4 products — best per-unit value',
    highlight: 'Best Value',
    customAboveUnits: 1_000_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Full Suite Bundle</strong>: $14,995/mo (all 4 platforms, 10% bundle discount) ·
        20K nodes included · $3.00/node above 20K · $120/agent (10 included).
        Saves ~$10,493/mo vs buying all 4 platforms separately.
      </>
    ),
  },

  // ── Vertical / Industry Solutions ──────────────────────────────────────────
  {
    id: 'oil-gas',
    label: 'Oil & Gas',
    icon: <Zap className="h-4 w-4" />,
    color: '#FFA500',
    category: 'Vertical',
    isFlat: false,
    baseFee: 8000,
    baseFeeLabel: 'Energy & critical infrastructure — first 500 OT endpoints',
    unitLabel: 'OT/SCADA Endpoints',
    unitsIncluded: 500,
    unitRate: 2.00,
    sliderMin: 0,
    sliderMax: 10000,
    sliderDefault: 500,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 500, label: '500\n(included)' },
      { value: 2000, label: '2K' },
      { value: 5000, label: '5K' },
      { value: 10000, label: '10K' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'Energy & critical infrastructure OT/IT',
    customAboveUnits: 50_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Arqen Oil &amp; Gas</strong>: $8,000/mo base (first 500 OT endpoints) ·
        $2.00/endpoint above 500. Includes 3D digital twin, SCADA/IT-OT threat detection, and ESG dashboards.
        Example: 2,000 endpoints → $8,000 + (1,500 × $2.00) = $11,000/mo.
      </>
    ),
  },
  {
    id: 'smart-city-gov',
    label: 'Smart City Gov',
    icon: <Globe className="h-4 w-4" />,
    color: '#4A90D9',
    category: 'Vertical',
    isFlat: false,
    baseFee: 16000,
    baseFeeLabel: 'National smart city command — first 1,000 IoT nodes',
    unitLabel: 'IoT Sensor Nodes',
    unitsIncluded: 1_000,
    unitRate: 2.00,
    sliderMin: 0,
    sliderMax: 20000,
    sliderDefault: 1000,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 1000, label: '1K\n(included)' },
      { value: 5000, label: '5K' },
      { value: 10000, label: '10K' },
      { value: 20000, label: '20K' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'National government smart city suite',
    customAboveUnits: 500_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Smart City Government Edition</strong>: $16,000/mo base (first 1,000 IoT nodes) ·
        $2.00/node above 1,000. Government procurement vehicles available (GSA Schedule, SEWP).
        Example: 10,000 nodes → $16,000 + (9,000 × $2.00) = $34,000/mo.
      </>
    ),
  },
  {
    id: 'smart-city-municipal',
    label: 'Smart City Muni',
    icon: <Building2 className="h-4 w-4" />,
    color: '#64C864',
    category: 'Vertical',
    isFlat: false,
    baseFee: 12495,
    baseFeeLabel: 'Municipal smart infrastructure — first 500 IoT devices',
    unitLabel: 'IoT Devices',
    unitsIncluded: 500,
    unitRate: 2.00,
    sliderMin: 0,
    sliderMax: 10000,
    sliderDefault: 200,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 500, label: '500\n(included)' },
      { value: 2000, label: '2K' },
      { value: 5000, label: '5K' },
      { value: 10000, label: '10K' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'Municipal smart infrastructure command',
    customAboveUnits: 100_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Smart City Municipal</strong>: $12,495/mo base (first 500 IoT devices) ·
        $2.00/device above 500. Includes Mapbox 3D, AI command assistant, and predictive maintenance scoring.
        Example: 2,000 devices → $12,495 + (1,500 × $2.00) = $15,495/mo.
      </>
    ),
  },
  {
    id: 'campus-security',
    label: 'Campus Security',
    icon: <Shield className="h-4 w-4" />,
    color: '#9370DB',
    category: 'Vertical',
    isFlat: false,
    baseFee: 7995,
    baseFeeLabel: 'Campus situational awareness — first 100 cameras/endpoints',
    unitLabel: 'Cameras / Endpoints',
    unitsIncluded: 100,
    unitRate: 2.00,
    sliderMin: 0,
    sliderMax: 2000,
    sliderDefault: 100,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 100, label: '100\n(included)' },
      { value: 500, label: '500' },
      { value: 1000, label: '1K' },
      { value: 2000, label: '2K' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'ELI campus situational awareness',
    customAboveUnits: 20_000,
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">ELI Campus Security</strong>: $7,995/mo base (first 100 cameras/endpoints) ·
        $2.00/camera above 100. Ideal for universities, corporate campuses, and K-12 districts.
        Example: 500 cameras → $7,995 + (400 × $2.00) = $8,795/mo.
      </>
    ),
  },
  {
    id: 'caseforge',
    label: 'CaseForge Legal',
    icon: <Briefcase className="h-4 w-4" />,
    color: '#DAA520',
    category: 'Vertical',
    isFlat: true,
    baseFee: 3499,
    baseFeeLabel: 'All-inclusive flat rate — no usage-based charges',
    unitLabel: 'Attorney / Paralegal Seats',
    unitsIncluded: 0,
    unitRate: 0,
    sliderMin: 1,
    sliderMax: 50,
    sliderDefault: 5,
    sliderIsLog: false,
    sliderMarks: [],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'AI-powered litigation command center',
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">CaseForge Legal</strong>: $3,499/mo flat rate — no usage-based charges.
        Includes AI legal research, TruClaw autonomous agents, and interactive case analytics.
        Volume discounts for multi-firm or multi-region deployments — contact sales.
      </>
    ),
  },
  {
    id: 'aspire',
    label: 'ASPIRE Reporting',
    icon: <BookOpen className="h-4 w-4" />,
    color: '#6495ED',
    category: 'Vertical',
    isFlat: true,
    baseFee: 3499,
    baseFeeLabel: 'All-inclusive flat rate — no usage-based charges',
    unitLabel: 'Schools / Districts',
    unitsIncluded: 0,
    unitRate: 0,
    sliderMin: 1,
    sliderMax: 20,
    sliderDefault: 1,
    sliderIsLog: false,
    sliderMarks: [],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'ADA-compliant charter school reporting',
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">ASPIRE Reporting</strong>: $3,499/mo flat rate — no usage-based charges.
        Includes ADA-compliant public reporting, AWS data warehouse integration, and progressive disclosure design.
        Multi-district pricing available — contact sales.
      </>
    ),
  },
  {
    id: 'truaddress',
    label: 'TruAddress',
    icon: <MapPin className="h-4 w-4" />,
    color: '#DC143C',
    category: 'Vertical',
    isFlat: false,
    baseFee: 19950,
    baseFeeLabel: 'National address intelligence — first 100K records included',
    unitLabel: 'Address Records (×1,000)',
    unitsIncluded: 100,          // 100 × 1K = 100K records
    unitRate: 0.20,              // $0.20/1K records above 100K
    sliderMin: 0,
    sliderMax: 5000,             // up to 5M records (×1K)
    sliderDefault: 100,
    sliderIsLog: false,
    sliderMarks: [
      { value: 0, label: '0' },
      { value: 100, label: '100K\n(included)' },
      { value: 500, label: '500K' },
      { value: 1000, label: '1M' },
      { value: 2500, label: '2.5M' },
      { value: 5000, label: '5M' },
    ],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'AI national address data collection',
    customAboveUnits: 10_000,    // 10M records → Contact Sales
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">TruAddress</strong>: $19,950/mo base (first 100K records) ·
        $0.20/1K records above 100K. Includes satellite AI detection, province analytics, and 10,000+ surveyor management.
        Example: 500K records → $19,950 + (400 × $0.20) = $20,030/mo.
      </>
    ),
  },
  {
    id: 'panelpulse',
    label: 'PanelPulse',
    icon: <Radio className="h-4 w-4" />,
    color: '#00CED1',
    category: 'Vertical',
    isFlat: true,
    baseFee: 3995,
    baseFeeLabel: 'All-inclusive flat rate — no usage-based charges',
    unitLabel: 'Panel Members',
    unitsIncluded: 0,
    unitRate: 0,
    sliderMin: 100,
    sliderMax: 10000,
    sliderDefault: 1000,
    sliderIsLog: false,
    sliderMarks: [],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'WhatsApp/SMS survey panel platform',
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">PanelPulse</strong>: $3,995/mo flat rate — no usage-based charges.
        Includes WhatsApp/SMS survey distribution, airtime incentive management, and AI analysis.
        SMS/WhatsApp message volume overage pricing available for high-frequency surveys — contact sales.
      </>
    ),
  },
  {
    id: 'smart-city-demo',
    label: 'Smart City Demo',
    icon: <Users className="h-4 w-4" />,
    color: '#FF69B4',
    category: 'Vertical',
    isFlat: true,
    baseFee: 4750,
    baseFeeLabel: 'All-inclusive flat rate — no usage-based charges',
    unitLabel: 'Active RFP Proposals',
    unitsIncluded: 0,
    unitRate: 0,
    sliderMin: 1,
    sliderMax: 20,
    sliderDefault: 1,
    sliderIsLog: false,
    sliderMarks: [],
    hasAgentSlider: false,
    agentRate: 0,
    agentIncluded: 0,
    agentMin: 0,
    agentMax: 0,
    agentDefault: 0,
    description: 'RFP toolkit & white-label demo suite',
    annualDiscount: 0.10,
    infoText: (
      <>
        <strong className="text-slate-300">Smart City Demo Suite</strong>: $4,750/mo flat rate — no usage-based charges.
        Includes GPU-accelerated 3D visualization, ROI models, standards documentation, and white-label licensing.
        Multi-city or multi-region licensing available — contact sales.
      </>
    ),
  },
];

// ─── Calculation helpers ──────────────────────────────────────────────────────

function calcTruClawCost(agents: number, p: ProductConfig): { total: number; tierLabel: string; isCustom: boolean } {
  const starter = p.truClawStarterFee ?? 1299;
  const standard = p.truClawStandardFee ?? 9999;
  const threshold = p.truClawEnterpriseThreshold ?? 50;
  if (agents <= 10) return { total: starter, tierLabel: `≤10 agents — Starter ($${starter.toLocaleString()}/mo)`, isCustom: false };
  if (agents <= threshold) return { total: standard, tierLabel: `11–${threshold} agents — Standard ($${standard.toLocaleString()}/mo)`, isCustom: false };
  return { total: standard, tierLabel: `${threshold}+ agents — Enterprise (contact sales)`, isCustom: true };
}

function calcUnitCost(p: ProductConfig, units: number): number {
  if (p.isFlat || p.unitRate === 0) return 0;
  const overage = Math.max(0, units - p.unitsIncluded);
  if (overage === 0) return 0;

  // Two-tier: T1 up to tier2Threshold, T2 above
  if (p.unitRate2 !== undefined && p.unitTier2Threshold !== undefined) {
    const t1Units = Math.max(0, Math.min(overage, p.unitTier2Threshold - p.unitsIncluded));
    const t2Units = Math.max(0, overage - t1Units);
    return Math.round(t1Units * p.unitRate + t2Units * p.unitRate2);
  }
  return Math.round(overage * p.unitRate);
}

function calcAgentCost(p: ProductConfig, agents: number): number {
  if (!p.hasAgentSlider || p.agentRate === 0) return 0;
  return Math.max(0, agents - p.agentIncluded) * p.agentRate;
}

// ─── Slider helpers ───────────────────────────────────────────────────────────

/** Logarithmic slider: 0–100 maps to 0–1,000,000 */
function logSliderToUnits(v: number): number {
  if (v === 0) return 0;
  return Math.round(Math.pow(10, (v / 100) * 6));
}

function unitsToLogSlider(n: number): number {
  if (n <= 0) return 0;
  return Math.round((Math.log10(Math.max(1, n)) / 6) * 100);
}

function formatUnits(n: number, label: string): string {
  if (label === 'Address Records (×1,000)') {
    if (n >= 1000) return `${(n).toLocaleString()}K (${(n / 1000).toFixed(1)}M records)`;
    return `${n.toLocaleString()}K records`;
  }
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

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

// ─── Slider component ─────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  color: string;
  displayValue: string;
  marks: { value: number; label: string }[];
  isLog?: boolean;
  includedThreshold?: number; // show "included" zone
  subLabel?: string;
}

function PricingSlider({
  label, icon, value, min, max, step = 1, onChange, color,
  displayValue, marks, isLog = false, includedThreshold, subLabel,
}: SliderProps) {
  const pct = isLog
    ? unitsToLogSlider(value)
    : max > 0 ? ((value - min) / (max - min)) * 100 : 0;

  const includedPct = includedThreshold !== undefined && max > 0
    ? isLog
      ? unitsToLogSlider(includedThreshold)
      : ((includedThreshold - min) / (max - min)) * 100
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold uppercase tracking-wide">
          {icon}
          {label}
        </label>
        <div className="text-right">
          <span className="text-lg font-bold tabular-nums" style={{ color }}>
            {displayValue}
          </span>
          {subLabel && (
            <div className="text-xs text-slate-500 mt-0.5">{subLabel}</div>
          )}
        </div>
      </div>

      {/* Slider track */}
      <div className="relative pt-1">
        {/* Included zone highlight */}
        {includedPct !== null && includedPct > 0 && (
          <div
            className="absolute top-1 h-2 rounded-l-full pointer-events-none"
            style={{
              left: 0,
              width: `${includedPct}%`,
              background: `${color}30`,
              border: `1px solid ${color}40`,
            }}
          />
        )}
        <input
          type="range"
          min={isLog ? 0 : min}
          max={isLog ? 100 : max}
          step={isLog ? 1 : step}
          value={isLog ? pct : value}
          onChange={(e) => {
            const raw = Number(e.target.value);
            onChange(isLog ? logSliderToUnits(raw) : raw);
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer relative z-10"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
            accentColor: color,
          }}
        />
        {/* Tick marks */}
        {marks.length > 0 && (
          <div className="relative mt-2 h-8">
            {marks.map((m) => {
              const markPct = isLog
                ? unitsToLogSlider(m.value)
                : max > 0 ? ((m.value - min) / (max - min)) * 100 : 0;
              return (
                <div
                  key={m.value}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${markPct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-px h-1.5 bg-slate-600 mb-0.5" />
                  {m.label.split('\n').map((line, i) => (
                    <span key={i} className="text-[9px] text-slate-600 leading-tight text-center whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Included zone label */}
      {includedThreshold !== undefined && includedThreshold > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-1.5 rounded-full" style={{ background: `${color}40`, border: `1px solid ${color}60` }} />
          <span className="text-slate-500">
            First {formatUnits(includedThreshold, label)} included in base fee — no overage charge
          </span>
        </div>
      )}
    </div>
  );
}

// ─── TruClaw tier indicator ───────────────────────────────────────────────────

function TruClawTierBar({ agents, color }: { agents: number; color: string }) {
  const tiers = [
    { label: 'Starter', range: '1–10 agents', fee: '$1,299/mo', max: 10, active: agents <= 10 },
    { label: 'Standard', range: '11–50 agents', fee: '$6,995/mo', max: 50, active: agents > 10 && agents <= 50 },
    { label: 'Enterprise', range: '50+ agents', fee: 'Contact Sales', max: Infinity, active: agents > 50 },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold uppercase tracking-wide">
          <Bot className="h-4 w-4 text-slate-500" />
          Active AI Agents
        </label>
        <span className="text-lg font-bold tabular-nums" style={{ color }}>{agents}</span>
      </div>
      <input
        type="range"
        min={1}
        max={60}
        value={agents}
        onChange={() => {}} // controlled via parent
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((agents - 1) / 59) * 100}%, rgba(255,255,255,0.1) ${((agents - 1) / 59) * 100}%, rgba(255,255,255,0.1) 100%)`,
          accentColor: color,
        }}
        readOnly
      />
      <div className="grid grid-cols-3 gap-2 mt-3">
        {tiers.map((t) => (
          <div
            key={t.label}
            className="rounded-lg p-2.5 text-center transition-all duration-200"
            style={{
              background: t.active ? `${color}18` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${t.active ? color + '50' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: t.active ? `0 0 12px ${color}20` : 'none',
            }}
          >
            <div className="text-xs font-bold mb-0.5" style={{ color: t.active ? color : '#64748b' }}>
              {t.label}
            </div>
            <div className="text-[10px] text-slate-500 mb-1">{t.range}</div>
            <div className="text-xs font-semibold" style={{ color: t.active ? '#fff' : '#475569' }}>
              {t.fee}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PricingCalculator({ onRequestQuote }: PricingCalculatorProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('arqen');
  const [units, setUnits] = useState<number>(10_000);
  const [agents, setAgents] = useState<number>(0);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProduct) ?? PRODUCTS[0],
    [selectedProduct]
  );

  // Reset units/agents when product changes
  const handleSelectProduct = useCallback((id: string) => {
    const p = PRODUCTS.find((x) => x.id === id) ?? PRODUCTS[0];
    setSelectedProduct(id);
    setUnits(p.sliderDefault);
    setAgents(p.agentDefault);
  }, []);

  const breakdown = useMemo(() => {
    if (product.isTruClaw) {
      const { total, tierLabel, isCustom } = calcTruClawCost(units, product);
      return { base: total, unitCost: 0, agentCost: 0, total, isCustom, tierLabel };
    }
    const base = product.baseFee;
    const unitCost = calcUnitCost(product, units);
    const agentCost = calcAgentCost(product, agents);
    const total = base + unitCost + agentCost;
    const isCustom = product.customAboveUnits !== undefined && units > product.customAboveUnits;
    return { base, unitCost, agentCost, total, isCustom, tierLabel: null };
  }, [product, units, agents]);

  const effectiveMonthly = useMemo(() => {
    if (billingCycle === 'annual' && !breakdown.isCustom) {
      return Math.round(breakdown.total * (1 - product.annualDiscount));
    }
    return breakdown.total;
  }, [billingCycle, breakdown.total, breakdown.isCustom, product.annualDiscount]);

  const annualSavings = useMemo(() => {
    if (billingCycle === 'annual' && !breakdown.isCustom) {
      return Math.round(breakdown.total * product.annualDiscount * 12);
    }
    return 0;
  }, [billingCycle, breakdown.total, breakdown.isCustom, product.annualDiscount]);

  const annualTotal = effectiveMonthly * 12;

  // Legacy cost comparison
  const legacyCost = useMemo(() => Math.round(5000 + units * 0.25 + agents * 500), [units, agents]);
  const savings = Math.max(0, legacyCost - effectiveMonthly);
  const savingsPct = legacyCost > 0 ? Math.round((savings / legacyCost) * 100) : 0;

  const handleRequestQuote = useCallback(() => {
    onRequestQuote({
      productInterest: selectedProduct,
      estimatedNodes: units,
      estimatedAgents: agents,
      estimatedMonthlyBudget: breakdown.isCustom
        ? 'Enterprise / Custom'
        : `${formatCurrency(effectiveMonthly)}/mo (${billingCycle})`,
      billingCycle,
    });
  }, [selectedProduct, units, agents, effectiveMonthly, breakdown.isCustom, billingCycle, onRequestQuote]);

  const coreProducts = PRODUCTS.filter((p) => p.category === 'Core');
  const verticalProducts = PRODUCTS.filter((p) => p.category === 'Vertical');

  // Unit display value
  const unitDisplayValue = product.isTruClaw
    ? `${units} agent${units !== 1 ? 's' : ''}`
    : formatUnits(units, product.unitLabel);

  // Sub-label for units (tier info)
  const unitSubLabel = product.isTruClaw ? undefined :
    product.unitsIncluded > 0 && units <= product.unitsIncluded
      ? `Within included ${formatUnits(product.unitsIncluded, product.unitLabel)} — no overage`
      : product.unitsIncluded > 0 && units > product.unitsIncluded
      ? `${formatUnits(units - product.unitsIncluded, product.unitLabel)} above included → +${formatCurrency(breakdown.unitCost)}/mo`
      : undefined;

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
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)',
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
            LIVE PRICING ESTIMATOR
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Estimate Your Monthly Investment
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select a product, adjust the sliders to match your environment, and see your
            estimated monthly cost update in real time. All pricing matches the Core Offerings
            cards — no hidden fees.
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
                Save {Math.round(product.annualDiscount * 100)}%
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
                    {coreProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
                        className="relative flex flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition-all duration-200"
                        style={{
                          background: selectedProduct === p.id ? `${p.color}18` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selectedProduct === p.id ? p.color + '50' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: selectedProduct === p.id ? `0 0 16px ${p.color}20` : 'none',
                        }}
                      >
                        {p.highlight && (
                          <span
                            className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: p.color, color: '#000' }}
                          >
                            {p.highlight}
                          </span>
                        )}
                        <span style={{ color: selectedProduct === p.id ? p.color : '#64748b' }}>
                          {p.icon}
                        </span>
                        <span
                          className="text-xs font-semibold leading-tight"
                          style={{ color: selectedProduct === p.id ? '#fff' : '#94a3b8' }}
                        >
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Vertical Solutions group */}
                  <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2">Vertical Solutions</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {verticalProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
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
                          className="text-xs font-semibold leading-tight"
                          style={{ color: selectedProduct === p.id ? '#fff' : '#94a3b8' }}
                        >
                          {p.label}
                        </span>
                        {p.isFlat && (
                          <span className="text-[9px] text-slate-600 font-medium">Flat rate</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                {product.isFlat ? (
                  /* Flat-rate product — no sliders, just a clear message */
                  <div
                    className="rounded-xl p-5 text-center"
                    style={{
                      background: `${product.color}08`,
                      border: `1px solid ${product.color}25`,
                    }}
                  >
                    <div className="text-2xl font-black mb-1" style={{ color: product.color }}>
                      {formatCurrency(product.baseFee)}<span className="text-base font-medium text-slate-400">/mo</span>
                    </div>
                    <div className="text-slate-400 text-sm mb-2">{product.baseFeeLabel}</div>
                    <div className="text-slate-500 text-xs">
                      Flat-rate product — one predictable monthly fee regardless of usage.
                      No sliders needed.
                    </div>
                  </div>
                ) : product.isTruClaw ? (
                  /* TruClaw — agent tier selector */
                  <div>
                    <TruClawTierBar agents={units} color={product.color} />
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={units}
                      onChange={(e) => setUnits(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer mt-3"
                      style={{
                        background: `linear-gradient(to right, ${product.color} 0%, ${product.color} ${((units - 1) / 59) * 100}%, rgba(255,255,255,0.1) ${((units - 1) / 59) * 100}%, rgba(255,255,255,0.1) 100%)`,
                        accentColor: product.color,
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>1</span>
                      <span className="text-center">10<br/><span className="text-[9px]">Starter→Standard</span></span>
                      <span className="text-center">50<br/><span className="text-[9px]">Standard→Enterprise</span></span>
                      <span>60+</span>
                    </div>
                  </div>
                ) : (
                  /* Standard slider */
                  <PricingSlider
                    label={product.unitLabel}
                    icon={<Server className="h-4 w-4 text-slate-500" />}
                    value={units}
                    min={product.sliderMin}
                    max={product.sliderMax}
                    onChange={setUnits}
                    color={product.color}
                    displayValue={unitDisplayValue}
                    marks={product.sliderMarks}
                    isLog={product.sliderIsLog}
                    includedThreshold={product.unitsIncluded > 0 ? product.unitsIncluded : undefined}
                    subLabel={unitSubLabel}
                  />
                )}

                {/* Agent slider — shown for Arqen and Full Suite */}
                {product.hasAgentSlider && (
                  <PricingSlider
                    label="Active AI Agents"
                    icon={<Bot className="h-4 w-4 text-slate-500" />}
                    value={agents}
                    min={product.agentMin}
                    max={product.agentMax}
                    onChange={setAgents}
                    color={product.color}
                    displayValue={`${agents} agent${agents !== 1 ? 's' : ''}`}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 10, label: '10\n(included)' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                      { value: 250, label: '250' },
                      { value: 500, label: '500' },
                    ]}
                    includedThreshold={product.agentIncluded > 0 ? product.agentIncluded : undefined}
                    subLabel={
                      agents > product.agentIncluded
                        ? `${agents - product.agentIncluded} agents × $${product.agentRate} = +${formatCurrency(calcAgentCost(product, agents))}/mo`
                        : product.agentIncluded > 0
                        ? `${product.agentIncluded} agents included in base fee`
                        : undefined
                    }
                  />
                )}

                {/* Pricing rate info */}
                <div
                  className="flex items-start gap-2 rounded-lg px-4 py-3 text-xs text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                  <span>{product.infoText}</span>
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
                    {' '}({Math.round(product.annualDiscount * 100)}% off)
                  </div>
                )}

                {/* Total */}
                <div className="mb-6">
                  {breakdown.isCustom ? (
                    <div>
                      <div
                        className="text-3xl font-black mb-1 flex items-center gap-2"
                        style={{ color: product.color }}
                      >
                        <Phone className="h-6 w-6" />
                        Contact Sales
                      </div>
                      <div className="text-slate-500 text-sm">
                        Enterprise-scale deployment — custom pricing based on contract term and deployment configuration.
                      </div>
                    </div>
                  ) : (
                    <div>
                      {billingCycle === 'annual' ? (
                        <>
                          <div className="text-slate-500 text-sm line-through mb-0.5">
                            {formatCurrency(breakdown.total)}/mo
                          </div>
                          <div className="text-4xl font-black mb-0.5" style={{ color: product.color }}>
                            {formatCurrency(effectiveMonthly)}
                            <span className="text-base font-medium text-slate-400">/mo</span>
                          </div>
                          <div className="text-slate-500 text-xs">per month, billed annually</div>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl font-black mb-0.5" style={{ color: product.color }}>
                            {formatCurrency(breakdown.total)}
                            <span className="text-base font-medium text-slate-400">/mo</span>
                          </div>
                          {product.annualDiscount > 0 && (
                            <div className="text-slate-500 text-xs">
                              save {formatCurrency(Math.round(breakdown.total * product.annualDiscount * 12))}/yr with annual billing
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Breakdown */}
                {!breakdown.isCustom && (
                  <div className="space-y-2 text-sm mb-6">
                    <button
                      onClick={() => setShowBreakdown((v) => !v)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors mb-2"
                    >
                      <ChevronRight
                        className="h-3.5 w-3.5 transition-transform"
                        style={{ transform: showBreakdown ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      />
                      {showBreakdown ? 'Hide' : 'Show'} cost breakdown
                    </button>

                    {showBreakdown && (
                      <div className="space-y-1.5 text-xs rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {/* Base fee row */}
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            Base fee
                            <span className="block text-slate-600">{product.baseFeeLabel}</span>
                          </span>
                          <span className="text-white font-medium">
                            {billingCycle === 'annual'
                              ? <><span className="line-through text-slate-600 mr-1">{formatCurrency(product.baseFee)}</span>{formatCurrency(Math.round(product.baseFee * (1 - product.annualDiscount)))}</>
                              : formatCurrency(product.baseFee)
                            }
                          </span>
                        </div>

                        {/* Unit overage row */}
                        {!product.isFlat && !product.isTruClaw && breakdown.unitCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {product.unitLabel} overage
                              <span className="block text-slate-600">
                                {formatUnits(Math.max(0, units - product.unitsIncluded), product.unitLabel)} × ${product.unitRate}/{product.unitLabel.includes('×1K') ? '1K' : 'unit'}
                              </span>
                            </span>
                            <span className="text-white font-medium">
                              {billingCycle === 'annual'
                                ? <><span className="line-through text-slate-600 mr-1">{formatCurrency(breakdown.unitCost)}</span>{formatCurrency(Math.round(breakdown.unitCost * (1 - product.annualDiscount)))}</>
                                : formatCurrency(breakdown.unitCost)
                              }
                            </span>
                          </div>
                        )}

                        {/* Units within base */}
                        {!product.isFlat && !product.isTruClaw && breakdown.unitCost === 0 && product.unitsIncluded > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {formatUnits(units, product.unitLabel)} {product.unitLabel.toLowerCase()}
                              <span className="block text-slate-600">Within included {formatUnits(product.unitsIncluded, product.unitLabel)}</span>
                            </span>
                            <span className="text-slate-600 font-medium">$0</span>
                          </div>
                        )}

                        {/* TruClaw tier */}
                        {product.isTruClaw && breakdown.tierLabel && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">{breakdown.tierLabel}</span>
                            <span className="text-slate-600 font-medium">Included</span>
                          </div>
                        )}

                        {/* Agent cost */}
                        {product.hasAgentSlider && breakdown.agentCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              Agent cost
                              <span className="block text-slate-600">{agents - product.agentIncluded} agents × ${product.agentRate}</span>
                            </span>
                            <span className="text-white font-medium">
                              {billingCycle === 'annual'
                                ? <><span className="line-through text-slate-600 mr-1">{formatCurrency(breakdown.agentCost)}</span>{formatCurrency(Math.round(breakdown.agentCost * (1 - product.annualDiscount)))}</>
                                : formatCurrency(breakdown.agentCost)
                              }
                            </span>
                          </div>
                        )}

                        {/* Total row */}
                        <div
                          className="flex justify-between pt-2 mt-1 font-semibold"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <span className="text-slate-300">Total / month</span>
                          <span style={{ color: product.color }}>
                            {billingCycle === 'annual' ? (
                              <><span className="line-through text-slate-600 mr-1.5 text-xs font-normal">{formatCurrency(breakdown.total)}</span>{formatCurrency(effectiveMonthly)}</>
                            ) : (
                              formatCurrency(breakdown.total)
                            )}
                          </span>
                        </div>

                        {billingCycle === 'annual' && (
                          <div className="flex justify-between text-xs pt-1" style={{ color: '#00E5FF' }}>
                            <span>Annual total (billed once)</span>
                            <span className="font-mono font-semibold">{formatCurrency(annualTotal)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Savings vs legacy */}
                {savings > 0 && !breakdown.isCustom && (
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
                    {breakdown.isCustom ? 'Request Enterprise Quote' : 'Get Custom Quote'}
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
            Estimates are indicative only. Final pricing depends on contract term, support tier,
            and deployment configuration. All prices in USD. Contact sales for a formal proposal.
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
        nodes={units}
        agents={agents}
        onRequestQuote={handleRequestQuote}
      />
    </section>
  );
}
