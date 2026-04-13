/**
 * Shop.tsx — World-Class Redesign (Apr 2026)
 *
 * Page structure (conversion-optimized):
 *   1. Hero
 *   2. Sticky Category Navigation
 *   3. "How to Choose" Decision Guide (buyer persona routing)
 *   4. Core Offerings (4 products, sorted by entry price)
 *   5. Live Pricing Calculator (moved here, covers all 13 products)
 *   6. Bundle Packages
 *   7. Industry Solutions & Vertical Platforms (9 cards, with category filter)
 *   8. NemoClaw Cost Intelligence
 *   9. Final CTA
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import PricingCalculator from '@/components/PricingCalculator';
import RequestQuoteModal from '@/components/RequestQuoteModal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
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
  Building2,
  Users,
  Globe,
  BookOpen,
  Briefcase,
  MapPin,
  Radio,
  ShoppingCart,
  CheckCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingTier {
  label: string;
  price: string;
  included: string;
}

interface Product {
  id: string;
  dbId: number;
  basePrice: number;
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
  entryPrice: number; // for sorting
}

interface Bundle {
  name: string;
  includes: string;
  monthlyRange: string;
  bestFor: string;
  highlight?: boolean;
  savings?: string;
}

interface VerticalProduct {
  id: string;
  category: string;
  categoryColor: string;
  icon: React.ReactNode;
  name: string;
  tagline: string;
  features: string[];
  startingPrice: string;
  startingPriceNum: number;
}

// ─── Core Products Data (sorted by entry price ascending) ─────────────────────

const products: Product[] = [
  {
    id: 'truclaw',
    dbId: 2,
    basePrice: 799,
    badge: 'Most Popular',
    badgeColor: 'cyan',
    icon: <Brain className="h-8 w-8" />,
    name: 'TruClaw Agentic AI Governance',
    tagline: 'Zero-Trust Orchestration for Autonomous AI Workforces',
    description:
      'Safely orchestrate your autonomous AI workforce with LangGraph, NemoClaw zero-trust guardrails, human approval gates, and real-time cost monitoring. Built-in token optimizations reduce agent spend by 40–70% without sacrificing capability.',
    type: 'Monthly SaaS (Hybrid)',
    entryPrice: 799,
    pricingTiers: [
      { label: 'Starter (≤10 agents)', price: '$799/mo', included: '20M tokens included' },
      { label: 'Standard (11–50 agents)', price: '$7,999/mo', included: '150M tokens included' },
      { label: 'Enterprise (50+ agents)', price: 'Custom', included: 'Unlimited tokens + dedicated optimization' },
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
    entryPrice: 2499,
    pricingTiers: [
      { label: 'Base Platform', price: '$2,499/mo', included: 'Core video analytics' },
      { label: 'Metered Inference', price: '$0.08/camera', included: 'Per camera/endpoint above base' },
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
    entryPrice: 7500,
    pricingTiers: [
      { label: 'Regional', price: '$7,500–$15,000/mo', included: 'Scaled by cameras/nodes (up to 500)' },
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
    entryPrice: 9999,
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
];

// ─── Bundle Data ──────────────────────────────────────────────────────────────

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
    savings: 'Most Popular',
  },
  {
    name: 'Tru-InSight Intelligence',
    includes: 'TruContext + Tru-InSight',
    monthlyRange: 'From $11,999/mo',
    bestFor: 'Physical + cyber convergence',
    savings: 'Save 20%',
  },
  {
    name: 'Complete Defense Suite',
    includes: 'TruContext + TruClaw + Tru-InSight',
    monthlyRange: 'Custom (save 25%)',
    bestFor: 'Enterprise full-stack defense',
    savings: 'Save 25%',
  },
  {
    name: 'ELI National',
    includes: 'ELI + TruContext',
    monthlyRange: 'Custom',
    bestFor: 'National infrastructure & government',
  },
];

// ─── Vertical Products Data ───────────────────────────────────────────────────

const verticalProducts: VerticalProduct[] = [
  {
    id: 'oil-gas',
    category: 'Oil & Gas · Industrial OT',
    categoryColor: '#FFA500',
    icon: <Zap className="h-6 w-6" />,
    name: 'TruContext™ for Oil & Gas Operations',
    tagline: 'AI-driven refinery operations intelligence with 3D digital twins, predictive maintenance, and SCADA/IT-OT threat detection — built for critical energy infrastructure.',
    features: [
      'Interactive 3D facility digital twins with live equipment state visualization',
      'Predictive maintenance AI — RUL scoring, anomaly detection, and failure forecasting',
      'IT/OT convergence with SCADA threat topology and MITRE ATT&CK mapping',
      'ESG and emissions compliance dashboards aligned to national energy frameworks',
    ],
    startingPrice: '$18,500/mo',
    startingPriceNum: 18500,
  },
  {
    id: 'smart-city-gov',
    category: 'Smart City · National Government',
    categoryColor: '#4A90D9',
    icon: <Globe className="h-6 w-6" />,
    name: 'TruContext™ Smart City Suite — Government Edition',
    tagline: 'Comprehensive national smart city command platform covering 10+ urban domains with AI agents, no-code automation marketplace, and 3D geospatial terrain visualization.',
    features: [
      'Unified command dashboard: cybersecurity, traffic, water, energy, health, environment, and infrastructure',
      'Vibe Context — AI-assisted no-code automation and agent builder with installable marketplace',
      'CesiumJS 3D geospatial terrain with real-time severity-based alert markers',
      'Role-based access tiers for executives, urban planners, and operations teams',
    ],
    startingPrice: '$28,000/mo',
    startingPriceNum: 28000,
  },
  {
    id: 'smart-city-municipal',
    category: 'Smart City · Municipal',
    categoryColor: '#64C864',
    icon: <Building2 className="h-6 w-6" />,
    name: 'TruContext™ Smart City Command Center',
    tagline: 'Municipal-scale smart infrastructure monitoring integrating IoT device networks, AI-powered operational insights, predictive maintenance scoring, and D3 network topology visualization.',
    features: [
      'Real-time device fleet monitoring with Mapbox 3D map layer, heatmaps, and clustering',
      'AI command assistant with alert pattern detection and executive voice briefings',
      'Multi-factor predictive maintenance scoring with Critical / High / Medium / Low classification',
      'CSV import/export, full-text search, and drill-down analytics data explorer',
    ],
    startingPrice: '$12,500/mo',
    startingPriceNum: 12500,
  },
  {
    id: 'campus-security',
    category: 'Campus Security · Education',
    categoryColor: '#9370DB',
    icon: <Shield className="h-6 w-6" />,
    name: 'ELI™ Campus Security Intelligence Platform',
    tagline: 'Next-generation campus situational awareness: real-time floor-plan personnel tracking, AI video analytics across 800+ cameras, and coordinated incident response workspaces.',
    features: [
      'Wi-Fi, RFID, and facial recognition data fusion for live 2D floor-plan tracking',
      'AI threat detection — weapons, person-down, and anomalous crowd pattern recognition',
      'Unified alert feed with AI confidence scores and cross-system event correlation',
      'Privacy by design: role-based access, anonymization options, and full audit logging',
    ],
    startingPrice: '$5,500/mo',
    startingPriceNum: 5500,
  },
  {
    id: 'caseforge',
    category: 'Legal Tech · Litigation',
    categoryColor: '#DAA520',
    icon: <Briefcase className="h-6 w-6" />,
    name: 'CaseForge™ Legal Case Intelligence',
    tagline: 'AI-powered litigation command center that transforms document repositories into interactive timelines, evidence matrices, and autonomous case management — powered by TruClaw™ agents.',
    features: [
      'Consolidates 100+ source documents into a unified, searchable intelligence dashboard',
      'AI legal research with natural language queries and voice narration via ElevenLabs TTS',
      'TruClaw™ autonomous agents for document analysis, court monitoring, and outreach automation',
      'Interactive financial analytics, deposition timelines, and evidence matrix visualization',
    ],
    startingPrice: '$2,499/mo',
    startingPriceNum: 2499,
  },
  {
    id: 'aspire',
    category: 'Education · Accountability',
    categoryColor: '#6495ED',
    icon: <BookOpen className="h-6 w-6" />,
    name: 'ASPIRE™ Public Reporting Platform',
    tagline: 'Automated, ADA-compliant public reporting system for charter school accountability frameworks — generating mobile-friendly performance reports from live data warehouse connections.',
    features: [
      'Dual-report architecture: system overview reports and per-school measure score reports',
      'Quarto + Python pipeline with AWS data warehouse integration',
      'Progressive disclosure design with dynamic embedded data narratives',
      'ADA/Section 508 compliant, fully responsive, with graceful handling of suppressed data',
    ],
    startingPrice: '$1,499/mo',
    startingPriceNum: 1499,
  },
  {
    id: 'truaddress',
    category: 'Government · National Infrastructure',
    categoryColor: '#DC143C',
    icon: <MapPin className="h-6 w-6" />,
    name: 'TruAddress™ National Address Intelligence',
    tagline: 'AI-powered national address data collection, verification, and management — enabling postal services, emergency response, financial inclusion, and e-government at scale.',
    features: [
      'Satellite-assisted AI address detection with mobile-first field verification workflows',
      'Province-level analytics with animated progress tracking and verification status mapping',
      'Surveyor management portal supporting 10,000+ active field agents',
      'Service integration APIs for postal, financial, emergency response, and civic platforms',
    ],
    startingPrice: '$8,500/mo',
    startingPriceNum: 8500,
  },
  {
    id: 'panelpulse',
    category: 'Research · NGO · Government',
    categoryColor: '#00CED1',
    icon: <Radio className="h-6 w-6" />,
    name: 'PanelPulse™ Research Panel Management',
    tagline: 'Full-stack sovereign survey panel platform — recruit panelists, distribute WhatsApp and SMS pulse surveys, manage airtime incentives, and analyze results with AI — no third-party panel providers required.',
    features: [
      'Multi-channel survey distribution via WhatsApp and SMS with real-time response tracking',
      'Airtime incentive management with automated reward disbursement to respondents',
      'AI-powered analysis and automated news generation with integrated search summarization',
      'Multi-region deployment: manage panels across departments, districts, or countries',
    ],
    startingPrice: '$799/mo',
    startingPriceNum: 799,
  },
  {
    id: 'smart-city-demo',
    category: 'Pre-Sales · Systems Integrators',
    categoryColor: '#FF69B4',
    icon: <Users className="h-6 w-6" />,
    name: 'Smart City Proposal & Demo Suite',
    tagline: 'Production-ready smart city reference platform and proposal toolkit — stakeholder-ready dashboards, ROI models, integration guides, and white-label capability for RFP and procurement responses.',
    features: [
      'Full-stack demo environment with GPU-accelerated geospatial and 3D map visualization',
      'Pre-built ROI and investment return models (based on $85M / $150M+ 10-year framework)',
      'Standards documentation package: FIWARE NGSI-LD, MITRE ATT&CK, OGC SensorThings, GTFS',
      'White-label and systems integrator licensing available',
    ],
    startingPrice: '$2,499/mo',
    startingPriceNum: 2499,
  },
];

// Category filter options for vertical solutions
const VERTICAL_CATEGORIES = [
  'All',
  'Smart City',
  'Government',
  'Security',
  'Legal & Research',
];

function getVerticalCategory(cat: string): string {
  if (cat.includes('Smart City')) return 'Smart City';
  if (cat.includes('Government') || cat.includes('National Infrastructure') || cat.includes('NGO')) return 'Government';
  if (cat.includes('Security') || cat.includes('Oil') || cat.includes('Industrial')) return 'Security';
  if (cat.includes('Legal') || cat.includes('Research') || cat.includes('Education') || cat.includes('Pre-Sales')) return 'Legal & Research';
  return 'All';
}

// Cost features for NemoClaw section
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
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteDefaultProduct, setQuoteDefaultProduct] = useState<string>('');
  const [activeVerticalFilter, setActiveVerticalFilter] = useState<string>('All');
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const [pricingSnapshot, setPricingSnapshot] = useState<{
    productInterest: string;
    estimatedNodes: number;
    estimatedAgents: number;
    estimatedMonthlyBudget: string;
    billingCycle?: 'monthly' | 'annual';
  } | undefined>(undefined);

  const heroRef = useRef<HTMLDivElement>(null);

  // ── Stripe checkout mutation ─────────────────────────────────────────────
  const checkoutMutation = trpc.shopCheckout.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
        toast.info('Redirecting to secure checkout…', {
          description: 'A new tab has opened with the Stripe checkout page.',
        });
      }
    },
    onError: (err) => {
      toast.error('Checkout failed', { description: err.message });
    },
  });

  const handleSubscribe = useCallback(
    (productId: string, billingCycle: 'monthly' | 'annual' = 'monthly') => {
      checkoutMutation.mutate({ productId, billingCycle });
    },
    [checkoutMutation]
  );

  // Handle checkout success/cancel URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get('checkout');
    const productName = params.get('product');
    if (checkoutStatus === 'success') {
      toast.success('Subscription activated!', {
        description: productName
          ? `Your ${decodeURIComponent(productName)} subscription is now active.`
          : 'Your subscription is now active. Welcome to Visium Technologies.',
        duration: 8000,
      });
      // Clean up URL
      window.history.replaceState({}, '', '/shop');
    } else if (checkoutStatus === 'cancelled') {
      toast.info('Checkout cancelled', {
        description: 'Your subscription was not started. Return any time to subscribe.',
      });
      window.history.replaceState({}, '', '/shop');
    }
  }, []);

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

  // Animate node counter in hero
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

  // Show sticky nav after hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyNavVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredVerticals = activeVerticalFilter === 'All'
    ? verticalProducts
    : verticalProducts.filter((v) => getVerticalCategory(v.category) === activeVerticalFilter);

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
            description: 'Agentic AI governance, explainable AI cybersecurity, and token-efficient agent platforms',
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
          STICKY CATEGORY NAVIGATION
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          transform: stickyNavVisible ? 'translateY(0)' : 'translateY(-100%)',
          background: 'rgba(5,5,16,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,229,255,0.15)',
        }}
      >
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { label: 'Core Platforms', href: '#products' },
              { label: 'Pricing Estimator', href: '#pricing-calculator' },
              { label: 'Bundle Packages', href: '#bundles' },
              { label: 'Vertical Solutions', href: '#industry-solutions' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-cyan-500/10 hover:text-cyan-300 text-slate-400 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => openQuoteModal()}
            className="flex-shrink-0 text-black font-bold text-xs px-4"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
          >
            Get Quote
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden pt-24 pb-20 px-4">
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
            <a href="#how-to-choose">
              <Button
                size="lg"
                className="text-black font-bold px-8 py-4 text-base"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Help Me Choose
              </Button>
            </a>
            <a href="#pricing-calculator">
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 text-base"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Calculate My Price
              </Button>
            </a>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-slate-300 hover:bg-white/5 px-8 py-4 text-base"
              >
                <Clock className="h-5 w-5 mr-2" />
                Schedule Demo
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
          2. HOW TO CHOOSE — BUYER PERSONA ROUTING
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how-to-choose" className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Find Your Fit
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Which Platform Is Right for You?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Not sure where to start? Pick the profile that best describes your team and we'll point you to the right product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                color: '#00E5FF',
                persona: 'Security & SOC Teams',
                description: 'You need real-time threat detection, MITRE ATT&CK mapping, and explainable AI across your entire network.',
                recommendation: 'TruContext Core Platform',
                recommendationHref: '#products',
                price: 'From $9,999/mo',
                bullets: ['Graph-based threat correlation', 'MITRE ATT&CK integration', '30-day time to value'],
              },
              {
                icon: <Brain className="h-8 w-8" />,
                color: '#7C3AED',
                persona: 'AI & DevOps Teams',
                description: 'You\'re deploying autonomous AI agents and need governance, cost controls, and zero-trust guardrails.',
                recommendation: 'TruClaw Agentic AI Governance',
                recommendationHref: '#products',
                price: 'From $799/mo',
                bullets: ['Zero-trust AI guardrails', '40–70% token cost savings', 'Human approval gates'],
              },
              {
                icon: <Globe className="h-8 w-8" />,
                color: '#F59E0B',
                persona: 'Government & Infrastructure',
                description: 'You need national-scale surveillance, smart city command, or critical infrastructure protection.',
                recommendation: 'ELI + Vertical Solutions',
                recommendationHref: '#industry-solutions',
                price: 'From $5,500/mo',
                bullets: ['White-label deployment', 'Government procurement vehicles', 'National-scale architecture'],
              },
            ].map((card) => (
              <a
                key={card.persona}
                href={card.recommendationHref}
                className="block rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-300 p-7 group cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${card.color}20`, color: card.color }}
                >
                  {card.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{card.persona}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{card.description}</p>
                <div
                  className="rounded-lg px-4 py-3 mb-4"
                  style={{ background: `${card.color}10`, border: `1px solid ${card.color}30` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: card.color }}>
                    Recommended
                  </p>
                  <p className="text-white font-semibold text-sm">{card.recommendation}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{card.price}</p>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: card.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: card.color }}>
                  See {card.recommendation.split(' ')[0]} <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. CORE OFFERINGS (sorted by entry price)
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
              Each platform is available as a standalone monthly subscription or as part of a bundled suite.
              All pricing is hybrid: a predictable base fee plus transparent metered usage.
              Sorted by entry price — start small, scale as you grow.
            </p>
          </div>

          {/* Quick compare strip */}
          <div
            className="rounded-2xl border border-white/8 overflow-hidden mb-12"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="grid grid-cols-5 gap-2 px-6 py-3 border-b border-white/8 bg-white/5">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Product</span>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Entry Price</span>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Pricing Model</span>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Best For</span>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Action</span>
            </div>
            {[
              { name: 'TruClaw', entry: '$799/mo', model: 'Flat tier + agent count', bestFor: 'AI governance teams', href: '#products', color: '#7C3AED' },
              { name: 'Tru-InSight', entry: '$2,499/mo', model: 'Base + $0.08/camera', bestFor: 'Video intelligence', href: '#products', color: '#0EA5E9' },
              { name: 'ELI', entry: '$7,500/mo', model: 'Base + $0.15/node', bestFor: 'Physical security ops', href: '#products', color: '#F59E0B' },
              { name: 'TruContext', entry: '$9,999/mo', model: 'Base + tiered node rate', bestFor: 'SOC & threat analysts', href: '#products', color: '#00E5FF' },
            ].map((row, i) => (
              <div
                key={row.name}
                className={`grid grid-cols-5 gap-2 px-6 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${i === 3 ? 'border-b-0' : ''}`}
              >
                <span className="text-white font-semibold text-sm" style={{ color: row.color }}>{row.name}</span>
                <span className="text-white font-bold text-sm">{row.entry}</span>
                <span className="text-slate-400 text-sm">{row.model}</span>
                <span className="text-slate-400 text-sm">{row.bestFor}</span>
                <a href={row.href} className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1">
                  View <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
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

                  {/* Pricing tiers — always visible */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">
                      Pricing Tiers
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

                  {/* CTAs */}
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Primary: Subscribe Now (Stripe checkout) */}
                    <Button
                      className="w-full font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                      onClick={() => handleSubscribe(product.id === 'truclaw' ? 'truclaw-starter' : product.id)}
                      disabled={checkoutMutation.isPending}
                    >
                      {checkoutMutation.isPending ? 'Opening checkout…' : 'Subscribe Now'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    {/* Secondary row: Request Demo + Add to Cart */}
                    <div className="flex gap-2">
                      <Link href={product.ctaHref} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-white/15 text-slate-300 hover:bg-white/5 hover:text-white text-sm"
                        >
                          {product.cta}
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-white/15 text-slate-400 hover:bg-white/5 hover:text-white"
                        onClick={() => handleAddToCart(product)}
                        title="Add to cart"
                      >
                        {addedProducts.has(product.id) ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. LIVE PRICING CALCULATOR (moved here, below Core Offerings)
      ══════════════════════════════════════════════════════════════════════ */}
      <PricingCalculator onRequestQuote={handleRequestQuote} />

      {/* ══════════════════════════════════════════════════════════════════════
          5. BUNDLE PACKAGES TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" id="bundles">
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
            <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/10 bg-white/5">
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Bundle</span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Includes</span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Monthly (Annual Billing)</span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Best For</span>
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Savings</span>
            </div>

            {/* Table rows */}
            {bundles.map((bundle, i) => (
              <div
                key={bundle.name}
                className={`grid grid-cols-5 gap-4 px-6 py-5 border-b border-white/8 transition-colors hover:bg-white/5 ${
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
                <span className="text-sm">
                  {bundle.savings ? (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      {bundle.savings}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </span>
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
          6. INDUSTRY SOLUTIONS & VERTICAL PLATFORMS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" id="industry-solutions">
        <div className="container max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Vertical Solutions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Industry Solutions &amp; Vertical Platforms
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              Purpose-built applications powered by TruContext™ intelligence — deployable standalone
              or integrated with the full Visium platform suite. Each solution is available for
              custom scoping, white-label deployment, and government procurement vehicles.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {VERTICAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveVerticalFilter(cat)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: activeVerticalFilter === cat ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeVerticalFilter === cat ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: activeVerticalFilter === cat ? '#00E5FF' : '#64748b',
                }}
              >
                {cat === 'All' && <Filter className="h-3.5 w-3.5" />}
                {cat}
                {cat !== 'All' && (
                  <span
                    className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}
                  >
                    {verticalProducts.filter((v) => getVerticalCategory(v.category) === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Vertical product cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredVerticals.map((vp) => (
              <div
                key={vp.id}
                className="relative rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden flex flex-col"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
              >
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{
                        background: `${vp.categoryColor}20`,
                        color: vp.categoryColor,
                      }}
                    >
                      {vp.icon}
                    </div>
                    <div>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
                        style={{
                          background: `${vp.categoryColor}18`,
                          color: vp.categoryColor,
                          border: `1px solid ${vp.categoryColor}40`,
                        }}
                      >
                        {vp.category}
                      </span>
                      <h3 className="text-xl font-bold text-white">{vp.name}</h3>
                      <p className="text-cyan-400 text-sm mt-0.5">{vp.tagline}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {vp.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2
                          className="h-4 w-4 flex-shrink-0 mt-0.5"
                          style={{ color: '#00E5FF' }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="flex items-center justify-between rounded-lg px-4 py-3 border border-white/8 mb-2"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <span className="text-slate-400 text-sm">Starting at</span>
                    <div className="text-right">
                      <span className="text-white font-bold text-sm">
                        {vp.startingPrice.replace('/mo', '')}
                        <span className="text-slate-400 font-normal">/mo</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Annual billing saves 15–20%. Volume discounts available.</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                      onClick={() => handleSubscribe(vp.id)}
                      disabled={checkoutMutation.isPending}
                    >
                      {checkoutMutation.isPending ? 'Opening checkout…' : 'Subscribe Now'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Link href="/demo">
                      <Button
                        className="w-full font-semibold border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 text-sm"
                        variant="outline"
                      >
                        Get Custom Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVerticals.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No solutions found for this category.
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. NEMOCLAW COST INTELLIGENCE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
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

          {/* Cost comparison bar */}
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
          8. FINAL CTA SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl border border-cyan-500/30 p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(0,128,255,0.05) 100%)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.3) 0%, transparent 60%)',
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
