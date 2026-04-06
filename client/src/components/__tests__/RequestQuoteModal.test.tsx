/**
 * Tests for RequestQuoteModal component
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock trpc
vi.mock('@/lib/trpc', () => ({
  trpc: {
    system: {
      notifyOwner: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isPending: false,
        })),
      },
    },
  },
}));

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ['/', vi.fn()],
}));

import RequestQuoteModal from '../RequestQuoteModal';

describe('RequestQuoteModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open is true', () => {
    render(<RequestQuoteModal {...defaultProps} />);
    expect(screen.getByText('Request a Custom Quote')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<RequestQuoteModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Request a Custom Quote')).not.toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<RequestQuoteModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('jane@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toBeInTheDocument();
  });

  it('shows validation error when required fields are empty', () => {
    render(<RequestQuoteModal {...defaultProps} />);
    const submitButton = screen.getByText('Send Quote Request');
    fireEvent.click(submitButton);
    expect(screen.getByText(/Please fill in your name, company, and email/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', () => {
    render(<RequestQuoteModal {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Jane Smith'), {
      target: { value: 'John Doe', name: 'name' },
    });
    fireEvent.change(screen.getByPlaceholderText('Acme Corp'), {
      target: { value: 'Test Corp', name: 'company' },
    });
    fireEvent.change(screen.getByPlaceholderText('jane@company.com'), {
      target: { value: 'invalid-email', name: 'email' },
    });
    const submitButton = screen.getByText('Send Quote Request');
    fireEvent.click(submitButton);
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it('pre-fills product when defaultProduct is provided', () => {
    render(<RequestQuoteModal {...defaultProps} defaultProduct="TruContext Core Platform" />);
    const productSelect = screen.getByDisplayValue('TruContext Core Platform');
    expect(productSelect).toBeInTheDocument();
  });

  it('displays pricing snapshot summary when provided', () => {
    const pricingSnapshot = {
      productInterest: 'TruContext Core Platform',
      estimatedNodes: 5000,
      estimatedAgents: 10,
      estimatedMonthlyBudget: '$12,500/mo',
    };
    render(<RequestQuoteModal {...defaultProps} pricingSnapshot={pricingSnapshot} />);
    expect(screen.getByText(/Calculator estimate: \$12,500\/mo/i)).toBeInTheDocument();
    expect(screen.getByText(/5,000 nodes · 10 agents/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<RequestQuoteModal {...defaultProps} onClose={onClose} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders the close (X) button', () => {
    render(<RequestQuoteModal {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });
});
