import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types';
import { 
  Search, 
  Eye,
  Filter,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  IndianRupee
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: '1',
    customerName: 'John Doe',
    customerMobile: '+91 9876543210',
    items: [
      { meatId: '1', meatName: 'Chicken Breast', price: 280, weight: 1.5, total: 420 },
      { meatId: '2', meatName: 'Mutton Leg', price: 650, weight: 1, total: 650 }
    ],
    totalAmount: 1070,
    status: 'pending',
    orderDate: '2024-03-01T10:30:00Z',
    deliveryDate: '2024-03-02T18:00:00Z',
    deliveryAddress: '123 Main Street, Sector 14, Gurgaon, Haryana 122001',
    paymentMethod: 'cod',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD002',
    customerId: '2',
    customerName: 'Jane Smith',
    customerMobile: '+91 8765432109',
    items: [
      { meatId: '3', meatName: 'Fish Fillet', price: 420, weight: 0.8, total: 336 }
    ],
    totalAmount: 336,
    status: 'confirmed',
    orderDate: '2024-03-01T14:15:00Z',
    deliveryDate: '2024-03-03T16:00:00Z',
    deliveryAddress: '456 Park Avenue, Phase 2, DLF City, Gurgaon, Haryana 122002',
    paymentMethod: 'online',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD003',
    customerId: '3',
    customerName: 'Mike Johnson',
    customerMobile: '+91 7654321098',
    items: [
      { meatId: '4', meatName: 'Beef Steak', price: 750, weight: 2, total: 1500 },
      { meatId: '1', meatName: 'Chicken Breast', price: 280, weight: 1, total: 280 }
    ],
    totalAmount: 1780,
    status: 'processing',
    orderDate: '2024-02-29T09:45:00Z',
    deliveryDate: '2024-03-02T20:00:00Z',
    deliveryAddress: '789 Golf Course Road, Sector 43, Gurgaon, Haryana 122003',
    paymentMethod: 'online',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD004',
    customerId: '4',
    customerName: 'Sarah Wilson',
    customerMobile: '+91 6543210987',
    items: [
      { meatId: '2', meatName: 'Mutton Leg', price: 650, weight: 2.5, total: 1625 }
    ],
    totalAmount: 1625,
    status: 'shipped',
    orderDate: '2024-02-28T16:20:00Z',
    deliveryDate: '2024-03-01T19:00:00Z',
    deliveryAddress: '321 Cyber Hub, Sector 29, Gurgaon, Haryana 122004',
    paymentMethod: 'cod',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD005',
    customerId: '5',
    customerName: 'David Brown',
    customerMobile: '+91 5432109876',
    items: [
      { meatId: '3', meatName: 'Fish Fillet', price: 420, weight: 1.2, total: 504 },
      { meatId: '1', meatName: 'Chicken Breast', price: 280, weight: 0.5, total: 140 }
    ],
    totalAmount: 644,
    status: 'delivered',
    orderDate: '2024-02-27T11:10:00Z',
    deliveryDate: '2024-02-28T17:30:00Z',
    deliveryAddress: '654 MG Road, Sector 28, Gurgaon, Haryana 122005',
    paymentMethod: 'online',
    paymentStatus: 'paid'
  }
];

const ManageOrders: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API loading
    const loadOrders = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerMobile.includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Initialize map when dialog opens
  useEffect(() => {
    if (dialogOpen && selectedOrder && mapContainer.current && !map.current) {
      // Set a temporary token - in real app, this would be from environment variables
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNrcDk3aHJ1dTE4ZGczNXBpZ2NkMXFlbWEifQ.Lau_nzsm7p6-RBCqMyZGKQ';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [77.0266, 28.4595], // Gurgaon coordinates
        zoom: 12
      });

      // Add marker for delivery address
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([77.0266 + Math.random() * 0.1, 28.4595 + Math.random() * 0.1])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<p><strong>${selectedOrder.customerName}</strong><br/>${selectedOrder.deliveryAddress}</p>`))
        .addTo(map.current);
    }
  }, [dialogOpen, selectedOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'packed': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'packed': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status updated to ${newStatus}`,
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders with delivery tracking
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-600" />
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'shipped').length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by order ID, customer name, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.customerMobile}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          <div className="text-muted-foreground">
                            {order.items.map(item => item.meatName).join(', ')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          <span className="font-semibold">{order.totalAmount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(order.orderDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                            {order.paymentStatus}
                          </Badge>
                          <div className="text-muted-foreground mt-1">
                            {order.paymentMethod}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                              <Package className="h-4 w-4 mr-2" />
                              Start Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>
                              <Truck className="h-4 w-4 mr-2" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No orders found matching your criteria.' 
                  : 'No orders yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                      <p>{selectedOrder.customerMobile}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                      <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.meatName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.weight}kg × ₹{item.price}/kg
                            </p>
                          </div>
                          <p className="font-semibold">₹{item.total}</p>
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total Amount:</span>
                          <span>₹{selectedOrder.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Current Status:</span>
                        <Badge className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Status:</span>
                        <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'outline'}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span>{new Date(selectedOrder.orderDate).toLocaleString()}</span>
                      </div>
                      {selectedOrder.deliveryDate && (
                        <div className="flex justify-between">
                          <span>Expected Delivery:</span>
                          <span>{new Date(selectedOrder.deliveryDate).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Map */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <div ref={mapContainer} className="w-full h-full" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Distance from store:</p>
                      <p className="font-medium">~12.5 km (25-30 mins)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Update Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                        disabled={selectedOrder.status === 'confirmed'}
                      >
                        Confirm
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                        disabled={selectedOrder.status === 'processing'}
                      >
                        Process
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'packed')}
                        disabled={selectedOrder.status === 'packed'}
                      >
                        Pack
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                        disabled={selectedOrder.status === 'shipped'}
                      >
                        Ship
                      </Button>
                      <Button 
                        variant="meat" 
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                        disabled={selectedOrder.status === 'delivered'}
                        className="col-span-2"
                      >
                        Mark as Delivered
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOrders;