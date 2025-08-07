
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Order } from '@/types';

// Mock coupon offers
const mockCoupons = [
  { code: 'LOYAL10', title: '10% Off for Loyal Customers', desc: 'Get 10% off on your next order. Use code LOYAL10 at checkout.' },
  { code: 'FREESHIP', title: 'Free Shipping', desc: 'Enjoy free shipping on orders above ₹500. Use code FREESHIP.' },
  { code: 'COMBO20', title: '20% Off on Combos', desc: 'Save 20% on combo packs. Use code COMBO20.' },
];

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
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [days, setDays] = useState('');
  const [orderCount, setOrderCount] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allFilteredIds = filteredOrders.map(o => o.id);
  const allSelected = selectedIds.length === filteredOrders.length && filteredOrders.length > 0;

  // Live filtering: update filteredOrders as filter values change
  useEffect(() => {
    let filtered = orders;
    if (number) {
      filtered = filtered.filter(order => order.customerMobile.includes(number));
    }
    if (name) {
      const s = name.toLowerCase();
      filtered = filtered.filter(order => order.customerName.toLowerCase().includes(s));
    }
    if (amount) {
      const match = amount.match(/([<>]=?)\s*(\d+)/);
      if (match) {
        const op = match[1], val = parseInt(match[2]);
        filtered = filtered.filter(order => {
          if (op === '>') return order.totalAmount > val;
          if (op === '>=') return order.totalAmount >= val;
          if (op === '<') return order.totalAmount < val;
          if (op === '<=') return order.totalAmount <= val;
          if (op === '=') return order.totalAmount === val;
          return true;
        });
      }
    }
    if (category) {
      filtered = filtered.filter(order =>
        order.items.some(i => i.meatName.toLowerCase().includes(category.toLowerCase()))
      );
    }
    if (days) {
      const n = parseInt(days);
      if (!isNaN(n)) {
        const since = new Date();
        since.setDate(since.getDate() - n);
        filtered = filtered.filter(order => new Date(order.orderDate) >= since);
      }
    }
    if (orderCount) {
      const match = orderCount.match(/([<>]=?)\s*(\d+)/);
      if (match) {
        const op = match[1], val = parseInt(match[2]);
        filtered = filtered.filter(order => {
          const count = orders.filter(o => o.customerId === order.customerId).length;
          if (op === '>') return count > val;
          if (op === '>=') return count >= val;
          if (op === '<') return count < val;
          if (op === '<=') return count <= val;
          if (op === '=') return count === val;
          return true;
        });
      }
    }
    setFilteredOrders(filtered);
    setSelectedIds(filtered.map(o => o.id));
  }, [orders, number, name, amount, category, days, orderCount]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? allFilteredIds : []);
  };
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter(i => i !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>All Orders & Loyalty Offer Creation</CardTitle>
          <CardDescription>Filter orders by customer name or number and create/send loyalty offers</CardDescription>
        </CardHeader>
        <CardContent>

          {/* Filtering UI (all options as separate fields, 5x2 grid, live filter) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Customer Number</label>
              <Input placeholder="Enter mobile number" className="w-full" value={number} onChange={e => setNumber(e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Customer Name</label>
              <Input placeholder="Enter name" className="w-full" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Amount Greater Than</label>
              <Input placeholder=">1000" className="w-full" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select className="w-full border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All</option>
                <option value="Chicken">Chicken</option>
                <option value="Mutton">Mutton</option>
                <option value="Fish">Fish</option>
                <option value="Beef">Beef</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Past How Many Days</label>
              <Input type="number" min="1" placeholder="e.g. 7" className="w-full" value={days} onChange={e => setDays(e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Order Count</label>
              <Input placeholder=">2" className="w-full" value={orderCount} onChange={e => setOrderCount(e.target.value)} />
            </div>
          </div>


          {/* Orders Table (always shows all orders, borderless except row lines) */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Customer Name</th>
                  <th className="p-2">Mobile</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total (₹)</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">{order.customerMobile}</td>
                    <td className="p-2">{order.items.map(i => i.meatName).join(', ')}</td>
                    <td className="p-2">{order.totalAmount}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="text-center text-muted-foreground py-8">No orders found.</div>}
          </div>


          {/* Offer Creation UI (for filtered customers only, select all/individual, no discount type select) */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Create Loyalty Offer for Filtered Customers</h4>
            <div className="border rounded p-3 mb-4 max-h-40 overflow-y-auto">
              {filteredOrders.length === 0 && <div className="text-muted-foreground">No customers match the filter.</div>}
              {filteredOrders.length > 0 && (
                <label className="flex items-center gap-2 mb-2 font-medium">
                  <input type="checkbox" checked={allSelected} onChange={e => handleSelectAll(e.target.checked)} /> Select All
                </label>
              )}
              {filteredOrders.map(order => (
                <label key={order.id} className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={e => handleSelectOne(order.id, e.target.checked)} /> {order.customerName} ({order.customerMobile})
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input placeholder="Discount Value (e.g. 10 or 100)" className="w-full" />
              <Input placeholder="Offer Validity (e.g. 7 days)" className="w-full" />
            </div>
            <Button className="w-full md:w-auto" variant="success">Send Offer to Selected Customers</Button>
          </div>

          {/* Coupon Offers Section */}
          <div className="mt-8">
            <h4 className="font-semibold mb-4">Available Coupon Offers</h4>
            <div className="flex flex-wrap gap-6">
              {mockCoupons.map(coupon => (
                <Card key={coupon.code} className="max-w-xs flex-1 border border-gray-200 shadow-md">
                  <CardContent className="p-4 flex flex-col h-full justify-between">
                    <div>
                      <h5 className="font-bold text-lg mb-2 text-red-700">{coupon.title}</h5>
                      <p className="text-gray-600 mb-2">{coupon.desc}</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 text-white mt-2 w-full" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                      Copy Code: <span className="font-mono ml-2">{coupon.code}</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
