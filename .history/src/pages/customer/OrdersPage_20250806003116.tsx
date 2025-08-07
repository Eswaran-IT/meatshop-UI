import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin,
  Phone,
  Star,
  Eye,
  RotateCcw
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  deliveryAddress: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD001',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      {
        id: '1',
        name: 'Chicken Breast',
        quantity: 2,
        price: 280,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200'
      },
      {
        id: '2',
        name: 'Mutton Leg',
        quantity: 1,
        price: 650,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200'
      }
    ],
    total: 1210,
    deliveryAddress: '123 Main St, Mumbai, Maharashtra 400001',
    estimatedDelivery: '2024-01-16',
    trackingNumber: 'TRK123456789'
  },
  {
    id: '2',
    orderNumber: 'ORD002',
    date: '2024-01-20',
    status: 'shipped',
    items: [
      {
        id: '3',
        name: 'Fish Fillet',
        quantity: 1.5,
        price: 400,
        image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=200'
      }
    ],
    total: 600,
    deliveryAddress: '456 Park Ave, Mumbai, Maharashtra 400002',
    estimatedDelivery: '2024-01-21',
    trackingNumber: 'TRK987654321'
  },
  {
    id: '3',
    orderNumber: 'ORD003',
    date: '2024-01-22',
    status: 'processing',
    items: [
      {
        id: '4',
        name: 'Chicken Wings',
        quantity: 1,
        price: 320,
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=200'
      }
    ],
    total: 320,
    deliveryAddress: '789 Beach Rd, Mumbai, Maharashtra 400003',
    estimatedDelivery: '2024-01-23'
  }
];

const OrdersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'processing': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return RotateCcw;
      default: return Package;
    }
  };

  const reorderItems = (order: Order) => {
    toast({
      title: "Items Added to Cart",
      description: `${order.items.length} items from order ${order.orderNumber} added to your cart.`,
      position: "top-center"
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">
          Track your orders and view order history
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Button>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.status) as any} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Items Ordered</h4>
                    <div className="grid gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-accent/50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium">{item.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}kg
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.price}/kg
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold text-primary">₹{order.total}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">
                      {order.deliveryAddress}
                    </p>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4" />
                        Tracking Information
                      </h4>
                      <p className="text-sm">
                        Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === 'delivered' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => reorderItems(order)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Star className="h-4 w-4 mr-2" />
                          Rate Order
                        </Button>
                      </>
                    )}
                    {(order.status === 'shipped' || order.status === 'processing') && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;