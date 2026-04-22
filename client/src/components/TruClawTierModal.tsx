/**
 * TruClawTierModal.tsx
 *
 * Modal that appears when a user clicks "Subscribe Now" for TruClaw.
 * Presents three tiers (Starter / Standard / Enterprise) with pricing,
 * feature lists, and a billing cycle toggle, then initiates the
 * Stripe checkout for the selected tier.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Zap,
  Shield,
  Building2,
  ArrowRight,
  Phone,
  Star,
} from 'lucide-react';

// ─── Tier definitions ─────────────────────────────────────────────────────────

type BillingCycle = 'monthly' | 'annual';

interface TruClawTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null; // null = contact sales
  annualDiscount: number;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  features: string[];
  limits: string;
  contactSales?: boolean;
}

const TRUCLAW_TIERS: TruClawTier[] = [
  {
    id: 'truclaw-starter',
    name: 'Starter',
    tagline: 'Perfect for small teams and pilot deployments',
    monthlyPrice: 1299,
    annualDiscount: 0.10,
    icon: <Zap className="h-6 w-6" />,
    features: [
      'Up to 10 AI agents monitored',
      'Real-time behavioral analysis',
      'an independent research organization ATT&CK mapping',
      'Automated alert triage',
      'Standard API integrations',
      'Email & Slack notifications',
      'Community support',
    ],
    limits: '≤ 10 agents',
  },
  {
    id: 'truclaw-standard',
    name: 'Standard',
    tagline: 'For growing security teams with complex AI environments',
    monthlyPrice: 6995,
    annualDiscount: 0.10,
    icon: <Shield className="h-6 w-6" />,
    badge: 'Most Popular',
    badgeColor: 'bg-cyan-500 text-black',
    features: [
      'Up to 50 AI agents monitored',
      'Advanced threat correlation engine',
      'Full an independent research organization ATT&CK & D3FEND coverage',
      'Autonomous remediation workflows',
      'Custom policy rule builder',
      'SIEM / SOAR integrations',
      'Role-based access control',
      'Priority support (24/5)',
    ],
    limits: '11–50 agents',
  },
  {
    id: 'truclaw-enterprise',
    name: 'Enterprise',
    tagline: 'Unlimited scale for mission-critical AI deployments',
    monthlyPrice: null,
    annualDiscount: 0.10,
    icon: <Building2 className="h-6 w-6" />,
    badge: 'Custom Pricing',
    badgeColor: 'bg-blue-600/20 text-purple-300 border border-blue-500/40',
    features: [
      'Unlimited AI agents',
      'Multi-tenant / multi-cloud deployment',
      'Air-gapped / on-premise option',
      'Custom threat intelligence feeds',
      'Dedicated security engineering team',
      'SLA-backed 99.99% uptime',
      'FedRAMP / CMMC compliance support',
      'White-label licensing available',
    ],
    limits: '50+ agents',
    contactSales: true,
  },
];

// ─── Tier card ────────────────────────────────────────────────────────────────

interface TierCardProps {
  tier: TruClawTier;
  billingCycle: BillingCycle;
  selected: boolean;
  onSelect: () => void;
}

function TierCard({ tier, billingCycle, selected, onSelect }: TierCardProps) {
  const discountedMonthly =
    tier.monthlyPrice !== null
      ? Math.round(tier.monthlyPrice * (1 - tier.annualDiscount))
      : null;

  const displayPrice =
    tier.monthlyPrice !== null
      ? billingCycle === 'annual'
        ? discountedMonthly
        : tier.monthlyPrice
      : null;

  const annualTotal =
    discountedMonthly !== null ? discountedMonthly * 12 : null;

  const annualSavings =
    tier.monthlyPrice !== null && discountedMonthly !== null
      ? (tier.monthlyPrice - discountedMonthly) * 12
      : null;

  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all focus:outline-none ${
        selected
          ? 'border-cyan-400 bg-cyan-500/8'
          : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
      }`}
      style={selected ? { boxShadow: '0 0 0 3px rgba(0,229,255,0.15)' } : {}}
    >
      {/* Badge */}
      {tier.badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${tier.badgeColor}`}
        >
          {tier.badge}
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="p-2 rounded-lg"
            style={{
              background: selected ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.06)',
              color: selected ? '#00E5FF' : '#94a3b8',
            }}
          >
            {tier.icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{tier.name}</h3>
            <p className="text-slate-400 text-xs">{tier.limits}</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          {tier.contactSales ? (
            <div>
              <p className="text-white font-bold text-lg">Custom</p>
              <p className="text-slate-400 text-xs">Contact sales</p>
            </div>
          ) : (
            <div>
              {billingCycle === 'annual' && tier.monthlyPrice !== null && (
                <p className="text-slate-500 text-xs line-through">
                  ${tier.monthlyPrice.toLocaleString()}/mo
                </p>
              )}
              <p className="text-white font-bold text-xl">
                ${displayPrice!.toLocaleString()}
                <span className="text-slate-400 text-sm font-normal">/mo</span>
              </p>
              {billingCycle === 'annual' && annualSavings !== null && (
                <p className="text-cyan-400 text-xs font-semibold">
                  Save ${annualSavings.toLocaleString()}/yr
                </p>
              )}
              {billingCycle === 'annual' && annualTotal !== null && (
                <p className="text-slate-500 text-xs">
                  ${annualTotal.toLocaleString()} billed annually
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-slate-400 text-sm mb-3">{tier.tagline}</p>

      {/* Features */}
      <ul className="space-y-1.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2
              className="h-4 w-4 flex-shrink-0 mt-0.5"
              style={{ color: selected ? '#00E5FF' : '#4ade80' }}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* Selected indicator */}
      {selected && (
        <div className="mt-4 flex items-center gap-1.5 text-cyan-400 text-sm font-semibold">
          <Star className="h-4 w-4 fill-cyan-400" />
          Selected
        </div>
      )}
    </button>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface TruClawTierModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-selected billing cycle from the parent (e.g. from the billing toggle) */
  defaultBillingCycle?: BillingCycle;
}

export default function TruClawTierModal({
  open,
  onClose,
  defaultBillingCycle = 'monthly',
}: TruClawTierModalProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>('truclaw-standard');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(defaultBillingCycle);

  const checkoutMutation = trpc.shopCheckout.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
        toast.info('Redirecting to Stripe Checkout…', {
          description: 'Complete your subscription in the new tab.',
        });
        onClose();
      }
    },
    onError: (err) => {
      toast.error('Checkout failed', { description: err.message });
    },
  });

  const selectedTier = TRUCLAW_TIERS.find((t) => t.id === selectedTierId)!;

  const handleProceed = () => {
    if (selectedTier.contactSales) {
      window.location.href = '/demo?product=TruClaw+Enterprise';
      onClose();
      return;
    }
    checkoutMutation.mutate({
      productId: selectedTierId,
      billingCycle,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-4xl w-full border-white/10 p-0 overflow-hidden"
        style={{ background: '#0a0a1f', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="p-2 rounded-xl"
              style={{ background: 'rgba(0,229,255,0.12)', color: '#00E5FF' }}
            >
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl font-bold">
                Choose Your TruClaw™ Plan
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm">
                AI Agent Governance & Behavioral Security — select the tier that fits your deployment
              </DialogDescription>
            </div>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-slate-400 text-sm">Billing:</span>
            <div className="flex rounded-lg border border-white/15 overflow-hidden">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-cyan-500/15 text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                  Save 10%
                </span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {TRUCLAW_TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billingCycle={billingCycle}
              selected={selectedTierId === tier.id}
              onSelect={() => setSelectedTierId(tier.id)}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 border-t border-white/10 pt-4 flex items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            {selectedTier.contactSales ? (
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                Enterprise pricing requires a custom quote
              </span>
            ) : (
              <span>
                Selected:{' '}
                <strong className="text-white">
                  TruClaw {selectedTier.name}
                </strong>{' '}
                ·{' '}
                {billingCycle === 'annual' ? (
                  <span className="text-cyan-400">
                    ${Math.round(selectedTier.monthlyPrice! * (1 - selectedTier.annualDiscount)).toLocaleString()}/mo (annual)
                  </span>
                ) : (
                  <span>${selectedTier.monthlyPrice!.toLocaleString()}/mo</span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              className="border-white/15 text-slate-300 hover:bg-white/5"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
              onClick={handleProceed}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending
                ? 'Opening checkout…'
                : selectedTier.contactSales
                ? 'Contact Sales'
                : 'Proceed to Checkout'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
