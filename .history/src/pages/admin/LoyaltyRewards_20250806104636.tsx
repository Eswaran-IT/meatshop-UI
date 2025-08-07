import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoyaltyRewards: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Order Data Filtering & Offer Creation</CardTitle>
          <CardDescription>Filter customers and create/send loyalty offers</CardDescription>
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

export default LoyaltyRewards;
