import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const { data: orders, isLoading, error } = trpc.ecommerce.getAllOrders.useQuery(
    undefined,
    { enabled: user?.role === 'admin' }
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="container py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">You don't have permission to access this page</p>
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
          <h1 className="text-4xl font-bold">Admin - Order Management</h1>
          <p className="text-white/90 mt-2">Manage all customer orders</p>
        </div>
      </section>

      {/* Orders Table */}
      <section className="py-16">
        <div className="container">
          {error ? (
            <Card className="border-red-200">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-red-600">Error loading orders</p>
              </CardContent>
            </Card>
          ) : !orders || orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-primary">{orders.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm">Paid Orders</p>
                    <p className="text-3xl font-bold text-green-600">
                      {orders.filter((o: any) => o.status === 'paid').length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm">Pending Orders</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {orders.filter((o: any) => o.status === 'pending').length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-primary">
                      $
                      {orders
                        .reduce((sum: number, o: any) => sum + parseFloat(o.total), 0)
                        .toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Order #</th>
                          <th className="text-left py-3 px-4 font-semibold">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold">Email</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-primary">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 px-4">{order.customerName}</td>
                            <td className="py-3 px-4">{order.customerEmail}</td>
                            <td className="py-3 px-4 font-semibold">
                              ${parseFloat(order.total).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setSelectedOrder(
                                    selectedOrder === order.id ? null : order.id
                                  )
                                }
                              >
                                {selectedOrder === order.id ? 'Hide' : 'View'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              {selectedOrder && (
                <OrderDetails
                  orderId={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function OrderDetails({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) {
  const { data: order, isLoading } = trpc.ecommerce.getOrder.useQuery({
    orderId: orderId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order Details - {order.orderNumber}</CardTitle>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Customer Name</p>
            <p className="font-semibold">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{order.customerEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold">{order.customerPhone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Shipping Address</h4>
          <p className="text-sm">
            {order.shippingStreet}
            <br />
            {order.shippingCity}, {order.shippingState} {order.shippingZip}
            <br />
            {order.shippingCountry}
          </p>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="font-semibold mb-3">Items</h4>
          <div className="space-y-2">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>
                  {item.productName} x{item.quantity}
                </span>
                <span>${parseFloat(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${parseFloat((order.tax || 0).toString()).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${parseFloat((order.shipping || 0).toString()).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
