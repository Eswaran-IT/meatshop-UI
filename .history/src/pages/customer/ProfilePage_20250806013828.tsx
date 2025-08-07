import React, { useState, useRef, useEffect } from 'react';
// TopBar component for location, phone, and animated free delivery banner
const TopBar: React.FC = () => (
  <div className="w-full flex flex-col md:flex-row items-center justify-between bg-white border-b border-gray-200 px-2 md:px-8 py-1 relative overflow-hidden">
    <div className="flex items-center gap-4 text-xs md:text-sm">
      <a
        href="https://www.google.com/maps/search/?api=1&query=Mumbai%2C%20Maharashtra"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-600 flex items-center gap-1"
        title="Open in Google Maps"
      >
        Mumbai, Maharashtra
      </a>
      <span className="hidden md:inline-block">|</span>
      <a
        href="tel:+919876543210"
        className="hover:underline text-blue-600 flex items-center gap-1"
        title="Call now"
      >
        +91 9876543210
      </a>
    </div>
    <div className="relative w-full md:w-auto flex-1 flex justify-center md:justify-end mt-1 md:mt-0">
      <div
        className="bg-white text-red-600 font-semibold px-4 py-1 rounded shadow animate-slide-in-right whitespace-nowrap border border-red-200"
        style={{
          animation: 'slide-in-right 1.2s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        Free Delivery on Orders Above ₹500!
      </div>
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  </div>
);
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Phone, 
  MapPin, 
  Heart, 
  Bell, 
  Shield,
  CreditCard,
  Gift,
  Edit,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  
  // Create a ref for the address form
  const addressFormRef = useRef<HTMLDivElement>(null);
  
  // Scroll to form when it becomes visible AND should scroll is true
  useEffect(() => {
    if (showAddressForm && addressFormRef.current && shouldScroll) {
      setTimeout(() => {
        addressFormRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Reset scroll flag after scrolling
        setShouldScroll(false);
      }, 100); // Small delay to ensure the form is rendered
    }
  }, [showAddressForm, shouldScroll]);

  // Mock user data
  const [profile, setProfile] = useState({
    name: 'John Doe', // Default name since MockAuth doesn't store name
    email: 'john.doe@example.com',
    phone: user?.mobile || '9876543210', // Read-only mobile number
    dateOfBirth: '1990-01-15',
    anniversary: '2020-06-20'
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      line1: '123 Main Street, Apartment 4B',
      line2: 'Near Central Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
  ]);

  // Preferences state (mock)
  const [preferences, setPreferences] = useState({
    orderNotifications: true,
    promotionalEmails: false,
    smsNotifications: true,
    whatsappUpdates: false
  });

  // Address form state (mock)
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    type: 'home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Address form handlers (mock)
  const addAddress = () => {};
  const updateAddress = () => {};
  const cancelAddressEdit = () => {};

  return (
    <>
      <TopBar />
      <div className="container mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Addresses Card (mock, just to show structure) */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <CardTitle>My Addresses</CardTitle>
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => setShowAddressForm(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add New
                  </Button>
                </div>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Address list (mock) */}
                {addresses.map(addr => (
                  <div key={addr.id} className="mb-4 p-3 border rounded flex flex-col md:flex-row md:items-center gap-2">
                    <div className="flex-1">
                      <div className="font-semibold">{addr.type.toUpperCase()}</div>
                      <div className="text-sm">{addr.line1}{addr.line2 && `, ${addr.line2}`}, {addr.city}, {addr.state} - {addr.pincode}</div>
                      {addr.isDefault && <Badge variant="default" className="mt-1">Default</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {}}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => {}}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                {/* Address form (mock, just to show structure) */}
                {showAddressForm && (
                  <div ref={addressFormRef} className="p-4 border rounded mt-4 bg-gray-50">
                    <div className="mb-2">
                      <Label htmlFor="line1">Address Line 1</Label>
                      <Input id="line1" value={newAddress.line1} onChange={e => setNewAddress(prev => ({ ...prev, line1: e.target.value }))} />
                    </div>
                    <div className="mb-2">
                      <Label htmlFor="line2">Address Line 2</Label>
                      <Input id="line2" value={newAddress.line2} onChange={e => setNewAddress(prev => ({ ...prev, line2: e.target.value }))} />
                    </div>
                    <div className="mb-2 flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={newAddress.city} onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))} />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={newAddress.state} onChange={e => setNewAddress(prev => ({ ...prev, state: e.target.value }))} />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" value={newAddress.pincode} onChange={e => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={e => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isDefault" className="text-sm">Set as default address</Label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={editingAddress ? updateAddress : addAddress}
                        disabled={!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode}
                        className="text-sm"
                      >
                        {editingAddress ? 'Update Address' : 'Add Address'}
                      </Button>
                      <Button variant="outline" onClick={cancelAddressEdit} className="text-sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>
                  Choose how you want to receive updates about your orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderNotifs">Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about order status updates</p>
                    </div>
                    <input
                      id="orderNotifs"
                      type="checkbox"
                      checked={preferences.orderNotifications}
                      onChange={e => setPreferences(prev => ({ ...prev, orderNotifications: e.target.checked }))}
                      className="toggle"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promoEmails">Promotional Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive offers and deals via email</p>
                    </div>
                    <input
                      id="promoEmails"
                      type="checkbox"
                      checked={preferences.promotionalEmails}
                      onChange={e => setPreferences(prev => ({ ...prev, promotionalEmails: e.target.checked }))}
                      className="toggle"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifs">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get order updates via SMS</p>
                    </div>
                    <input
                      id="smsNotifs"
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={e => setPreferences(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      className="toggle"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="whatsappUpdates">WhatsApp Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates on WhatsApp</p>
                    </div>
                    <input
                      id="whatsappUpdates"
                      type="checkbox"
                      checked={preferences.whatsappUpdates}
                      onChange={e => setPreferences(prev => ({ ...prev, whatsappUpdates: e.target.checked }))}
                      className="toggle"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:order-last order-first space-y-4 md:space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg md:text-xl">Account Summary</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive text-xs md:text-sm"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{profile.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{profile.phone}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span>12</span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Total Savings</span>
                    <span className="text-primary font-medium">₹2,450</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;