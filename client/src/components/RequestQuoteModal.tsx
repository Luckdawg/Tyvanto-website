/**
 * RequestQuoteModal.tsx
 *
 * A polished "Request a Quote" modal dialog that:
 * - Collects: name, company, email, phone (optional), product interest, use-case description,
 *   estimated agents/nodes, and timeline
 * - Accepts an optional pricingSnapshot from the live calculator to pre-fill context
 * - Submits via tRPC → notifyOwner so the site owner receives an instant notification
 * - Shows success/error states with animated feedback
 * - Matches the dark enterprise aesthetic of the Shop page
 */

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingSnapshot {
  productInterest?: string;
  estimatedNodes?: number;
  estimatedAgents?: number;
  estimatedMonthlyBudget?: string;
  billingCycle?: 'monthly' | 'annual';
}

interface RequestQuoteModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-select a product when opened from a specific product card */
  defaultProduct?: string;
  /** Pre-fill context from the pricing calculator */
  pricingSnapshot?: PricingSnapshot;
}

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  useCase: string;
  scale: string;
  timeline: string;
};

const PRODUCTS = [
  'TruContext Core Platform',
  'TruClaw Agentic AI Governance',
  'Tru-InSight Video Intelligence',
  'ELI Unified Surveillance Intelligence',
  'Complete Defense Suite (Bundle)',
  'Not sure — need guidance',
];

const TIMELINES = [
  'Immediately (within 30 days)',
  'Q2 2026 (1–3 months)',
  'Q3 2026 (3–6 months)',
  'Evaluating for 2027',
  'Just exploring options',
];

const SCALES = [
  '< 10 agents / < 1,000 nodes',
  '10–50 agents / 1K–10K nodes',
  '50–200 agents / 10K–100K nodes',
  '200+ agents / 100K+ nodes',
  'National / Critical Infrastructure scale',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RequestQuoteModal({
  open,
  onClose,
  defaultProduct = '',
  pricingSnapshot,
}: RequestQuoteModalProps) {
  const buildDefaultUseCase = () => {
    if (!pricingSnapshot) return '';
    const billingLabel = pricingSnapshot.billingCycle === 'annual' ? 'Annual (billed yearly)' : 'Monthly';
    return `From pricing calculator:
- Product: ${pricingSnapshot.productInterest ?? 'N/A'}
- Estimated nodes: ${(pricingSnapshot.estimatedNodes ?? 0).toLocaleString()}
- Estimated agents: ${pricingSnapshot.estimatedAgents ?? 0}
- Estimated budget: ${pricingSnapshot.estimatedMonthlyBudget ?? 'N/A'}
- Preferred billing: ${billingLabel}

Additional requirements: `;
  };

  const [form, setForm] = useState<FormState>({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: defaultProduct || (pricingSnapshot?.productInterest ?? ''),
    useCase: buildDefaultUseCase(),
    scale: '',
    timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const notifyMutation = trpc.system.notifyOwner.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError('');
    },
    onError: (err) => {
      setError(err.message || 'Something went wrong. Please try again.');
    },
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.company.trim() || !form.email.trim()) {
      setError('Please fill in your name, company, and email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const title = `New Quote Request — ${form.company} (${form.product || 'Product TBD'})`;
    const content = `
**New Quote Request Received**

| Field | Value |
|---|---|
| Name | ${form.name} |
| Company | ${form.company} |
| Email | ${form.email} |
| Phone | ${form.phone || 'Not provided'} |
| Product Interest | ${form.product || 'Not specified'} |
| Deployment Scale | ${form.scale || 'Not specified'} |
| Timeline | ${form.timeline || 'Not specified'} |

**Use Case / Requirements:**
${form.useCase || 'Not provided'}

---
*Submitted via the Visium Technologies Shop page quote form.*
    `.trim();

    notifyMutation.mutate({ title, content });
  };

  const handleClose = () => {
    if (notifyMutation.isPending) return;
    setSubmitted(false);
    setError('');
    setForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      product: defaultProduct,
      useCase: buildDefaultUseCase(),
      scale: '',
      timeline: '',
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #0a0a1f 0%, #050510 100%)',
            borderColor: 'rgba(0,229,255,0.3)',
            boxShadow: '0 0 60px rgba(0,229,255,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* ── Success State ── */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(0,229,255,0.15)' }}
              >
                <CheckCircle2 className="h-10 w-10" style={{ color: '#00E5FF' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Quote Request Sent!</h2>
              <p className="text-slate-300 max-w-md mb-2">
                Thank you, <strong className="text-white">{form.name}</strong>. Our team will
                review your requirements and reach out to{' '}
                <strong className="text-white">{form.email}</strong> within one business day.
              </p>
              <p className="text-slate-500 text-sm mb-8">
                For urgent inquiries, contact us directly at{' '}
                <a
                  href="mailto:sales@visiumtechnologies.com"
                  className="underline"
                  style={{ color: '#00E5FF' }}
                >
                  sales@visiumtechnologies.com
                </a>
              </p>
              <Button
                onClick={handleClose}
                className="text-black font-bold px-8"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
              >
                Close
              </Button>
            </div>
          ) : (
            /* ── Form State ── */
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.3)',
                    color: '#00E5FF',
                  }}
                >
                  Enterprise Sales
                </div>
                <h2
                  id="quote-modal-title"
                  className="text-2xl font-bold text-white mb-2"
                >
                  Request a Custom Quote
                </h2>
                <p className="text-slate-400 text-sm">
                  Tell us about your requirements and we'll prepare a tailored proposal within
                  one business day.
                </p>
                {/* Show pricing snapshot summary if available */}
                {pricingSnapshot && (
                  <div
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)' }}
                    >
                      📊 Calculator estimate: {pricingSnapshot.estimatedMonthlyBudget}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {(pricingSnapshot.estimatedNodes ?? 0).toLocaleString()} nodes · {pricingSnapshot.estimatedAgents ?? 0} agents
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Row 1: Name + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Full Name <span style={{ color: '#00E5FF' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Company <span style={{ color: '#00E5FF' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Work Email <span style={{ color: '#00E5FF' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Phone{' '}
                      <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    />
                  </div>
                </div>

                {/* Product interest */}
                <div className="mb-4">
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Product Interest
                  </label>
                  <div className="relative">
                    <select
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      className="w-full rounded-lg px-4 py-2.5 text-sm text-white appearance-none outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <option value="" style={{ background: '#0a0a1f' }}>
                        Select a product…
                      </option>
                      {PRODUCTS.map((p) => (
                        <option key={p} value={p} style={{ background: '#0a0a1f' }}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3: Scale + Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Deployment Scale
                    </label>
                    <div className="relative">
                      <select
                        name="scale"
                        value={form.scale}
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2.5 text-sm text-white appearance-none outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        <option value="" style={{ background: '#0a0a1f' }}>
                          Select scale…
                        </option>
                        {SCALES.map((s) => (
                          <option key={s} value={s} style={{ background: '#0a0a1f' }}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Procurement Timeline
                    </label>
                    <div className="relative">
                      <select
                        name="timeline"
                        value={form.timeline}
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2.5 text-sm text-white appearance-none outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        <option value="" style={{ background: '#0a0a1f' }}>
                          Select timeline…
                        </option>
                        {TIMELINES.map((t) => (
                          <option key={t} value={t} style={{ background: '#0a0a1f' }}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Use case */}
                <div className="mb-6">
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">
                    Use Case / Requirements{' '}
                    <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="useCase"
                    value={form.useCase}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your security environment, key challenges, or specific capabilities you're looking for…"
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={notifyMutation.isPending}
                    className="flex-1 text-black font-bold py-3"
                    style={{ background: 'linear-gradient(135deg, #00E5FF, #0080FF)' }}
                  >
                    {notifyMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Quote Request
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="border-white/20 text-slate-400 hover:text-white hover:bg-white/10"
                    disabled={notifyMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-slate-600 text-xs mt-4 text-center">
                  By submitting this form you agree to our{' '}
                  <a href="/privacy-policy" className="underline hover:text-slate-400">
                    Privacy Policy
                  </a>
                  . We'll never share your information with third parties.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
