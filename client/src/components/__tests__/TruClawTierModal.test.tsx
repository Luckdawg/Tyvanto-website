/**
 * TruClawTierModal.test.tsx
 * Tests for the TruClaw tier-picker modal component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TruClawTierModal from '../TruClawTierModal';

// ─── Mock tRPC ────────────────────────────────────────────────────────────────

const mockMutate = vi.fn();
const mockUseMutation = vi.fn(() => ({
  mutate: mockMutate,
  isPending: false,
}));

vi.mock('@/lib/trpc', () => ({
  trpc: {
    shopCheckout: {
      createSubscriptionCheckout: {
        useMutation: () => mockUseMutation(),
      },
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderModal(props: Partial<React.ComponentProps<typeof TruClawTierModal>> = {}) {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    defaultBillingCycle: 'monthly' as const,
    ...props,
  };
  return render(<TruClawTierModal {...defaultProps} />);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TruClawTierModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({ mutate: mockMutate, isPending: false });
  });

  describe('Rendering', () => {
    it('renders the modal when open is true', () => {
      renderModal({ open: true });
      expect(screen.getByText('Choose Your TruClaw™ Plan')).toBeInTheDocument();
    });

    it('does not render content when open is false', () => {
      renderModal({ open: false });
      expect(screen.queryByText('Choose Your TruClaw™ Plan')).not.toBeInTheDocument();
    });

    it('renders all three tiers', () => {
      renderModal();
      expect(screen.getByText('Starter')).toBeInTheDocument();
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('shows "Most Popular" badge on Standard tier', () => {
      renderModal();
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('shows "Custom Pricing" badge on Enterprise tier', () => {
      renderModal();
      expect(screen.getByText('Custom Pricing')).toBeInTheDocument();
    });

    it('shows agent limits for each tier', () => {
      renderModal();
      expect(screen.getByText('≤ 10 agents')).toBeInTheDocument();
      expect(screen.getByText('11–50 agents')).toBeInTheDocument();
      expect(screen.getByText('50+ agents')).toBeInTheDocument();
    });
  });

  describe('Pricing display', () => {
    it('shows monthly prices when billing cycle is monthly', () => {
      renderModal({ defaultBillingCycle: 'monthly' });
      expect(screen.getByText('$1,299')).toBeInTheDocument();
      expect(screen.getByText('$6,995')).toBeInTheDocument();
    });

    it('shows discounted prices when billing cycle is annual', () => {
      renderModal({ defaultBillingCycle: 'annual' });
      // 10% off $1,299 = $1,169; 10% off $6,995 = $6,296
      expect(screen.getByText('$1,169')).toBeInTheDocument();
      expect(screen.getByText('$6,296')).toBeInTheDocument();
    });

    it('shows "Custom" for Enterprise tier', () => {
      renderModal();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('shows annual savings when annual billing is selected', () => {
      renderModal({ defaultBillingCycle: 'annual' });
      // Starter annual savings: ($1,299 - $1,169) * 12 = $1,560
      expect(screen.getByText('Save $1,560/yr')).toBeInTheDocument();
    });
  });

  describe('Billing cycle toggle', () => {
    it('defaults to monthly billing', () => {
      renderModal({ defaultBillingCycle: 'monthly' });
      // Monthly price shown
      expect(screen.getByText('$1,299')).toBeInTheDocument();
    });

    it('defaults to annual billing when specified', () => {
      renderModal({ defaultBillingCycle: 'annual' });
      // Annual price shown (10% off)
      expect(screen.getByText('$1,169')).toBeInTheDocument();
    });

    it('switches to annual billing when Annual button is clicked', () => {
      renderModal({ defaultBillingCycle: 'monthly' });
      const annualButton = screen.getByRole('button', { name: /Annual/i });
      fireEvent.click(annualButton);
      // After switching, discounted price should appear (10% off $1,299 = $1,169)
      expect(screen.getByText('$1,169')).toBeInTheDocument();
    });

    it('shows Save 10% badge on Annual toggle', () => {
      renderModal();
      expect(screen.getByText('Save 10%')).toBeInTheDocument();
    });
  });

  describe('Tier selection', () => {
    it('defaults to Standard tier selected', () => {
      renderModal();
      // "Selected" indicator appears on Standard
      const selectedIndicators = screen.getAllByText('Selected');
      expect(selectedIndicators.length).toBeGreaterThan(0);
    });

    it('allows selecting Starter tier', () => {
      renderModal();
      const starterCard = screen.getByText('Starter').closest('button');
      fireEvent.click(starterCard!);
      // Footer should now show TruClaw Starter
      expect(screen.getByText(/TruClaw Starter/)).toBeInTheDocument();
    });

    it('allows selecting Enterprise tier', () => {
      renderModal();
      const enterpriseCard = screen.getByText('Enterprise').closest('button');
      fireEvent.click(enterpriseCard!);
      // Footer should show "Enterprise pricing requires a custom quote"
      expect(screen.getByText(/Enterprise pricing requires a custom quote/)).toBeInTheDocument();
    });
  });

  describe('Checkout flow', () => {
    it('calls checkout mutation when Proceed to Checkout is clicked for Standard', () => {
      renderModal();
      const proceedButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
      fireEvent.click(proceedButton);
      expect(mockMutate).toHaveBeenCalledWith({
        productId: 'truclaw-standard',
        billingCycle: 'monthly',
      });
    });

    it('calls checkout with annual billing cycle when annual is selected', () => {
      renderModal({ defaultBillingCycle: 'annual' });
      const proceedButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
      fireEvent.click(proceedButton);
      expect(mockMutate).toHaveBeenCalledWith({
        productId: 'truclaw-standard',
        billingCycle: 'annual',
      });
    });

    it('shows "Contact Sales" button for Enterprise tier', () => {
      renderModal();
      const enterpriseCard = screen.getByText('Enterprise').closest('button');
      fireEvent.click(enterpriseCard!);
      const contactSalesButtons = screen.getAllByRole('button', { name: /Contact Sales/i });
      expect(contactSalesButtons.length).toBeGreaterThan(0);
    });

    it('calls onClose when Cancel is clicked', () => {
      const onClose = vi.fn();
      renderModal({ onClose });
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('shows loading state when checkout is pending', () => {
      mockUseMutation.mockReturnValue({ mutate: mockMutate, isPending: true });
      renderModal();
      expect(screen.getByText('Opening checkout…')).toBeInTheDocument();
    });
  });

  describe('Features display', () => {
    it('shows Starter features', () => {
      renderModal();
      expect(screen.getByText('Up to 10 AI agents monitored')).toBeInTheDocument();
    });

    it('shows Standard features', () => {
      renderModal();
      expect(screen.getByText('Up to 50 AI agents monitored')).toBeInTheDocument();
    });

    it('shows Enterprise features', () => {
      renderModal();
      expect(screen.getByText('Unlimited AI agents')).toBeInTheDocument();
    });
  });
});
