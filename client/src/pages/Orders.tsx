import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Orders() {
  const { isAuthenticated, loading } = useAuth();
  const { data: orders, isLoading, error } = trpc.ecommerce.getMyOrders.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your orders</p>
            <Link href="/">
              <Button>Go to Home</Button>
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
          <h1 className="text-4xl font-bold">My Orders</h1>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-16">
        <div className="container max-w-4xl">
          {error ? (
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <p className="text-red-600">Error loading orders</p>
              </CardContent>
            </Card>
          ) : !orders || orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
                <p className="text-gray-600 mb-8">
                  You haven't placed any orders yet. Start shopping to place your first order.
                </p>
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${parseFloat(order.total).toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold mb-3">Items</h4>
                        <div className="space-y-2">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item: any) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>
                                  {item.productName} x{item.quantity}
                                </span>
                                <span>${parseFloat(item.lineTotal).toFixed(2)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No items found</p>
                          )}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-700">
                          {order.shippingStreet}
                          <br />
                          {order.shippingCity}, {order.shippingState} {order.shippingZip}
                          <br />
                          {order.shippingCountry}
                        </p>
                      </div>

                      {/* Order Summary */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Subtotal</p>
                          <p className="font-semibold">
                            ${parseFloat(order.subtotal).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tax</p>
                          <p className="font-semibold">
                            ${parseFloat(order.tax || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Shipping</p>
                          <p className="font-semibold">
                            ${parseFloat(order.shipping || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
