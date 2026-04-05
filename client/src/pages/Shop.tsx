import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Shop() {
  const { data: products, isLoading, error } = trpc.ecommerce.getAllProducts.useQuery();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [addedProduct, setAddedProduct] = useState<number | null>(null);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
    });

    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-lg text-white/90">
            Browse our premium products and solutions
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container">
          {!products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products available</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="h-64 overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>

                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.stock > 0 && product.stock < 10 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Only {product.stock} left
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full ${
                        addedProduct === product.id
                          ? 'bg-green-600 hover:bg-green-600'
                          : ''
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {addedProduct === product.id ? 'Added!' : 'Add to Cart'}
                    </Button>
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
