import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardStats } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  Package, 
  Clock, 
  AlertTriangle, 
  Users, 
  IndianRupee,
  Eye,
  Plus,
  BarChart3,
  ShieldAlert,
  List,
  BarChart2
} from 'lucide-react';
  // Quick Actions bar
  const QuickActions = () => (
    <div className="w-full bg-white shadow-sm rounded-lg flex flex-wrap items-center gap-4 p-4 mb-8">
      <span className="font-semibold text-lg mr-6">Quick Actions</span>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add New Meat
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <List className="h-4 w-4" /> View Orders
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-500" /> Stock Alert
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4" /> View Reports
      </Button>
    </div>
  );

// Mock data - in real app, this would come from API
const mockStats: DashboardStats = {
  todaySales: 45680,
  totalOrders: 156,
  pendingOrders: 23,
  lowStockItems: 8,
  totalCustomers: 1250,
  monthlyRevenue: 1456780
};

const mockRecentOrders = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    amount: 1250,
    status: 'pending',
    items: 3,
    time: '10 mins ago'
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    amount: 890,
    status: 'confirmed',
    items: 2,
    time: '25 mins ago'
  },
  {
    id: 'ORD003',
    customerName: 'Mike Johnson',
    amount: 2340,
    status: 'processing',
    items: 5,
    time: '1 hour ago'
  }
];

const mockLowStockItems = [
  { id: '1', name: 'Chicken Breast', stock: 2, minStock: 10 },
  { id: '2', name: 'Mutton Leg', stock: 1, minStock: 5 },
  { id: '3', name: 'Fish Fillet', stock: 3, minStock: 8 }
];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setLowStockItems(mockLowStockItems);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
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

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <QuickActions />
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Badge className="bg-red-600 text-white">
            <ShieldAlert className="h-3 w-3 mr-1" /> Admin Mode
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your meat shop today.
        </p>
        
        {/* Admin test account notification removed */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todaySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-success" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-success" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-warning">
              <AlertTriangle className="inline h-3 w-3 mr-1" />
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-destructive">
              <AlertTriangle className="inline h-3 w-3 mr-1" />
              Restock needed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-success" />
              +15 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-success" />
              +25% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders that need your attention</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items • {order.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.amount}</div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Items running low on inventory</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1">
                    <span className="font-medium">{item.name}</span>
                    <p className="text-sm text-muted-foreground">
                      Current: {item.stock}kg • Min: {item.minStock}kg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      Low Stock
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Add New Meat
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Package className="h-6 w-6 mb-2" />
              View Orders
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Stock Alert
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Data Filtering & Offer Creation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Data Filtering & Offer Creation</CardTitle>
          <CardDescription>Filter customers and create/send offers</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 1. Filtering UI */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input placeholder="Customer Phone or Email" className="w-full" />
            <Input placeholder="Order Count (e.g. >5)" className="w-full" />
            <Input placeholder="Order Dates (e.g. last 30 days)" className="w-full" />
            <Input placeholder="Total Purchase Amount (e.g. >1000)" className="w-full" />
            <select className="w-full border rounded px-3 py-2">
              <option value="">Product Types Bought</option>
              <option value="Chicken">Chicken</option>
              <option value="Mutton">Mutton</option>
              <option value="Fish">Fish</option>
              <option value="Beef">Beef</option>
              <option value="Pork">Pork</option>
            </select>
            <Button className="w-full md:col-span-2 lg:col-span-1" variant="default">Apply Filters</Button>
          </div>

          {/* 2. Offer Creation UI (mocked customer list) */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Select Customers</h4>
            <div className="border rounded p-3 mb-4 max-h-32 overflow-y-auto">
              {/* Replace with real filtered customers */}
              <label className="flex items-center gap-2 mb-2"><input type="checkbox" /> John Doe (9876543210)</label>
              <label className="flex items-center gap-2 mb-2"><input type="checkbox" /> Jane Smith (jane@email.com)</label>
              <label className="flex items-center gap-2 mb-2"><input type="checkbox" /> Mike Johnson (mike@email.com)</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select className="w-full border rounded px-3 py-2">
                <option value="">Discount Type</option>
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
              <Input placeholder="Discount Value (e.g. 10 or 100)" className="w-full" />
              <Input placeholder="Offer Validity (e.g. 7 days)" className="w-full" />
            </div>
            <Button className="w-full md:w-auto" variant="success">Send Offer</Button>
          </div>

          {/* 3. Offer Distribution Mechanism (placeholder) */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <span className="font-medium text-green-700">Offer will be sent to selected customers via SMS.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;