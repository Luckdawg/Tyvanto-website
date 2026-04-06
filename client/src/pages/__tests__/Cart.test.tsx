/**
 * Cart.test.tsx — Unit tests for the Cart page and CartContext integration
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mock CartContext ─────────────────────────────────────────────────────────
const mockClearCart = vi.fn();
const mockRemoveItem = vi.fn();
const mockUpdateQuantity = vi.fn();

const mockCartState = {
  items: [
    { productId: 1, name: 'TruContext Core Platform', price: 9999, quantity: 1 },
    { productId: 2, name: 'TruClaw Agentic AI Governance', price: 799, quantity: 2 },
  ],
  cartTotal: 11597,
  itemCount: 3,
  addItem: vi.fn(),
  removeItem: mockRemoveItem,
  updateQuantity: mockUpdateQuantity,
  clearCart: mockClearCart,
};

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => mockCartState,
}));

// ─── Mock tRPC ────────────────────────────────────────────────────────────────
const mockMutate = vi.fn();
vi.mock('@/lib/trpc', () => ({
  trpc: {
    ecommerce: {
      createCheckoutSession: {
        useMutation: () => ({
          mutate: mockMutate,
          isPending: false,
        }),
      },
    },
  },
}));

// ─── Mock wouter ─────────────────────────────────────────────────────────────
vi.mock('wouter', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => ['/', vi.fn()],
}));

// ─── Mock sonner ─────────────────────────────────────────────────────────────
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// ─── Mock shadcn/ui ───────────────────────────────────────────────────────────
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>{children}</button>
  ),
}));
vi.mock('@/components/ui/input', () => ({
  Input: ({ id, type, placeholder, value, onChange }: any) => (
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} />
  ),
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

import Cart from '../Cart';

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cart items correctly', () => {
    render(<Cart />);
    expect(screen.getByText('TruContext Core Platform')).toBeInTheDocument();
    expect(screen.getByText('TruClaw Agentic AI Governance')).toBeInTheDocument();
  });

  it('displays the correct cart header with item count', () => {
    render(<Cart />);
    expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
  });

  it('shows order summary with correct total', () => {
    render(<Cart />);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    // Total: $11,597/mo
    expect(screen.getByText(/11,597/)).toBeInTheDocument();
  });

  it('shows the checkout details form fields', () => {
    render(<Cart />);
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('jane@company.com')).toBeInTheDocument();
  });

  it('shows validation error when submitting without name', () => {
    render(<Cart />);
    const checkoutBtn = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(checkoutBtn);
    expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting with invalid email', () => {
    render(<Cart />);
    const nameInput = screen.getByPlaceholderText('Jane Smith');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    const emailInput = screen.getByPlaceholderText('jane@company.com');
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    const checkoutBtn = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(checkoutBtn);
    expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();
  });

  it('calls createCheckoutSession mutation with correct data on valid submit', () => {
    render(<Cart />);
    const nameInput = screen.getByPlaceholderText('Jane Smith');
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    const emailInput = screen.getByPlaceholderText('jane@company.com');
    fireEvent.change(emailInput, { target: { value: 'jane@company.com' } });
    const checkoutBtn = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(checkoutBtn);
    expect(mockMutate).toHaveBeenCalledWith({
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ],
      customerEmail: 'jane@company.com',
      customerName: 'Jane Smith',
    });
  });

  it('calls removeItem when trash button is clicked', () => {
    render(<Cart />);
    // Find all trash/remove buttons (one per item)
    const removeButtons = screen.getAllByTitle('Remove item');
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveItem).toHaveBeenCalledWith(1);
  });

  it('calls clearCart when clear cart button is clicked', () => {
    render(<Cart />);
    const clearBtn = screen.getByText(/Clear cart/i);
    fireEvent.click(clearBtn);
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('shows test mode hint with Stripe test card number', () => {
    render(<Cart />);
    expect(screen.getByText(/4242 4242 4242 4242/)).toBeInTheDocument();
  });

  it('shows Stripe security badge', () => {
    render(<Cart />);
    expect(screen.getByText(/Secured by Stripe/i)).toBeInTheDocument();
  });
});

describe('Cart Page - Empty State', () => {
  it('does not show empty state when cart has items', () => {
    render(<Cart />);
    // With items present, we should NOT see the empty state
    expect(screen.queryByText(/Your Cart is Empty/i)).not.toBeInTheDocument();
    // And we SHOULD see the cart items
    expect(screen.getByText('TruContext Core Platform')).toBeInTheDocument();
  });
});
