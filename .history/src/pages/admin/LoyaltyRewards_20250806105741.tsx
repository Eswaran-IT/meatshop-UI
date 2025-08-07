
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Order } from '@/types';

// Copy mockOrders from ManageOrders (in real app, fetch from API)
const mockOrders: Order[] = [
  {
    id: 'ORD001', customerId: '1', customerName: 'John Doe', customerMobile: '+91 9876543210',
    items: [ { meatId: '1', meatName: 'Chicken Breast', price: 280, weight: 1.5, total: 420 }, { meatId: '2', meatName: 'Mutton Leg', price: 650, weight: 1, total: 650 } ],
    totalAmount: 1070, status: 'pending', orderDate: '2024-03-01T10:30:00Z', deliveryDate: '2024-03-02T18:00:00Z', deliveryAddress: '123 Main Street, Sector 14, Gurgaon, Haryana 122001', paymentMethod: 'cod', paymentStatus: 'pending'
  },
  {
    id: 'ORD002', customerId: '2', customerName: 'Jane Smith', customerMobile: '+91 8765432109',
    items: [ { meatId: '3', meatName: 'Fish Fillet', price: 420, weight: 0.8, total: 336 } ],
    totalAmount: 336, status: 'confirmed', orderDate: '2024-03-01T14:15:00Z', deliveryDate: '2024-03-03T16:00:00Z', deliveryAddress: '456 Park Avenue, Phase 2, DLF City, Gurgaon, Haryana 122002', paymentMethod: 'online', paymentStatus: 'paid'
  },
  {
    id: 'ORD003', customerId: '3', customerName: 'Mike Johnson', customerMobile: '+91 7654321098',
    items: [ { meatId: '4', meatName: 'Beef Steak', price: 750, weight: 2, total: 1500 }, { meatId: '1', meatName: 'Chicken Breast', price: 280, weight: 1, total: 280 } ],
    totalAmount: 1780, status: 'processing', orderDate: '2024-02-29T09:45:00Z', deliveryDate: '2024-03-02T20:00:00Z', deliveryAddress: '789 Golf Course Road, Sector 43, Gurgaon, Haryana 122003', paymentMethod: 'online', paymentStatus: 'paid'
  },
  {
    id: 'ORD004', customerId: '4', customerName: 'Sarah Wilson', customerMobile: '+91 6543210987',
    items: [ { meatId: '2', meatName: 'Mutton Leg', price: 650, weight: 2.5, total: 1625 } ],
    totalAmount: 1625, status: 'shipped', orderDate: '2024-02-28T16:20:00Z', deliveryDate: '2024-03-01T19:00:00Z', deliveryAddress: '321 Cyber Hub, Sector 29, Gurgaon, Haryana 122004', paymentMethod: 'cod', paymentStatus: 'pending'
  },
  {
    id: 'ORD005', customerId: '5', customerName: 'David Brown', customerMobile: '+91 5432109876',
    items: [ { meatId: '3', meatName: 'Fish Fillet', price: 420, weight: 1.2, total: 504 }, { meatId: '1', meatName: 'Chicken Breast', price: 280, weight: 0.5, total: 140 } ],
    totalAmount: 644, status: 'delivered', orderDate: '2024-02-27T11:10:00Z', deliveryDate: '2024-02-28T17:30:00Z', deliveryAddress: '654 MG Road, Sector 28, Gurgaon, Haryana 122005', paymentMethod: 'online', paymentStatus: 'paid'
  }
];

const LoyaltyRewards: React.FC = () => {

  const [orders] = useState<Order[]>(mockOrders);
  const [nameFilter, setNameFilter] = useState('');
  const [numberFilter, setNumberFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);

  // Only filter for offer creation when Apply Filters is clicked
  const handleApplyFilters = () => {
    let filtered = orders;
    if (nameFilter) {
      filtered = filtered.filter(order => order.customerName.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (numberFilter) {
      filtered = filtered.filter(order => order.customerMobile.includes(numberFilter));
    }
    setFilteredOrders(filtered);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>All Orders & Loyalty Offer Creation</CardTitle>
          <CardDescription>Filter orders by customer name or number and create/send loyalty offers</CardDescription>
        </CardHeader>
        <CardContent>

          {/* Filtering UI (does not affect table, only offer creation) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input placeholder="Filter by Customer Name" className="w-full" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
            <Input placeholder="Filter by Customer Number" className="w-full" value={numberFilter} onChange={e => setNumberFilter(e.target.value)} />
            <Button className="w-full md:col-span-2 lg:col-span-1" variant="default" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>


          {/* Orders Table (always shows all orders) */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Customer Name</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">Items</th>
                  <th className="p-2 border">Total (₹)</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{order.id}</td>
                    <td className="p-2 border">{order.customerName}</td>
                    <td className="p-2 border">{order.customerMobile}</td>
                    <td className="p-2 border">{order.items.map(i => i.meatName).join(', ')}</td>
                    <td className="p-2 border">{order.totalAmount}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="text-center text-muted-foreground py-8">No orders found.</div>}
          </div>


          {/* Offer Creation UI (for filtered customers only) */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Create Loyalty Offer for Filtered Customers</h4>
            <div className="border rounded p-3 mb-4 max-h-32 overflow-y-auto">
              {filteredOrders.length === 0 && <div className="text-muted-foreground">No customers match the filter.</div>}
              {filteredOrders.map(order => (
                <label key={order.id} className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked readOnly /> {order.customerName} ({order.customerMobile})
                </label>
              ))}
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
            <Button className="w-full md:w-auto" variant="success">Send Offer to Filtered Customers</Button>
          </div>

          {/* Offer Distribution Mechanism (placeholder) */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <span className="font-medium text-green-700">Offer will be sent to filtered customers via SMS.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyRewards;
