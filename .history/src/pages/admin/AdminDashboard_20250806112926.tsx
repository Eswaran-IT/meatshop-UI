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


// Mock data - in real app, this would come from API
const mockStats: DashboardStats = {
  todaySales: 45680,
  totalOrders: 156,
  pendingOrders: 23,
  lowStockItems: 8,
  totalCustomers: 1250,
  monthlyRevenue: 1456780
};

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  time: string;
}

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

const mockRecentOrders: RecentOrder[] = [
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

const mockLowStockItems: LowStockItem[] = [
  { id: '1', name: 'Chicken Breast', stock: 2, minStock: 10 },
  { id: '2', name: 'Mutton Leg', stock: 1, minStock: 5 },
  { id: '3', name: 'Fish Fillet', stock: 3, minStock: 8 }
];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);

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
      case 'pending': return { variant: 'secondary', className: 'bg-yellow-400 text-black' };
      case 'confirmed': return { variant: 'default', className: 'bg-green-500 text-white' };
      case 'processing': return { variant: 'default', className: 'bg-blue-500 text-white' };
      case 'shipped': return { variant: 'default', className: 'bg-indigo-500 text-white' };
      case 'delivered': return { variant: 'default', className: 'bg-green-700 text-white' };
      case 'cancelled': return { variant: 'destructive', className: '' };
      default: return { variant: 'default', className: '' };
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
                      {(() => {
                        const color = getStatusColor(order.status);
                        return (
                          <Badge variant={color.variant as 'default' | 'destructive' | 'outline' | 'secondary'} className={color.className}>
                            {order.status}
                          </Badge>
                        );
                      })()}
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



    </div>
  );
};

export default AdminDashboard;