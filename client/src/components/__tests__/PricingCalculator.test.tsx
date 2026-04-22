/**
 * PricingCalculator.test.tsx
 * Tests for the pricing calculator component.
 * All pricing values sourced from Visium_Pricing_Formulas-01.xlsx (Apr 2026).
 *
 * Arqen:   $7,995/mo base · $0.40/node (10K–100K) · $0.25/node (100K+) · $450/agent
 * TruClaw:     $1,299/mo Starter (≤10) · $6,995/mo Standard (11–50) · Enterprise (50+)
 * Tru-InSight: $7,499/mo base · $2.00/camera
 * ELI:         $9,499/mo base · $4.00/node above 500
 * Full Suite:  $14,995/mo base · $3.00/node · $120/agent (10 included)
 * Oil & Gas:   $8,000/mo base · $2.00/endpoint above 500
 * Smart City Gov: $16,000/mo base · $2.00/node above 1,000
 * Smart City Muni: $12,495/mo base · $2.00/device above 500
 * Campus Security: $7,995/mo base · $2.00/camera above 100
 * CaseForge:   $3,499/mo flat
 * ASPIRE:      $3,499/mo flat
 * TruAddress:  $19,950/mo base · $0.20/1K records above 100K
 * PanelPulse:  $3,995/mo flat
 * Smart City Demo: $4,750/mo flat
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PricingCalculator from '../PricingCalculator';

// Mock CompetitorComparisonOverlay to avoid deep rendering
vi.mock('../CompetitorComparisonOverlay', () => ({
  default: () => <div data-testid="competitor-overlay" />,
}));

const mockOnRequestQuote = vi.fn();

function renderCalculator() {
  return render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
}

// ─── Render smoke tests ───────────────────────────────────────────────────────

describe('PricingCalculator — Render', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the section header', () => {
    renderCalculator();
    expect(screen.getByText(/LIVE PRICING ESTIMATOR/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimate Your Monthly Investment/i)).toBeInTheDocument();
  });

  it('shows all 5 core product buttons', () => {
    renderCalculator();
    expect(screen.getAllByText(/Arqen/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TruClaw/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tru-InSight/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^ELI$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Full Suite/i).length).toBeGreaterThan(0);
  });

  it('shows all 9 vertical product buttons', () => {
    renderCalculator();
    expect(screen.getAllByText(/Oil & Gas/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Smart City Gov/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Smart City Muni/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Campus Security/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CaseForge Legal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ASPIRE Reporting/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TruAddress/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PanelPulse/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Smart City Demo/i).length).toBeGreaterThan(0);
  });

  it('shows "Core Platforms" and "Vertical Solutions" group labels', () => {
    renderCalculator();
    expect(screen.getByText(/Core Platforms/i)).toBeInTheDocument();
    expect(screen.getByText(/Vertical Solutions/i)).toBeInTheDocument();
  });

  it('shows the CTA button', () => {
    renderCalculator();
    expect(screen.getAllByText(/Get Custom Quote/i).length).toBeGreaterThan(0);
  });

  it('shows Compare vs. Competitors button', () => {
    renderCalculator();
    expect(screen.getByText(/Compare vs\. Competitors/i)).toBeInTheDocument();
  });

  it('shows fine print about indicative estimates', () => {
    renderCalculator();
    expect(screen.getByText(/Estimates are indicative only/i)).toBeInTheDocument();
  });
});

// ─── Arqen pricing (spreadsheet Apr 2026) ────────────────────────────────

describe('Arqen pricing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('defaults to Arqen and shows $7,995/mo in info text', () => {
    renderCalculator();
    expect(screen.getByText(/\$7,995\/mo/i)).toBeInTheDocument();
  });

  it('shows $0.40/node (10K–100K) rate in info text', () => {
    renderCalculator();
    expect(screen.getByText(/\$0\.40\/node \(10K–100K\)/i)).toBeInTheDocument();
  });

  it('shows $0.25/node (100K+) rate in info text', () => {
    renderCalculator();
    expect(screen.getByText(/\$0\.25\/node \(100K\+\)/i)).toBeInTheDocument();
  });

  it('shows $450/agent rate in info text', () => {
    renderCalculator();
    expect(screen.getByText(/\$450\/agent/i)).toBeInTheDocument();
  });

  it('shows node slider for Arqen', () => {
    renderCalculator();
    const sliders = document.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBeGreaterThanOrEqual(1);
  });

  it('clicking Get Custom Quote calls onRequestQuote with arqen', () => {
    renderCalculator();
    const btn = screen.getAllByText(/Get Custom Quote/i)[0];
    act(() => fireEvent.click(btn));
    expect(mockOnRequestQuote).toHaveBeenCalledWith(
      expect.objectContaining({ productInterest: 'arqen' })
    );
  });
});

// ─── TruClaw pricing ──────────────────────────────────────────────────────────

describe('TruClaw pricing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('switching to TruClaw shows Starter $1,299/mo info', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruClaw/i)[0]));
    expect(screen.getByText(/\$1,299\/mo Starter/i)).toBeInTheDocument();
  });

  it('TruClaw info shows Standard $6,995/mo for 11–50 agents', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruClaw/i)[0]));
    expect(screen.getByText(/\$6,995\/mo Standard \(11–50 agents/i)).toBeInTheDocument();
  });

  it('shows Starter, Standard, Enterprise tier cards', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruClaw/i)[0]));
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('TruClaw at 60 agents shows Contact Sales', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruClaw/i)[0]));
    const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
    act(() => fireEvent.change(slider, { target: { value: '60' } }));
    expect(screen.getAllByText(/Contact Sales/i).length).toBeGreaterThan(0);
  });

  it('shows Request Enterprise Quote CTA when Contact Sales is triggered', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruClaw/i)[0]));
    // TruClaw renders a readOnly display slider + an interactive slider; use the last one
    const sliders = document.querySelectorAll('input[type="range"]');
    const interactiveSlider = sliders[sliders.length - 1] as HTMLInputElement;
    act(() => fireEvent.change(interactiveSlider, { target: { value: '60' } }));
    expect(screen.getAllByText(/Request Enterprise Quote/i).length).toBeGreaterThan(0);
  });
});

// ─── Tru-InSight pricing ──────────────────────────────────────────────────────

describe('Tru-InSight pricing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows $7,499/mo base platform in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Tru-InSight/i)[0]));
    expect(screen.getByText(/\$7,499\/mo base platform/i)).toBeInTheDocument();
  });

  it('shows $2.00/camera metered inference rate in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Tru-InSight/i)[0]));
    expect(screen.getByText(/\$2\.00\/camera metered inference/i)).toBeInTheDocument();
  });
});

// ─── ELI pricing ─────────────────────────────────────────────────────────────

describe('ELI pricing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows $9,499/mo regional base in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/^ELI$/i)[0]));
    expect(screen.getByText(/\$9,499\/mo regional base/i)).toBeInTheDocument();
  });

  it('shows $4.00/node above 500 in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/^ELI$/i)[0]));
    expect(screen.getByText(/\$4\.00\/node above 500/i)).toBeInTheDocument();
  });
});

// ─── Full Suite Bundle pricing ────────────────────────────────────────────────

describe('Full Suite Bundle pricing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows $14,995/mo base with 10% bundle discount in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Full Suite/i)[0]));
    expect(screen.getByText(/\$14,995\/mo \(all 4 platforms, 10% bundle discount\)/i)).toBeInTheDocument();
  });

  it('shows $3.00/node above 20K in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Full Suite/i)[0]));
    expect(screen.getByText(/\$3\.00\/node above 20K/i)).toBeInTheDocument();
  });

  it('shows $120/agent (10 included) in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Full Suite/i)[0]));
    expect(screen.getByText(/\$120\/agent \(10 included\)/i)).toBeInTheDocument();
  });
});

// ─── Flat-rate vertical products ─────────────────────────────────────────────

describe('Flat-rate vertical products', () => {
  beforeEach(() => vi.clearAllMocks());

  it('CaseForge shows $3,499/mo flat rate', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/CaseForge Legal/i)[0]));
    expect(screen.getByText(/\$3,499\/mo flat rate/i)).toBeInTheDocument();
  });

  it('ASPIRE shows $3,499/mo flat rate', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/ASPIRE Reporting/i)[0]));
    expect(screen.getByText(/\$3,499\/mo flat rate/i)).toBeInTheDocument();
  });

  it('PanelPulse shows $3,995/mo flat rate', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/PanelPulse/i)[0]));
    expect(screen.getByText(/\$3,995\/mo flat rate/i)).toBeInTheDocument();
  });

  it('Smart City Demo shows $4,750/mo flat rate', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Smart City Demo/i)[0]));
    expect(screen.getByText(/\$4,750\/mo flat rate/i)).toBeInTheDocument();
  });

  it('flat-rate products show the flat-rate info panel', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/CaseForge Legal/i)[0]));
    expect(screen.getByText(/Flat-rate product/i)).toBeInTheDocument();
  });

  it('flat-rate products do not show node sliders', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Smart City Demo/i)[0]));
    const sliders = document.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBe(0);
  });
});

// ─── Usage-based vertical products ───────────────────────────────────────────

describe('Usage-based vertical products', () => {
  beforeEach(() => vi.clearAllMocks());

  it('Oil & Gas shows $8,000/mo base in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Oil & Gas/i)[0]));
    expect(screen.getByText(/\$8,000\/mo base/i)).toBeInTheDocument();
  });

  it('Oil & Gas shows $2.00/endpoint above 500 in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Oil & Gas/i)[0]));
    expect(screen.getByText(/\$2\.00\/endpoint above 500/i)).toBeInTheDocument();
  });

  it('Smart City Gov shows $16,000/mo base in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Smart City Gov/i)[0]));
    expect(screen.getByText(/\$16,000\/mo base/i)).toBeInTheDocument();
  });

  it('Smart City Gov shows $2.00/node above 1,000 in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Smart City Gov/i)[0]));
    expect(screen.getByText(/\$2\.00\/node above 1,000/i)).toBeInTheDocument();
  });

  it('Smart City Muni shows $12,495/mo base in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Smart City Muni/i)[0]));
    expect(screen.getByText(/\$12,495\/mo base/i)).toBeInTheDocument();
  });

  it('Campus Security shows $7,995/mo base in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Campus Security/i)[0]));
    expect(screen.getByText(/\$7,995\/mo base/i)).toBeInTheDocument();
  });

  it('Campus Security shows $2.00/camera above 100 in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Campus Security/i)[0]));
    expect(screen.getByText(/\$2\.00\/camera above 100/i)).toBeInTheDocument();
  });

  it('TruAddress shows $19,950/mo base in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruAddress/i)[0]));
    expect(screen.getByText(/\$19,950\/mo base/i)).toBeInTheDocument();
  });

  it('TruAddress shows $0.20/1K records above 100K in info text', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/TruAddress/i)[0]));
    expect(screen.getByText(/\$0\.20\/1K records above 100K/i)).toBeInTheDocument();
  });
});

// ─── Billing toggle ───────────────────────────────────────────────────────────

describe('Annual/Monthly Billing Toggle', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders Monthly and Annual toggle buttons', () => {
    renderCalculator();
    expect(screen.getByRole('button', { name: /Monthly/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annual/i })).toBeInTheDocument();
  });

  it('defaults to Monthly — shows "Estimated Monthly Cost"', () => {
    renderCalculator();
    // Multiple elements may match; verify at least one is present
    expect(screen.getAllByText(/Estimated Monthly Cost/i).length).toBeGreaterThan(0);
  });

  it('Annual toggle shows Save 10% badge', () => {
    renderCalculator();
    expect(screen.getAllByText(/Save 10%/i).length).toBeGreaterThan(0);
  });

  it('switching to Annual changes label to "Estimated Annual Cost"', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    expect(screen.getByText(/Estimated Annual Cost/i)).toBeInTheDocument();
  });

  it('switching to Annual shows savings banner', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    expect(screen.getByText(/Annual billing saves you/i)).toBeInTheDocument();
  });

  it('switching to Annual shows "per month, billed annually" label', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    expect(screen.getByText(/per month, billed annually/i)).toBeInTheDocument();
  });

  it('switching back to Monthly hides savings banner', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    act(() => fireEvent.click(screen.getByRole('button', { name: /Monthly/i })));
    expect(screen.queryByText(/Annual billing saves you/i)).not.toBeInTheDocument();
  });

  it('onRequestQuote called with billingCycle: "monthly" by default', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/Get Custom Quote/i)[0]));
    expect(mockOnRequestQuote).toHaveBeenCalledWith(
      expect.objectContaining({ billingCycle: 'monthly' })
    );
  });

  it('onRequestQuote called with billingCycle: "annual" after switching', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    act(() => fireEvent.click(screen.getAllByText(/Get Custom Quote/i)[0]));
    expect(mockOnRequestQuote).toHaveBeenCalledWith(
      expect.objectContaining({ billingCycle: 'annual' })
    );
  });

  it('annual billing applies to flat-rate vertical products', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getAllByText(/CaseForge Legal/i)[0]));
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    expect(screen.getByText(/Annual billing saves you/i)).toBeInTheDocument();
  });

  it('breakdown shows "Annual total (billed once)" when annual is selected', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Annual/i })));
    act(() => fireEvent.click(screen.getByText(/Show cost breakdown/i)));
    expect(screen.getByText(/Annual total \(billed once\)/i)).toBeInTheDocument();
  });
});

// ─── Cost breakdown ───────────────────────────────────────────────────────────

describe('Cost breakdown', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows breakdown toggle button', () => {
    renderCalculator();
    expect(screen.getByText(/Show cost breakdown/i)).toBeInTheDocument();
  });

  it('expands breakdown when clicked', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByText(/Show cost breakdown/i)));
    expect(screen.getByText(/Hide cost breakdown/i)).toBeInTheDocument();
    expect(screen.getByText('Base fee')).toBeInTheDocument();
  });

  it('shows base fee label in breakdown for Arqen', () => {
    renderCalculator();
    act(() => fireEvent.click(screen.getByText(/Show cost breakdown/i)));
    expect(screen.getByText(/First 10,000 nodes included/i)).toBeInTheDocument();
  });
});
