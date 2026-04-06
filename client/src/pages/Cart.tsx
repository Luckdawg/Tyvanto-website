/**
 * Cart.tsx — Enterprise dark-theme shopping cart
 * - Matches the Shop page aesthetic (deep navy/black + cyan accents)
 * - Quantity controls with +/- buttons
 * - Persistent via CartContext (localStorage)
 * - Stripe Checkout via tRPC ecommerce.createCheckoutSession
 * - Requires customerEmail + customerName before checkout
 */

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Tag,
  Loader2,
  Package,
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents);
}

// ─── Empty Cart ───────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a1a 100%)' }}
    >
      <div
        className="rounded-3xl border border-white/10 p-12 text-center max-w-md w-full"
        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}
        >
          <ShoppingCart className="h-10 w-10" style={{ color: '#00E5FF' }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Your Cart is Empty</h1>
        <p className="text-slate-400 mb-8">
          Browse our enterprise cybersecurity and AI governance platforms to get started.
        </p>
        <Link href="/shop">
          <Button
            size="lg"
            className="w-full font-semibold text-black"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
          >
            <Package className="h-5 w-5 mr-2" />
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Cart() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [formError, setFormError] = useState('');

  const checkoutMutation = trpc.ecommerce.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        clearCart();
        window.open(data.url, '_blank');
        toast.success('Redirecting to secure checkout…', {
          description: 'A new tab has opened with Stripe Checkout.',
        });
      } else {
        toast.error('Could not create checkout session. Please try again.');
      }
    },
    onError: (err) => {
      toast.error('Checkout failed', { description: err.message });
    },
  });

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const handleCheckout = () => {
    setFormError('');
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    checkoutMutation.mutate({
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      customerEmail: customerEmail.trim(),
      customerName: customerName.trim(),
    });
  };

  const total = cartTotal;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0a1a 100%)' }}
    >
      {/* ── Header ── */}
      <section
        className="py-12 px-4 border-b border-white/10"
        style={{ background: 'rgba(0,229,255,0.04)' }}
      >
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/shop">
              <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
              </button>
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,128,255,0.1))' }}
              >
                <ShoppingCart className="h-5 w-5" style={{ color: '#00E5FF' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Cart</h1>
                <p className="text-slate-400 text-sm">
                  {items.length} {items.length === 1 ? 'item' : 'items'} · Monthly subscription
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Cart Items (left 2/3) ── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,128,255,0.08))' }}
                  >
                    <Package className="h-7 w-7" style={{ color: '#00E5FF' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {formatPrice(item.price)}/mo · Monthly subscription
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors disabled:opacity-40"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-white font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[90px]">
                    <p className="text-white font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-slate-500 text-xs">per month</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Promo code hint */}
              <div
                className="rounded-xl border border-white/8 p-4 flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <Tag className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <p className="text-slate-500 text-sm">
                  Promo codes can be applied on the Stripe Checkout page.
                </p>
              </div>

              {/* Clear cart */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-slate-500 hover:text-red-400 transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear cart
                </button>
              </div>
            </div>

            {/* ── Order Summary (right 1/3) ── */}
            <div className="space-y-4">
              {/* Summary card */}
              <div
                className="rounded-2xl border border-white/10 p-6 sticky top-6"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}
              >
                <h2 className="text-white font-bold text-lg mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-slate-400 truncate mr-2">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="text-white font-medium flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 mb-5">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-medium">Monthly Total</span>
                    <span className="font-bold text-lg" style={{ color: '#00E5FF' }}>
                      {formatPrice(total)}/mo
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Billed monthly. Annual billing saves 15–20%.
                  </p>
                </div>

                {/* Customer info form */}
                <div className="space-y-3 mb-5">
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">
                    Checkout Details
                  </p>
                  <div>
                    <Label htmlFor="cart-name" className="text-slate-300 text-sm mb-1 block">
                      Full Name *
                    </Label>
                    <Input
                      id="cart-name"
                      type="text"
                      placeholder="Jane Smith"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cart-email" className="text-slate-300 text-sm mb-1 block">
                      Work Email *
                    </Label>
                    <Input
                      id="cart-email"
                      type="email"
                      placeholder="jane@company.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-600 focus:border-cyan-500/50"
                    />
                  </div>
                  {formError && (
                    <p className="text-red-400 text-xs">{formError}</p>
                  )}
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending}
                  className="w-full font-bold text-black py-3"
                  style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Checkout…
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <ShieldCheck className="h-4 w-4 text-slate-500" />
                  <p className="text-slate-500 text-xs">
                    Secured by Stripe · 256-bit TLS encryption
                  </p>
                </div>
              </div>

              {/* Test card hint */}
              <div
                className="rounded-xl border border-cyan-500/20 p-4"
                style={{ background: 'rgba(0,229,255,0.04)' }}
              >
                <p className="text-cyan-400 text-xs font-semibold mb-1">Test Mode Active</p>
                <p className="text-slate-500 text-xs">
                  Use card <span className="font-mono text-slate-300">4242 4242 4242 4242</span>,
                  any future expiry, and any 3-digit CVC to test checkout.
                </p>
              </div>

              {/* Continue shopping */}
              <Link href="/shop">
                <button className="w-full text-center text-sm text-slate-500 hover:text-cyan-400 transition-colors py-2">
                  ← Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
