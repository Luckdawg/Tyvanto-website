import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, cartTotal } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
  });

  const createCheckoutMutation = trpc.ecommerce.createCheckoutSession.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (items.length === 0) {
        setError('Your cart is empty');
        setIsLoading(false);
        return;
      }

      const result = await createCheckoutMutation.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
      });

      if (result.sessionUrl) {
        window.open(result.sessionUrl, '_blank');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create checkout session'
      );
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container">
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                        {error}
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Contact Information</h3>

                      <div>
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <Input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-bold text-lg">Shipping Address</h3>

                      <div>
                        <Label htmlFor="shippingStreet">Street Address</Label>
                        <Input
                          id="shippingStreet"
                          name="shippingStreet"
                          value={formData.shippingStreet}
                          onChange={handleInputChange}
                          required
                          placeholder="123 Main St"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingCity">City</Label>
                          <Input
                            id="shippingCity"
                            name="shippingCity"
                            value={formData.shippingCity}
                            onChange={handleInputChange}
                            required
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shippingState">State</Label>
                          <Input
                            id="shippingState"
                            name="shippingState"
                            value={formData.shippingState}
                            onChange={handleInputChange}
                            required
                            placeholder="NY"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingZip">ZIP Code</Label>
                          <Input
                            id="shippingZip"
                            name="shippingZip"
                            value={formData.shippingZip}
                            onChange={handleInputChange}
                            required
                            placeholder="10001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shippingCountry">Country</Label>
                          <select
                            id="shippingCountry"
                            name="shippingCountry"
                            value={formData.shippingCountry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="MX">Mexico</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(cartTotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 text-center mt-4">
                    Secure payment powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
