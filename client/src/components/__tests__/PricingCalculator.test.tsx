/**
 * PricingCalculator.test.tsx
 * Tests for the aligned pricing tiers in PricingCalculator.
 * Verifies that calculator output matches Core Offerings card pricing exactly.
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

describe('PricingCalculator — Pricing Alignment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calculator section header', () => {
    renderCalculator();
    expect(screen.getByText(/LIVE PRICING CALCULATOR/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimate Your Monthly Investment/i)).toBeInTheDocument();
  });

  it('shows all 5 product options', () => {
    renderCalculator();
    expect(screen.getAllByText(/TruContext/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TruClaw/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tru-InSight/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ELI/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Full Suite/i).length).toBeGreaterThan(0);
  });

  it('defaults to TruContext and shows $9,999/mo in rate info', () => {
    renderCalculator();
    expect(screen.getByText(/\$9,999\/mo/i)).toBeInTheDocument();
  });

  it('TruContext info shows correct tier rates: $0.50/node (10K–100K) and $0.20/node (100K+)', () => {
    renderCalculator();
    expect(screen.getByText(/\$0\.50\/node \(10K–100K\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\$0\.20\/node \(100K\+\)/i)).toBeInTheDocument();
  });

  it('switching to TruClaw shows Starter $799/mo info', () => {
    renderCalculator();
    const truClawBtns = screen.getAllByText(/TruClaw/i);
    act(() => fireEvent.click(truClawBtns[0]));
    expect(screen.getByText(/\$799\/mo Starter/i)).toBeInTheDocument();
  });

  it('TruClaw info shows Standard $7,999/mo for 11–50 agents', () => {
    renderCalculator();
    const truClawBtns = screen.getAllByText(/TruClaw/i);
    act(() => fireEvent.click(truClawBtns[0]));
    expect(screen.getByText(/\$7,999\/mo Standard \(11–50 agents/i)).toBeInTheDocument();
  });

  it('switching to Tru-InSight shows $2,499/mo base info', () => {
    renderCalculator();
    const insightBtns = screen.getAllByText(/Tru-InSight/i);
    act(() => fireEvent.click(insightBtns[0]));
    expect(screen.getByText(/\$2,499\/mo base/i)).toBeInTheDocument();
  });

  it('Tru-InSight info shows $0.08/camera metered inference rate', () => {
    renderCalculator();
    const insightBtns = screen.getAllByText(/Tru-InSight/i);
    act(() => fireEvent.click(insightBtns[0]));
    expect(screen.getByText(/\$0\.08\/camera metered inference/i)).toBeInTheDocument();
  });

  it('switching to ELI shows $7,500/mo regional base info', () => {
    renderCalculator();
    const eliBtns = screen.getAllByText(/^ELI$/i);
    act(() => fireEvent.click(eliBtns[0]));
    expect(screen.getByText(/\$7,500\/mo regional base/i)).toBeInTheDocument();
  });

  it('ELI info shows $0.15/node above 500', () => {
    renderCalculator();
    const eliBtns = screen.getAllByText(/^ELI$/i);
    act(() => fireEvent.click(eliBtns[0]));
    expect(screen.getByText(/\$0\.15\/node above 500/i)).toBeInTheDocument();
  });

  it('Full Suite shows $14,999/mo base with 25% bundle discount info', () => {
    renderCalculator();
    const bundleBtns = screen.getAllByText(/Full Suite/i);
    act(() => fireEvent.click(bundleBtns[0]));
    expect(screen.getByText(/\$14,999\/mo \(all 4 platforms, 25% bundle discount\)/i)).toBeInTheDocument();
  });

  it('shows "Get Custom Quote" CTA button', () => {
    renderCalculator();
    expect(screen.getAllByText(/Get Custom Quote/i).length).toBeGreaterThan(0);
  });

  it('shows "Compare vs. Competitors" button', () => {
    renderCalculator();
    expect(screen.getByText(/Compare vs\. Competitors/i)).toBeInTheDocument();
  });

  it('clicking "Get Custom Quote" calls onRequestQuote with trucontext product', () => {
    renderCalculator();
    const quoteBtns = screen.getAllByText(/Get Custom Quote/i);
    act(() => fireEvent.click(quoteBtns[0]));
    expect(mockOnRequestQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        productInterest: 'trucontext',
      })
    );
  });

  it('shows cost breakdown when breakdown toggle is clicked', () => {
    renderCalculator();
    const toggleBtn = screen.getByText(/Show cost breakdown/i);
    act(() => fireEvent.click(toggleBtn));
    expect(screen.getByText(/Platform fee/i)).toBeInTheDocument();
  });

  it('shows "First 10,000 nodes" as base fee label in breakdown for TruContext', () => {
    renderCalculator();
    const toggleBtn = screen.getByText(/Show cost breakdown/i);
    act(() => fireEvent.click(toggleBtn));
    expect(screen.getByText(/First 10,000 nodes/i)).toBeInTheDocument();
  });

  it('shows fine print about estimates mirroring Core Offerings tiers', () => {
    renderCalculator();
    expect(screen.getByText(/mirror the Core Offerings pricing tiers/i)).toBeInTheDocument();
  });

  it('shows "Estimated Monthly Cost" label in the right panel', () => {
    renderCalculator();
    expect(screen.getByText(/Estimated Monthly Cost/i)).toBeInTheDocument();
  });

  it('node slider is present for TruContext', () => {
    renderCalculator();
    const sliders = document.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBeGreaterThanOrEqual(1);
  });

  it('TruClaw at 50+ agents shows "Contact Sales" instead of a dollar amount', () => {
    renderCalculator();
    const truClawBtns = screen.getAllByText(/TruClaw/i);
    act(() => fireEvent.click(truClawBtns[0]));

    // Drag agent slider to max (60 = >50 agents for TruClaw)
    const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
    act(() => fireEvent.change(slider, { target: { value: '60' } }));

    expect(screen.getAllByText(/Contact Sales/i).length).toBeGreaterThan(0);
  });

  it('shows "Request Enterprise Quote" CTA when Contact Sales is triggered for TruClaw', () => {
    renderCalculator();
    const truClawBtns = screen.getAllByText(/TruClaw/i);
    act(() => fireEvent.click(truClawBtns[0]));
    const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
    act(() => fireEvent.change(slider, { target: { value: '60' } }));
    expect(screen.getByText(/Request Enterprise Quote/i)).toBeInTheDocument();
  });
});
