import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CompetitorComparisonOverlay from '../CompetitorComparisonOverlay';

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  selectedProduct: 'trucontext',
  productLabel: 'TruContext',
  productColor: '#00E5FF',
  visiumMonthlyCost: 5000,
  nodes: 10000,
  agents: 10,
  onRequestQuote: vi.fn(),
};

describe('CompetitorComparisonOverlay', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <CompetitorComparisonOverlay {...defaultProps} open={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the overlay when open is true', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getByText('Side-by-Side Comparison at Your Scale')).toBeInTheDocument();
  });

  it('displays the selected product label in the header', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getAllByText('TruContext').length).toBeGreaterThan(0);
  });

  it('displays all four competitors', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getAllByText('Splunk ES').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CrowdStrike').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cortex XSIAM').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('IBM QRadar').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<CompetitorComparisonOverlay {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close comparison overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <CompetitorComparisonOverlay {...defaultProps} onClose={onClose} />
    );
    // Click the outer backdrop div (first child)
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onRequestQuote and onClose when Get Custom Quote is clicked', () => {
    const onClose = vi.fn();
    const onRequestQuote = vi.fn();
    render(
      <CompetitorComparisonOverlay
        {...defaultProps}
        onClose={onClose}
        onRequestQuote={onRequestQuote}
      />
    );
    fireEvent.click(screen.getByText('Get Custom Quote'));
    expect(onClose).toHaveBeenCalled();
    expect(onRequestQuote).toHaveBeenCalled();
  });

  it('shows the feature comparison matrix table', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getByText('Feature Comparison Matrix')).toBeInTheDocument();
    // Check a few key features are listed
    expect(screen.getByText('Graph Database (Neo4j)')).toBeInTheDocument();
    expect(screen.getByText('Agentic AI (Autonomous Agents)')).toBeInTheDocument();
    expect(screen.getByText('MITRE ATT&CK Native Integration')).toBeInTheDocument();
  });

  it('shows the cost comparison section', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getByText('Cost Comparison at Your Scale')).toBeInTheDocument();
    expect(screen.getByText('YOUR CHOICE')).toBeInTheDocument();
  });

  it('shows the Why Visium Wins section', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getByText('Why Visium Wins at Enterprise Scale')).toBeInTheDocument();
    expect(screen.getByText('Graph-Native Architecture')).toBeInTheDocument();
    expect(screen.getByText('Agentic AI, Not Just ML')).toBeInTheDocument();
    expect(screen.getByText('Cyber + Physical Fusion')).toBeInTheDocument();
  });

  it('displays the visium monthly cost in the header', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} visiumMonthlyCost={5000} />);
    expect(screen.getByText('$5.0K/mo')).toBeInTheDocument();
  });

  it('shows Back to Calculator button', () => {
    render(<CompetitorComparisonOverlay {...defaultProps} />);
    expect(screen.getByText('Back to Calculator')).toBeInTheDocument();
  });

  it('calls onClose when Back to Calculator is clicked', () => {
    const onClose = vi.fn();
    render(<CompetitorComparisonOverlay {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Back to Calculator'));
    expect(onClose).toHaveBeenCalled();
  });
});
