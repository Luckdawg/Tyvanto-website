import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';

export default function OrderConfirmation() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const { clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Simulate order processing
    // In a real app, you'd verify the session with Stripe and create the order
    const timer = setTimeout(() => {
      const orderNum = `ORD-${Date.now()}`;
      setOrderNumber(orderNum);
      setStatus('success');
      clearCart();
    }, 2000);

    return () => clearTimeout(timer);
  }, [clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/5">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container">
            <h1 className="text-4xl font-bold">Order Error</h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-2xl">
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                <p className="text-gray-600 mb-8">
                  We couldn't process your order. Please try again or contact support.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/cart">
                    <Button variant="outline">Back to Cart</Button>
                  </Link>
                  <Link href="/shop">
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container">
          <h1 className="text-4xl font-bold">Order Confirmed</h1>
        </div>
      </section>

      {/* Confirmation */}
      <section className="py-16">
        <div className="container max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />

              <h2 className="text-3xl font-bold mb-2">Thank You for Your Order!</h2>

              <p className="text-gray-600 mb-8">
                Your order has been successfully placed and is being processed.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p className="text-sm text-gray-600 mb-2">Order Number</p>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              </div>

              <div className="space-y-4 text-left mb-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold mb-4">What's Next?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span>
                      A confirmation email has been sent to{' '}
                      <strong>{user?.email || 'your email'}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span>
                      Your order will be processed and shipped within 1-2 business days
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span>
                      You'll receive a tracking number via email once your order ships
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/orders">
                  <Button>View My Orders</Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Questions? Contact our support team at{' '}
              <a href="mailto:support@tyvanto.com" className="text-primary hover:underline">
                support@tyvanto.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
