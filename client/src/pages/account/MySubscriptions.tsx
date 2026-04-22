/**
 * MySubscriptions.tsx
 *
 * /account/subscriptions — Authenticated page showing all active Tyvanto
 * subscriptions for the current user, with Stripe Customer Portal link
 * for managing / cancelling subscriptions.
 */

import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  CreditCard,
  Calendar,
  Zap,
} from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { toast } from 'sonner';

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status, cancelAtPeriodEnd }: { status: string; cancelAtPeriodEnd: boolean }) {
  if (cancelAtPeriodEnd) {
    return (
      <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
        <Clock className="h-3 w-3 mr-1" />
        Cancels at period end
      </Badge>
    );
  }
  if (status === 'active') {
    return (
      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  }
  if (status === 'trialing') {
    return (
      <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
        <Zap className="h-3 w-3 mr-1" />
        Trial
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-slate-500/50 text-slate-400 bg-slate-500/10">
      <AlertCircle className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  );
}

// ─── Billing cycle badge ──────────────────────────────────────────────────────

function BillingBadge({ cycle }: { cycle: string }) {
  return cycle === 'annual' ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
      Annual · 15–20% off
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-white/10">
      Monthly
    </span>
  );
}

// ─── Customer Portal mutation ─────────────────────────────────────────────────

function useCustomerPortal() {
  return trpc.shopCheckout.createCustomerPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
        toast.info('Opening Stripe Customer Portal…', {
          description: 'Manage your billing, payment methods, and subscriptions in a new tab.',
        });
      }
    },
    onError: (err) => {
      toast.error('Could not open portal', { description: err.message });
    },
  });
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MySubscriptions() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data: subscriptions, isLoading, error, refetch } = trpc.shopCheckout.getMySubscriptions.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const portalMutation = useCustomerPortal();

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div
      className="min-h-screen py-16"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a1f 40%, #050510 100%)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: 'rgba(0,229,255,0.12)', color: '#00E5FF' }}
            >
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Subscriptions</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {user?.name ? `Signed in as ${user.name}` : 'Manage your active Tyvanto subscriptions'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Error state ── */}
        {!isLoading && !authLoading && error && (
          <div
            className="rounded-2xl border border-red-500/20 p-8 text-center"
            style={{ background: 'rgba(239,68,68,0.05)' }}
          >
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-white font-semibold mb-2">Failed to load subscriptions</h2>
            <p className="text-slate-400 text-sm mb-5">{error.message}</p>
            <Button
              variant="outline"
              className="border-white/15 text-slate-300 hover:bg-white/5"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        )}

        {/* ── Loading state ── */}
        {(authLoading || isLoading) && (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading your subscriptions…</span>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !authLoading && subscriptions?.length === 0 && (
          <div
            className="rounded-2xl border border-white/10 p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(0,229,255,0.1)' }}
            >
              <ShoppingBag className="h-8 w-8" style={{ color: '#00E5FF' }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No active subscriptions</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              You don't have any active Tyvanto subscriptions yet. Explore our products and get started today.
            </p>
            <Link href="/shop">
              <Button
                className="font-bold text-black"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
              >
                Browse Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* ── Subscription cards ── */}
        {!isLoading && !authLoading && subscriptions && subscriptions.length > 0 && (
          <div className="space-y-5">
            {/* Summary bar */}
            <div
              className="flex items-center justify-between rounded-xl border border-white/10 px-5 py-3"
              style={{ background: 'rgba(0,229,255,0.05)' }}
            >
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>
                  <strong className="text-white">{subscriptions.length}</strong> active{' '}
                  {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 text-slate-300 hover:bg-white/5 text-xs"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Manage Billing
              </Button>
            </div>

            {/* Individual subscription cards */}
            {subscriptions.map((sub) => (
              <Card
                key={sub.id}
                className="border-white/10 hover:border-white/20 transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-white text-lg">{sub.productName}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <StatusBadge status={sub.status} cancelAtPeriodEnd={sub.cancelAtPeriodEnd} />
                        <BillingBadge cycle={sub.billingCycle} />
                      </CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Subscription ID</p>
                      <p className="text-xs text-slate-400 font-mono">{sub.id.slice(0, 20)}…</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {sub.cancelAtPeriodEnd ? 'Access ends' : 'Renews'}{' '}
                        <strong className="text-slate-200">
                          {format(new Date(sub.currentPeriodEnd), 'MMMM d, yyyy')}
                        </strong>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/15 text-slate-300 hover:bg-white/5 text-xs"
                      onClick={() => portalMutation.mutate()}
                      disabled={portalMutation.isPending}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      {sub.cancelAtPeriodEnd ? 'Reactivate' : 'Manage'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Stripe Customer Portal CTA */}
            <div
              className="rounded-2xl border border-white/8 p-6 mt-4"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF' }}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Billing & Payment Management</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Update your payment method, download invoices, change billing details, or cancel
                    subscriptions through the secure Stripe Customer Portal.
                  </p>
                  <Button
                    className="font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                    onClick={() => portalMutation.mutate()}
                    disabled={portalMutation.isPending}
                  >
                    {portalMutation.isPending ? 'Opening portal…' : 'Open Customer Portal'}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add more products CTA */}
            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm mb-3">Looking to add more products to your stack?</p>
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-white/15 text-slate-300 hover:bg-white/5"
                >
                  Browse All Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
