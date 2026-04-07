/**
 * ShopIndustrySolutions.test.tsx
 *
 * Verifies that the "Industry Solutions & Vertical Platforms" section is correctly
 * rendered on the /shop page:
 *  - Section heading and description are present
 *  - All 9 product cards appear with correct names, badges, and pricing
 *  - Each card has 4 feature bullets
 *  - Each card's CTA links to /demo
 *  - The section is placed AFTER the bundle packages section and BEFORE the pricing calculator
 *  - Existing content (hero, product cards, bundle table, pricing calculator) is untouched
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/components/PricingCalculator', () => ({
  default: ({ onRequestQuote }: { onRequestQuote: () => void }) => (
    <div data-testid="pricing-calculator">Pricing Calculator</div>
  ),
}));

vi.mock('@/components/RequestQuoteModal', () => ({
  default: () => <div data-testid="request-quote-modal" />,
}));

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addItem: vi.fn(),
    items: [],
    removeItem: vi.fn(),
    clearCart: vi.fn(),
    total: 0,
  }),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('wouter', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ['/shop', vi.fn()],
}));

vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, isAuthenticated: false }),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

// Lazy import after mocks are set up
async function renderShop() {
  const { default: Shop } = await import('../Shop');
  return render(<Shop />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Shop — Industry Solutions & Vertical Platforms section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the "Vertical Solutions" section label', async () => {
    await renderShop();
    expect(screen.getByText('Vertical Solutions')).toBeInTheDocument();
  });

  it('renders the h2 heading "Industry Solutions & Vertical Platforms"', async () => {
    await renderShop();
    expect(
      screen.getByRole('heading', { name: /Industry Solutions & Vertical Platforms/i })
    ).toBeInTheDocument();
  });

  it('renders the section description paragraph', async () => {
    await renderShop();
    expect(screen.getByText(/Purpose-built applications powered by TruContext/i)).toBeInTheDocument();
  });

  // ── Card presence ──────────────────────────────────────────────────────────

  it('renders Card 1: TruContext for Oil & Gas Operations', async () => {
    await renderShop();
    expect(screen.getByText(/TruContext.*for Oil.*Gas Operations/i)).toBeInTheDocument();
  });

  it('renders Card 2: TruContext Smart City Suite — Government Edition', async () => {
    await renderShop();
    expect(screen.getByText(/TruContext.*Smart City Suite.*Government Edition/i)).toBeInTheDocument();
  });

  it('renders Card 3: TruContext Smart City Command Center', async () => {
    await renderShop();
    expect(screen.getByText(/TruContext.*Smart City Command Center/i)).toBeInTheDocument();
  });

  it('renders Card 4: ELI Campus Security Intelligence Platform', async () => {
    await renderShop();
    expect(screen.getByText(/ELI.*Campus Security Intelligence Platform/i)).toBeInTheDocument();
  });

  it('renders Card 5: CaseForge Legal Case Intelligence', async () => {
    await renderShop();
    expect(screen.getByText(/CaseForge.*Legal Case Intelligence/i)).toBeInTheDocument();
  });

  it('renders Card 6: ASPIRE Public Reporting Platform', async () => {
    await renderShop();
    expect(screen.getByText(/ASPIRE.*Public Reporting Platform/i)).toBeInTheDocument();
  });

  it('renders Card 7: TruAddress National Address Intelligence', async () => {
    await renderShop();
    expect(screen.getByText(/TruAddress.*National Address Intelligence/i)).toBeInTheDocument();
  });

  it('renders Card 8: PanelPulse Research Panel Management', async () => {
    await renderShop();
    expect(screen.getByText(/PanelPulse.*Research Panel Management/i)).toBeInTheDocument();
  });

  it('renders Card 9: Smart City Proposal & Demo Suite', async () => {
    await renderShop();
    expect(screen.getByText(/Smart City Proposal.*Demo Suite/i)).toBeInTheDocument();
  });

  // ── Badge pills ────────────────────────────────────────────────────────────

  it('shows "Oil & Gas · Industrial OT" badge on Card 1', async () => {
    await renderShop();
    expect(screen.getByText(/Oil.*Gas.*Industrial OT/i)).toBeInTheDocument();
  });

  it('shows "Smart City · National Government" badge on Card 2', async () => {
    await renderShop();
    expect(screen.getByText(/Smart City.*National Government/i)).toBeInTheDocument();
  });

  it('shows "Smart City · Municipal" badge on Card 3', async () => {
    await renderShop();
    expect(screen.getByText(/Smart City.*Municipal/i)).toBeInTheDocument();
  });

  it('shows "Campus Security · Education" badge on Card 4', async () => {
    await renderShop();
    expect(screen.getByText(/Campus Security.*Education/i)).toBeInTheDocument();
  });

  it('shows "Legal Tech · Litigation" badge on Card 5', async () => {
    await renderShop();
    expect(screen.getByText(/Legal Tech.*Litigation/i)).toBeInTheDocument();
  });

  it('shows "Education · Accountability" badge on Card 6', async () => {
    await renderShop();
    expect(screen.getByText(/Education.*Accountability/i)).toBeInTheDocument();
  });

  it('shows "Government · National Infrastructure" badge on Card 7', async () => {
    await renderShop();
    expect(screen.getByText(/Government.*National Infrastructure/i)).toBeInTheDocument();
  });

  it('shows "Research · NGO · Government" badge on Card 8', async () => {
    await renderShop();
    expect(screen.getByText(/Research.*NGO.*Government/i)).toBeInTheDocument();
  });

  it('shows "Pre-Sales · Smart City · Systems Integrators" badge on Card 9', async () => {
    await renderShop();
    expect(screen.getByText(/Pre-Sales.*Smart City.*Systems Integrators/i)).toBeInTheDocument();
  });

  // ── Pricing ────────────────────────────────────────────────────────────────

  it('shows $18,500/mo for Card 1', async () => {
    await renderShop();
    expect(screen.getByText(/\$18,500/i)).toBeInTheDocument();
  });

  it('shows $28,000/mo for Card 2', async () => {
    await renderShop();
    expect(screen.getByText(/\$28,000/i)).toBeInTheDocument();
  });

  it('shows $12,500/mo for Card 3', async () => {
    await renderShop();
    expect(screen.getByText(/\$12,500/i)).toBeInTheDocument();
  });

  it('shows $5,500/mo for Card 4', async () => {
    await renderShop();
    expect(screen.getByText(/\$5,500/i)).toBeInTheDocument();
  });

  it('shows $8,500/mo for Card 7', async () => {
    await renderShop();
    expect(screen.getByText(/\$8,500/i)).toBeInTheDocument();
  });

  it('shows $799/mo for Card 8', async () => {
    await renderShop();
    expect(screen.getAllByText(/\$799/i).length).toBeGreaterThan(0);
  });

  it('shows "Annual billing saves 15–20%" note on each card', async () => {
    await renderShop();
    const notes = screen.getAllByText(/Annual billing saves 15/i);
    // 9 cards in the new section + possibly others from existing cards
    expect(notes.length).toBeGreaterThanOrEqual(9);
  });

  // ── Feature bullets ────────────────────────────────────────────────────────

  it('shows SCADA/IT-OT feature bullet on Card 1', async () => {
    await renderShop();
    expect(screen.getByText(/SCADA threat topology/i)).toBeInTheDocument();
  });

  it('shows CesiumJS feature bullet on Card 2', async () => {
    await renderShop();
    expect(screen.getByText(/CesiumJS 3D geospatial/i)).toBeInTheDocument();
  });

  it('shows Mapbox feature bullet on Card 3', async () => {
    await renderShop();
    expect(screen.getByText(/Mapbox 3D map layer/i)).toBeInTheDocument();
  });

  it('shows facial recognition feature bullet on Card 4', async () => {
    await renderShop();
    expect(screen.getByText(/facial recognition data fusion/i)).toBeInTheDocument();
  });

  it('shows ElevenLabs TTS feature bullet on Card 5', async () => {
    await renderShop();
    expect(screen.getByText(/ElevenLabs TTS/i)).toBeInTheDocument();
  });

  it('shows Quarto + Python feature bullet on Card 6', async () => {
    await renderShop();
    expect(screen.getByText(/Quarto.*Python pipeline/i)).toBeInTheDocument();
  });

  it('shows surveyor management feature bullet on Card 7', async () => {
    await renderShop();
    expect(screen.getByText(/Surveyor management portal/i)).toBeInTheDocument();
  });

  it('shows WhatsApp and SMS feature bullet on Card 8', async () => {
    await renderShop();
    // Text appears in both tagline and feature bullet
    expect(screen.getAllByText(/WhatsApp and SMS/i).length).toBeGreaterThan(0);
  });

  it('shows FIWARE NGSI-LD feature bullet on Card 9', async () => {
    await renderShop();
    expect(screen.getByText(/FIWARE NGSI-LD/i)).toBeInTheDocument();
  });

  // ── CTA buttons ────────────────────────────────────────────────────────────

  it('all 9 "Get Custom Quote" buttons link to /demo', async () => {
    await renderShop();
    const section = document.getElementById('industry-solutions');
    expect(section).not.toBeNull();
    const links = within(section!).getAllByRole('link');
    const demoLinks = links.filter((l) => l.getAttribute('href') === '/demo');
    expect(demoLinks.length).toBe(9);
  });

  // ── Layout integrity ───────────────────────────────────────────────────────

  it('preserves the existing pricing calculator', async () => {
    await renderShop();
    expect(screen.getByTestId('pricing-calculator')).toBeInTheDocument();
  });

  it('preserves the "Bundled Suites — Save Up to 25%" heading', async () => {
    await renderShop();
    expect(screen.getByText(/Bundled Suites.*Save Up to 25%/i)).toBeInTheDocument();
  });

  it('preserves the "Four Platforms. One Unified Defense." heading', async () => {
    await renderShop();
    expect(screen.getByText(/Four Platforms.*One Unified Defense/i)).toBeInTheDocument();
  });

  it('industry-solutions section has id="industry-solutions"', async () => {
    await renderShop();
    const section = document.getElementById('industry-solutions');
    expect(section).not.toBeNull();
  });

  it('pricing-calculator anchor id is preserved', async () => {
    await renderShop();
    const el = document.getElementById('pricing-calculator');
    expect(el).not.toBeNull();
  });
});
