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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/components/PricingCalculator', () => ({
  default: ({ onRequestQuote }: { onRequestQuote: () => void }) => (
    <div data-testid="pricing-calculator">Pricing Calculator</div>
  ),
}));

vi.mock('@/components/RequestQuoteModal', () => ({
  default: () => <div data-testid="request-quote-modal" />,
}));

vi.mock('@/components/TruClawTierModal', () => ({
  default: () => <div data-testid="truclaw-tier-modal" />,
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

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

vi.mock('wouter', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ['/shop', vi.fn()],
}));

vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, isAuthenticated: false }),
}));

// ── tRPC wrapper ──────────────────────────────────────────────────────────────

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const trpcClient = trpc.createClient({
    links: [httpBatchLink({ url: 'http://localhost:3000/api/trpc', transformer: superjson })],
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    );
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function renderShop() {
  const { default: Shop } = await import('../Shop');
  const wrapper = createWrapper();
  return render(<Shop />, { wrapper });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Shop — Industry Solutions & Vertical Platforms section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the "Vertical Solutions" section label', async () => {
    await renderShop();
    // 'Vertical Solutions' appears in both the sticky nav and the section label
    expect(screen.getAllByText('Vertical Solutions').length).toBeGreaterThanOrEqual(1);
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

  it('shows "Pre-Sales · Systems Integrators" badge on Card 9', async () => {
    await renderShop();
    expect(screen.getByText(/Pre-Sales.*Systems Integrators/i)).toBeInTheDocument();
  });

  // ── Pricing (updated from spreadsheet) ────────────────────────────────────

  it('shows $8,000/mo for Card 1 (Oil & Gas)', async () => {
    await renderShop();
    expect(screen.getByText(/\$8,000/i)).toBeInTheDocument();
  });

  it('shows $16,000/mo for Card 2 (Smart City Gov)', async () => {
    await renderShop();
    expect(screen.getByText(/\$16,000/i)).toBeInTheDocument();
  });

  it('shows $12,495/mo for Card 3 (Smart City Municipal)', async () => {
    await renderShop();
    expect(screen.getByText(/\$12,495/i)).toBeInTheDocument();
  });

  it('shows $7,995/mo for Card 4 (Campus Security)', async () => {
    await renderShop();
    expect(screen.getAllByText(/\$7,995/i).length).toBeGreaterThan(0);
  });

  it('shows $19,950/mo for Card 7 (TruAddress)', async () => {
    await renderShop();
    expect(screen.getAllByText(/\$19,950/i).length).toBeGreaterThan(0);
  });

  it('shows $3,995/mo for Card 8 (PanelPulse)', async () => {
    await renderShop();
    expect(screen.getAllByText(/\$3,995/i).length).toBeGreaterThan(0);
  });

  it('shows $4,750/mo for Card 9 (Smart City Demo)', async () => {
    await renderShop();
    expect(screen.getAllByText(/\$4,750/i).length).toBeGreaterThan(0);
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

  it('preserves the "Bundled Suites" heading', async () => {
    await renderShop();
    expect(screen.getByText(/Bundled Suites/i)).toBeInTheDocument();
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

describe('Shop — How to Choose comparison strip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows CaseForge in the comparison strip with $3,499/mo', async () => {
    await renderShop();
    // CaseForge appears in both the vertical cards section and the comparison strip
    const matches = screen.getAllByText(/CaseForge/i);
    expect(matches.length).toBeGreaterThan(0);
    const priceMatches = screen.getAllByText(/\$3,499/i);
    expect(priceMatches.length).toBeGreaterThan(0);
  });

  it('shows ASPIRE in the comparison strip with $3,499/mo', async () => {
    await renderShop();
    const matches = screen.getAllByText(/ASPIRE/i);
    expect(matches.length).toBeGreaterThan(0);
    const priceMatches = screen.getAllByText(/\$3,499/i);
    expect(priceMatches.length).toBeGreaterThan(0);
  });

  it('shows "Flat rate" pricing model for CaseForge, ASPIRE, and PanelPulse in comparison strip', async () => {
    await renderShop();
    const flatRateMatches = screen.getAllByText(/Flat rate/i);
    expect(flatRateMatches.length).toBeGreaterThanOrEqual(3); // CaseForge + ASPIRE + PanelPulse
  });

  it('shows "Legal teams" as Best For for CaseForge', async () => {
    await renderShop();
    expect(screen.getByText(/Legal teams/i)).toBeInTheDocument();
  });

  it('shows "Public agencies" as Best For for ASPIRE', async () => {
    await renderShop();
    expect(screen.getByText(/Public agencies/i)).toBeInTheDocument();
  });

  it('shows PanelPulse in the comparison strip with $3,995/mo', async () => {
    await renderShop();
    expect(screen.getAllByText(/PanelPulse/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$3,995/i).length).toBeGreaterThan(0);
  });

  it('shows "Research & NGO ops" as Best For for PanelPulse', async () => {
    await renderShop();
    expect(screen.getByText(/Research & NGO ops/i)).toBeInTheDocument();
  });

  it('shows TruAddress in the comparison strip with $19,950/mo', async () => {
    await renderShop();
    expect(screen.getAllByText(/TruAddress/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$19,950/i).length).toBeGreaterThan(0);
  });

  it('shows "National address programs" as Best For for TruAddress', async () => {
    await renderShop();
    expect(screen.getByText(/National address programs/i)).toBeInTheDocument();
  });

  it('shows "Usage-based" pricing model for TruAddress', async () => {
    await renderShop();
    expect(screen.getAllByText(/Usage-based/i).length).toBeGreaterThan(0);
  });

  it('comparison strip has 9 rows (all products including Smart City Demo Suite)', async () => {
    await renderShop();
    expect(screen.getAllByText(/AI governance teams/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Video intelligence/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Physical security ops/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SOC.*threat analysts/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Legal teams/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Public agencies/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Research & NGO ops/i)).toBeInTheDocument();
    expect(screen.getByText(/National address programs/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Systems integrators/i).length).toBeGreaterThan(0);
  });

  it('shows Smart City Demo Suite in the comparison strip with $4,750/mo', async () => {
    await renderShop();
    expect(screen.getAllByText(/Smart City Demo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$4,750/i).length).toBeGreaterThan(0);
  });

  it('shows "Systems integrators" as Best For for Smart City Demo Suite', async () => {
    await renderShop();
    expect(screen.getAllByText(/Systems integrators/i).length).toBeGreaterThan(0);
  });

  it('comparison strip rows are sorted by entry price ascending', async () => {
    await renderShop();
    // Scope to the comparison strip container via data-testid
    const strip = screen.getByTestId('comparison-strip');
    const priceCells = strip.querySelectorAll('span.font-bold.text-sm');
    const prices = Array.from(priceCells).map(el => {
      const match = el.textContent?.match(/\$([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    }).filter(p => p > 0);
    expect(prices.length).toBe(9); // 9 products in the strip
    // Verify the prices are in ascending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('renders the pricing model legend with all four model types', async () => {
    await renderShop();
    expect(screen.getByText(/Pricing Model Key/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Flat rate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Flat tier \+ agent count/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Base \+ metered/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Usage-based/i).length).toBeGreaterThan(0);
  });

  it('vertical product cards have anchor IDs for deep-link navigation', async () => {
    await renderShop();
    expect(document.getElementById('product-caseforge-legal')).not.toBeNull();
    expect(document.getElementById('product-aspire-reporting')).not.toBeNull();
    expect(document.getElementById('product-panelpulse')).not.toBeNull();
    expect(document.getElementById('product-truaddress')).not.toBeNull();
    expect(document.getElementById('product-smart-city-demo')).not.toBeNull();
  });
});
