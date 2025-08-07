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
    {
      id: '2',
      type: 'work',
      line1: '456 Business Park, Tower A',
      line2: 'Floor 10, Office 1001',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false
    }
  ]);

  const [preferences, setPreferences] = useState({
    orderNotifications: true,
    promotionalEmails: false,
    smsNotifications: true,
    whatsappUpdates: true
  });

  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const saveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        position: "top-center"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        position: "top-center"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({
      title: "Address Deleted",
      description: "Address has been removed from your account.",
      position: "top-center"
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
    toast({
      title: "Default Address Updated",
      description: "Your default delivery address has been updated.",
      position: "top-center"
    });
  };

  const addAddress = () => {
    const id = Date.now().toString();
    setAddresses(prev => [...prev, { ...newAddress, id }]);
    setNewAddress({
      type: 'home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowAddressForm(false);
    toast({
      title: "Address Added",
      description: "New address has been added to your account.",
      position: "top-center"
    });
  };

  const editAddress = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      // First set the values
      setNewAddress(address);
      setEditingAddress(addressId);
      
      // Then show the form and set scroll flag to true to trigger scroll effect
      setShouldScroll(true);
      setShowAddressForm(true);
    }
  };

  const updateAddress = () => {
    if (editingAddress) {
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === editingAddress 
            ? { ...newAddress, id: editingAddress }
            : addr
        )
      );
      setEditingAddress(null);
      setNewAddress({
        type: 'home',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      setShowAddressForm(false);
      toast({
        title: "Address Updated",
        description: "Address has been updated successfully.",
        position: "top-center"
      });
    }
  };

  const cancelAddressEdit = () => {
    setEditingAddress(null);
    setNewAddress({
      type: 'home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowAddressForm(false);
  };

  return (
    <React.Fragment>
      <TopBar />
      <div className="container mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => editingProfile ? saveProfile() : setEditingProfile(true)}
                  disabled={loading}
                  className="text-xs md:text-sm"
                >
                  {editingProfile ? (
                    <>
                      <Save className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editingProfile}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editingProfile}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    disabled
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Phone number cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!editingProfile}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="anniversary" className="text-sm">Anniversary (Optional)</Label>
                  <Input
                    id="anniversary"
                    type="date"
                    value={profile.anniversary}
                    onChange={(e) => setProfile(prev => ({ ...prev, anniversary: e.target.value }))}
                    disabled={!editingProfile}
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Addresses */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  <CardTitle className="text-lg md:text-xl">Delivery Addresses</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  console.log('Add Address clicked');
                  setEditingAddress(null); // Ensure we're in "add" mode, not "edit" mode
                  setNewAddress({
                    type: 'home',
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    isDefault: false
                  });
                  setShouldScroll(true);
                  setShowAddressForm(true);
                }} className="text-xs md:text-sm">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-3 md:p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={address.type === 'home' ? 'default' : 'outline'} className="text-xs">
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </Badge>
                      {address.isDefault && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => editAddress(address.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteAddress(address.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{address.line1}</p>
                    {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>

                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                      className="text-xs"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              ))}

              {/* Address Form */}
              {(() => { console.log('Rendering address section, showAddressForm:', showAddressForm); return null; })()}
              {showAddressForm && (
                <div ref={addressFormRef} className="border-2 border-primary/50 rounded-lg p-3 md:p-4 space-y-4 bg-primary/5 shadow-md animate-in fade-in">
                  {(() => { console.log('Form is rendering!'); return null; })()}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm md:text-base text-primary">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={cancelAddressEdit} className="h-8 w-8 p-0">
                      ×
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressType" className="text-sm">Address Type</Label>
                      <select
                        id="addressType"
                        value={newAddress.type}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as Address['type'] }))}
                        className="w-full p-2 text-sm border rounded-md bg-background"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-sm">Pincode</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                        placeholder="400001"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="line1" className="text-sm">Address Line 1</Label>
                      <Input
                        id="line1"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                        placeholder="House/Flat No., Building Name, Street"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="line2" className="text-sm">Address Line 2 (Optional)</Label>
                      <Input
                        id="line2"
                        value={newAddress.line2}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                        placeholder="Area, Landmark"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm">State</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Maharashtra"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
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
                    onChange={(e) => setPreferences(prev => ({ ...prev, orderNotifications: e.target.checked }))}
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
                    onChange={(e) => setPreferences(prev => ({ ...prev, promotionalEmails: e.target.checked }))}
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
                    onChange={(e) => setPreferences(prev => ({ ...prev, smsNotifications: e.target.checked }))}
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
                    onChange={(e) => setPreferences(prev => ({ ...prev, whatsappUpdates: e.target.checked }))}
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
      </div>
    </React.Fragment>
};

export default ProfilePage;