import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PricingCalculator from '../PricingCalculator';

// Mock the trpc module
vi.mock('@/lib/trpc', () => ({
  trpc: {
    ecommerce: {
      getAllProducts: {
        useQuery: () => ({ data: [], isLoading: false }),
      },
    },
  },
}));

describe('PricingCalculator', () => {
  const mockOnRequestQuote = vi.fn();

  it('renders the pricing calculator heading', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    expect(screen.getByText(/Estimate Your Monthly Investment/i)).toBeTruthy();
  });

  it('renders product selection buttons', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    expect(screen.getByText(/TruContext/i)).toBeTruthy();
    expect(screen.getByText(/TruClaw/i)).toBeTruthy();
  });

  it('renders node and agent sliders', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    const sliders = document.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBeGreaterThanOrEqual(2);
  });

  it('renders estimated monthly cost section', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    expect(screen.getByText(/Estimated Monthly Cost/i)).toBeTruthy();
  });

  it('calls onRequestQuote when Get Custom Quote is clicked', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    const quoteButtons = screen.getAllByText(/Get Custom Quote/i);
    fireEvent.click(quoteButtons[0]);
    expect(mockOnRequestQuote).toHaveBeenCalled();
  });

  it('renders cost breakdown toggle button', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    expect(screen.getByText(/Show cost breakdown/i)).toBeTruthy();
  });

  it('shows cost breakdown when toggle is clicked', () => {
    render(<PricingCalculator onRequestQuote={mockOnRequestQuote} />);
    const toggleBtn = screen.getByText(/Show cost breakdown/i);
    fireEvent.click(toggleBtn);
    // After clicking, breakdown should be visible
    expect(screen.getByText(/Hide cost breakdown/i)).toBeTruthy();
  });
});
