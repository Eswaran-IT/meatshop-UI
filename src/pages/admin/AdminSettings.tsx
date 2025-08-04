import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  IndianRupee, 
  Percent, 
  Truck, 
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Bell,
  Palette
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Shop Settings
  const [shopSettings, setShopSettings] = useState({
    name: 'MeatShop Premium',
    phone: '+91 98765 43210',
    email: 'admin@meatshop.com',
    address: '123 Market Street, Food Zone, Mumbai - 400001',
    website: 'www.meatshop.com',
    gstNumber: '27AAAAA0000A1Z5',
    panNumber: 'AAAAA0000A'
  });

  // Pricing Settings
  const [pricingSettings, setPricingSettings] = useState({
    gstRate: 12,
    deliveryCharges: 50,
    freeDeliveryAbove: 500,
    packagingCharges: 25,
    minimumOrderAmount: 300
  });

  // Delivery Settings
  const [deliverySettings, setDeliverySettings] = useState({
    maxDeliveryDistance: 25,
    estimatedDeliveryTime: 60,
    emergencyDeliveryCharges: 100,
    deliverySlots: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM']
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockAlerts: true,
    dailyReports: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSave = async (section: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your shop configuration, pricing, and system preferences.
        </p>
      </div>

      {/* Shop Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Shop Information</CardTitle>
          </div>
          <CardDescription>
            Basic information about your meat shop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopSettings.name}
                onChange={(e) => setShopSettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={shopSettings.phone}
                onChange={(e) => setShopSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={shopSettings.email}
                onChange={(e) => setShopSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={shopSettings.website}
                onChange={(e) => setShopSettings(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input
                id="gst"
                value={shopSettings.gstNumber}
                onChange={(e) => setShopSettings(prev => ({ ...prev, gstNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                value={shopSettings.panNumber}
                onChange={(e) => setShopSettings(prev => ({ ...prev, panNumber: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Complete Address</Label>
            <Input
              id="address"
              value={shopSettings.address}
              onChange={(e) => setShopSettings(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <Button onClick={() => handleSave('Shop Information')} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Shop Info
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            <CardTitle>Pricing Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure taxes, delivery charges, and minimum order amounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="gstRate"
                  type="number"
                  className="pl-10"
                  value={pricingSettings.gstRate}
                  onChange={(e) => setPricingSettings(prev => ({ ...prev, gstRate: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryCharges">Delivery Charges (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="deliveryCharges"
                  type="number"
                  className="pl-10"
                  value={pricingSettings.deliveryCharges}
                  onChange={(e) => setPricingSettings(prev => ({ ...prev, deliveryCharges: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeDelivery">Free Delivery Above (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="freeDelivery"
                  type="number"
                  className="pl-10"
                  value={pricingSettings.freeDeliveryAbove}
                  onChange={(e) => setPricingSettings(prev => ({ ...prev, freeDeliveryAbove: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="packaging">Packaging Charges (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="packaging"
                  type="number"
                  className="pl-10"
                  value={pricingSettings.packagingCharges}
                  onChange={(e) => setPricingSettings(prev => ({ ...prev, packagingCharges: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrder">Minimum Order (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="minOrder"
                  type="number"
                  className="pl-10"
                  value={pricingSettings.minimumOrderAmount}
                  onChange={(e) => setPricingSettings(prev => ({ ...prev, minimumOrderAmount: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          <Button onClick={() => handleSave('Pricing Configuration')} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Pricing
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            <CardTitle>Delivery Settings</CardTitle>
          </div>
          <CardDescription>
            Configure delivery zones, timing, and charges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxDistance">Max Delivery Distance (km)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="maxDistance"
                  type="number"
                  className="pl-10"
                  value={deliverySettings.maxDeliveryDistance}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, maxDeliveryDistance: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Est. Delivery Time (min)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="deliveryTime"
                  type="number"
                  className="pl-10"
                  value={deliverySettings.estimatedDeliveryTime}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, estimatedDeliveryTime: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyCharges">Emergency Delivery (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emergencyCharges"
                  type="number"
                  className="pl-10"
                  value={deliverySettings.emergencyDeliveryCharges}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, emergencyDeliveryCharges: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Time Slots</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {deliverySettings.deliverySlots.map((slot, index) => (
                <Badge key={index} variant="outline" className="justify-center py-2">
                  {slot}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={() => handleSave('Delivery Settings')} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Delivery
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>
            Configure when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderNotifs">Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about new orders</p>
              </div>
              <input
                id="orderNotifs"
                type="checkbox"
                checked={notificationSettings.orderNotifications}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, orderNotifications: e.target.checked }))}
                className="toggle"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stockAlerts">Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert when inventory is low</p>
              </div>
              <input
                id="stockAlerts"
                type="checkbox"
                checked={notificationSettings.lowStockAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, lowStockAlerts: e.target.checked }))}
                className="toggle"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dailyReports">Daily Reports</Label>
                <p className="text-sm text-muted-foreground">Receive daily sales reports</p>
              </div>
              <input
                id="dailyReports"
                type="checkbox"
                checked={notificationSettings.dailyReports}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, dailyReports: e.target.checked }))}
                className="toggle"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifs">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <input
                id="emailNotifs"
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="toggle"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifs">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
              </div>
              <input
                id="smsNotifs"
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                className="toggle"
              />
            </div>
          </div>

          <Button onClick={() => handleSave('Notification Settings')} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;