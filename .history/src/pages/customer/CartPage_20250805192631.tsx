import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Clock,
  CreditCard,
  Smartphone,
  ArrowLeft
} from 'lucide-react';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Mock addresses
  const addresses = [
    {
      id: '1',
      type: 'Home',
      address: '123 Main Street, Apartment 4B, Near Central Mall, Mumbai, Maharashtra - 400001'
    },
    {
      id: '2',
      type: 'Work',
      address: '456 Business Park, Tower A, Floor 10, Mumbai, Maharashtra - 400002'
    }
  ];

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const discount = promoCode === 'SAVE10' ? totalAmount * 0.1 : 0;
  const total = totalAmount + deliveryFee - discount;

  const handleUpdateQuantity = (id: string, newWeight: number, minWeight: number) => {
    if (newWeight >= minWeight && newWeight <= 10) {
      updateQuantity(id, newWeight);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast({
      title: "Item Removed",
      description: `${name} has been removed from your cart`,
    });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully",
    });
    
    clearCart();
    setIsCheckingOut(false);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
        
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button variant="meat" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Button 
              variant="ghost" 
              onClick={() => clearCart()}
              className="text-destructive hover:text-destructive"
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price}/kg • Min: {item.minWeight}kg
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.weight - 0.1, item.minWeight)}
                            disabled={item.weight <= item.minWeight}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.weight}
                            onChange={(e) => handleUpdateQuantity(item.id, parseFloat(e.target.value) || 0, item.minWeight)}
                            min={item.minWeight}
                            max={10}
                            step={0.1}
                            className="w-20 text-center"
                          />
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.weight + 0.1, item.minWeight)}
                            disabled={item.weight >= 10}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-sm text-muted-foreground">kg</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-lg">₹{item.total.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.weight}kg × ₹{item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <div className="text-right">
                    {deliveryFee === 0 ? (
                      <div>
                        <span className="text-success font-medium">FREE</span>
                        <div className="text-xs text-muted-foreground">Above ₹500</div>
                      </div>
                    ) : (
                      <span>₹{deliveryFee}</span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full"
                size="lg"
                variant="meat"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {isCheckingOut ? 'Processing...' : `Proceed to Checkout - ₹${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Fast Delivery</div>
                  <div className="text-sm text-muted-foreground">
                    Same day delivery available
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo */}
          {totalAmount < 500 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="font-medium text-primary">
                    Add ₹{(500 - totalAmount).toFixed(2)} more for FREE delivery!
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Save ₹50 on delivery charges
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;