import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Filter,
  Search,
  Gift,
  Percent,
  Calendar as CalendarIcon,
  IndianRupee,
  Users,
  Phone,
  ShoppingBag,
} from 'lucide-react';


interface CustomerAnalysis {
  mobile: string;
  name: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
  preferredItems: string[];
  averageOrderValue: number;
}

const CustomerAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [minOrders, setMinOrders] = useState<string>('0');
  const [minAmount, setMinAmount] = useState<string>('0');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const { toast } = useToast();

  // Mock customer data
  const mockCustomers = React.useMemo<CustomerAnalysis[]>(() => [
    {
      mobile: '+91 9876543210',
      name: 'John Doe',
      totalOrders: 12,
      totalAmount: 15600,
      lastOrderDate: '2024-03-01',
      preferredItems: ['Chicken', 'Mutton'],
      averageOrderValue: 1300
    },
    {
      mobile: '+91 8765432109',
      name: 'Jane Smith',
      totalOrders: 8,
      totalAmount: 9800,
      lastOrderDate: '2024-02-28',
      preferredItems: ['Fish', 'Chicken'],
      averageOrderValue: 1225
    },
    {
      mobile: '+91 7654321098',
      name: 'Mike Johnson',
      totalOrders: 15,
      totalAmount: 21000,
      lastOrderDate: '2024-03-02',
      preferredItems: ['Mutton', 'Beef'],
      averageOrderValue: 1400
    }
  ], []);

  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [offerType, setOfferType] = useState<'percentage' | 'fixed'>('percentage');
  const [offerValue, setOfferValue] = useState('');
  const [offerValidity, setOfferValidity] = useState('7'); // days

  const applyFilters = React.useCallback(() => {
    let filtered = [...mockCustomers];

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(customer => {
        const orderDate = new Date(customer.lastOrderDate);
        return orderDate >= dateRange.from && orderDate <= dateRange.to;
      });
    }

    // Minimum orders filter
    if (minOrders && parseInt(minOrders) > 0) {
      filtered = filtered.filter(customer => customer.totalOrders >= parseInt(minOrders));
    }

    // Minimum amount filter
    if (minAmount && parseInt(minAmount) > 0) {
      filtered = filtered.filter(customer => customer.totalAmount >= parseInt(minAmount));
    }

    // Product type filter
    if (selectedProducts.length > 0) {
      filtered = filtered.filter(customer => 
        customer.preferredItems.some(item => selectedProducts.includes(item))
      );
    }

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm)
      );
    }

    setFilteredCustomers(filtered);
  }, [dateRange, minOrders, minAmount, selectedProducts, searchTerm, mockCustomers]);

  useEffect(() => {
    applyFilters();
  }, [dateRange, minOrders, minAmount, selectedProducts, searchTerm, applyFilters]);

  const handleCreateOffer = () => {
    // In a real app, this would make an API call
    const offerDetails = {
      type: offerType,
      value: offerValue,
      validity: offerValidity,
      customers: selectedCustomers
    };

    toast({
      title: "Offer Created Successfully",
      description: `Created ${offerType === 'percentage' ? offerValue + '% OFF' : '₹' + offerValue + ' OFF'} offer for ${selectedCustomers.length} customers`,
    });

    setShowOfferDialog(false);
    setSelectedCustomers([]);
    setOfferValue('');
    setOfferValidity('7');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Analysis</h1>
          <p className="text-muted-foreground">
            Analyze customer behavior and create targeted offers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div className="text-2xl font-bold">{mockCustomers.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold">
                {mockCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-red-600" />
              <div className="text-2xl font-bold">
                {mockCustomers.reduce((sum, customer) => sum + customer.totalAmount, 0).toLocaleString('en-IN')}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-purple-600" />
              <div className="text-2xl font-bold">1,250</div>
            </div>
            <p className="text-xs text-muted-foreground">Active Offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DateRangePicker 
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Orders</label>
              <Input
                type="number"
                min="0"
                value={minOrders}
                onChange={(e) => setMinOrders(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Purchase Amount</label>
              <Input
                type="number"
                min="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Types</label>
              <Select
                value={selectedProducts[0]}
                onValueChange={(value) => setSelectedProducts([value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chicken">Chicken</SelectItem>
                  <SelectItem value="Mutton">Mutton</SelectItem>
                  <SelectItem value="Fish">Fish</SelectItem>
                  <SelectItem value="Beef">Beef</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => {
              setDateRange(null);
              setMinOrders('0');
              setMinAmount('0');
              setSelectedProducts([]);
              setSearchTerm('');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer List</CardTitle>
          <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                disabled={selectedCustomers.length === 0}
              >
                <Gift className="h-4 w-4 mr-2" />
                Create Offer ({selectedCustomers.length} selected)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Special Offer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Offer Type</label>
                  <Select
                    value={offerType}
                    onValueChange={(value: 'percentage' | 'fixed') => setOfferType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {offerType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                  </label>
                  <div className="relative">
                    {offerType === 'fixed' && (
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    )}
                    {offerType === 'percentage' && (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    )}
                    <Input
                      type="number"
                      value={offerValue}
                      onChange={(e) => setOfferValue(e.target.value)}
                      className="pl-10"
                      placeholder={offerType === 'percentage' ? 'e.g., 10' : 'e.g., 100'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Validity (Days)</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="number"
                      value={offerValidity}
                      onChange={(e) => setOfferValidity(e.target.value)}
                      className="pl-10"
                      placeholder="Number of days"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCreateOffer}
                  disabled={!offerValue || parseInt(offerValue) <= 0}
                >
                  Create & Send Offer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === filteredCustomers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers(filteredCustomers.map(c => c.mobile));
                        } else {
                          setSelectedCustomers([]);
                        }
                      }}
                      className="h-4 w-4"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Preferred Items</TableHead>
                  <TableHead>Avg. Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.mobile}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.mobile)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers([...selectedCustomers, customer.mobile]);
                          } else {
                            setSelectedCustomers(selectedCustomers.filter(m => m !== customer.mobile));
                          }
                        }}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.mobile}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{customer.totalOrders}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{customer.totalAmount.toLocaleString('en-IN')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {customer.preferredItems.map((item, index) => (
                          <Badge key={index} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{customer.averageOrderValue.toLocaleString('en-IN')}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAnalysis;
