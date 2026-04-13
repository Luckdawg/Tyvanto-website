/**
 * MySubscriptions.test.tsx
 * Tests for the My Subscriptions page at /account/subscriptions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MySubscriptions from '../account/MySubscriptions';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/', mockNavigate],
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockPortalMutate = vi.fn();
let mockPortalIsPending = false;

vi.mock('@/lib/trpc', () => ({
  trpc: {
    shopCheckout: {
      getMySubscriptions: {
        useQuery: () => mockSubscriptionsQuery(),
      },
      createCustomerPortalSession: {
        useMutation: (opts: any) => ({
          mutate: mockPortalMutate,
          isPending: mockPortalIsPending,
        }),
      },
    },
  },
}));

vi.mock('@/_core/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    loading: false,
    isAuthenticated: true,
  }),
}));

// The query mock function — set in each test
let mockSubscriptionsQuery: () => any;

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockActiveSubscription = {
  id: 'sub_test123',
  productId: 'trucontext',
  productName: 'TruContext Intelligence Platform',
  billingCycle: 'monthly',
  status: 'active',
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
};

const mockCancellingSubscription = {
  ...mockActiveSubscription,
  cancelAtPeriodEnd: true,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MySubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPortalIsPending = false;
    // Default: loading
    mockSubscriptionsQuery = () => ({ data: undefined, isLoading: true, error: null });
  });

  describe('Loading state', () => {
    it('shows loading spinner when subscriptions are loading', () => {
      mockSubscriptionsQuery = () => ({ data: undefined, isLoading: true, error: null });
      render(<MySubscriptions />);
      expect(screen.getByText(/Loading your subscriptions/i)).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('shows empty state when user has no subscriptions', () => {
      mockSubscriptionsQuery = () => ({ data: [], isLoading: false, error: null });
      render(<MySubscriptions />);
      expect(screen.getByText('No active subscriptions')).toBeInTheDocument();
    });

    it('shows "Browse Products" link to shop when no subscriptions', () => {
      mockSubscriptionsQuery = () => ({ data: [], isLoading: false, error: null });
      render(<MySubscriptions />);
      const shopLink = screen.getByRole('link', { name: /Browse Products/i });
      expect(shopLink).toHaveAttribute('href', '/shop');
    });

    it('shows descriptive text in empty state', () => {
      mockSubscriptionsQuery = () => ({ data: [], isLoading: false, error: null });
      render(<MySubscriptions />);
      expect(screen.getByText(/You don't have any active Visium subscriptions/i)).toBeInTheDocument();
    });
  });

  describe('Active subscriptions', () => {
    beforeEach(() => {
      mockSubscriptionsQuery = () => ({
        data: [mockActiveSubscription],
        isLoading: false,
        error: null,
      });
    });

    it('renders the page heading', () => {
      render(<MySubscriptions />);
      expect(screen.getByText('My Subscriptions')).toBeInTheDocument();
    });

    it('shows the user name in the subheading', () => {
      render(<MySubscriptions />);
      expect(screen.getByText('Signed in as Test User')).toBeInTheDocument();
    });

    it('shows the subscription product name', () => {
      render(<MySubscriptions />);
      expect(screen.getByText('TruContext Intelligence Platform')).toBeInTheDocument();
    });

    it('shows the "Active" status badge', () => {
      render(<MySubscriptions />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows "Monthly" billing badge', () => {
      render(<MySubscriptions />);
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('shows renewal date label', () => {
      render(<MySubscriptions />);
      expect(screen.getByText(/Renews/i)).toBeInTheDocument();
    });

    it('shows subscription count in summary bar', () => {
      render(<MySubscriptions />);
      // The count is split across elements: "1" in <strong> and " active subscription" as text
      // Check the span element that contains the count text directly
      const countElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'SPAN' && !!(element.textContent?.match(/active.*subscription/i));
      });
      expect(countElements.length).toBeGreaterThan(0);
      expect(countElements[0].textContent).toMatch(/1.*active.*subscription/i);
    });

    it('shows "Manage" button on subscription card', () => {
      render(<MySubscriptions />);
      const manageButtons = screen.getAllByRole('button', { name: /Manage/i });
      expect(manageButtons.length).toBeGreaterThan(0);
    });

    it('calls portal mutation when Manage button is clicked', () => {
      render(<MySubscriptions />);
      const manageButtons = screen.getAllByRole('button', { name: /Manage/i });
      fireEvent.click(manageButtons[0]);
      expect(mockPortalMutate).toHaveBeenCalled();
    });

    it('shows "Open Customer Portal" CTA button', () => {
      render(<MySubscriptions />);
      expect(screen.getByRole('button', { name: /Open Customer Portal/i })).toBeInTheDocument();
    });

    it('calls portal mutation when Open Customer Portal is clicked', () => {
      render(<MySubscriptions />);
      const portalButton = screen.getByRole('button', { name: /Open Customer Portal/i });
      fireEvent.click(portalButton);
      expect(mockPortalMutate).toHaveBeenCalled();
    });

    it('shows "Browse All Products" link', () => {
      render(<MySubscriptions />);
      const browseLinks = screen.getAllByRole('link', { name: /Browse All Products/i });
      expect(browseLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Annual billing', () => {
    it('shows "Annual" billing badge for annual subscriptions', () => {
      mockSubscriptionsQuery = () => ({
        data: [{ ...mockActiveSubscription, billingCycle: 'annual' }],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      expect(screen.getByText(/Annual · 15–20% off/i)).toBeInTheDocument();
    });
  });

  describe('Cancelling subscription', () => {
    it('shows "Cancels at period end" badge when cancelAtPeriodEnd is true', () => {
      mockSubscriptionsQuery = () => ({
        data: [mockCancellingSubscription],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      expect(screen.getByText('Cancels at period end')).toBeInTheDocument();
    });

    it('shows "Access ends" instead of "Renews" when cancelling', () => {
      mockSubscriptionsQuery = () => ({
        data: [mockCancellingSubscription],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      expect(screen.getByText(/Access ends/i)).toBeInTheDocument();
    });

    it('shows "Reactivate" button when subscription is cancelling', () => {
      mockSubscriptionsQuery = () => ({
        data: [mockCancellingSubscription],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      expect(screen.getByRole('button', { name: /Reactivate/i })).toBeInTheDocument();
    });
  });

  describe('Portal loading state', () => {
    it('shows "Opening portal…" when portal mutation is pending', () => {
      mockPortalIsPending = true;
      mockSubscriptionsQuery = () => ({
        data: [mockActiveSubscription],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      expect(screen.getByText('Opening portal…')).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('shows error message when query fails', () => {
      mockSubscriptionsQuery = () => ({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to load subscriptions'),
      });
      render(<MySubscriptions />);
      // Use heading specifically to avoid matching the error message text
      expect(screen.getByRole('heading', { name: /Failed to load subscriptions/i })).toBeInTheDocument();
    });
  });

  describe('Multiple subscriptions', () => {
    it('shows correct count for multiple subscriptions', () => {
      const sub2 = { ...mockActiveSubscription, id: 'sub_test456', productName: 'TruClaw Governance' };
      mockSubscriptionsQuery = () => ({
        data: [mockActiveSubscription, sub2],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      // The count is split across elements: "2" in <strong> and " active subscriptions" as text
      const countElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'SPAN' && !!(element.textContent?.match(/active.*subscriptions/i));
      });
      expect(countElements.length).toBeGreaterThan(0);
      expect(countElements[0].textContent).toMatch(/2.*active.*subscriptions/i);
    });

    it('renders all subscription product names', () => {
      const sub2 = { ...mockActiveSubscription, id: 'sub_test456', productName: 'TruClaw Governance' };
      mockSubscriptionsQuery = () => ({
        data: [mockActiveSubscription, sub2],
        isLoading: false,
        error: null,
      });
      render(<MySubscriptions />);
      expect(screen.getByText('TruContext Intelligence Platform')).toBeInTheDocument();
      expect(screen.getByText('TruClaw Governance')).toBeInTheDocument();
    });
  });
});
