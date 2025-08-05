import React, { useState } from 'react';
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

  // Mock user data
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: 'john.doe@example.com',
    phone: user?.mobile || '+91 98765 43210',
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

  const saveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
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
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => editingProfile ? saveProfile() : setEditingProfile(true)}
                  disabled={loading}
                >
                  {editingProfile ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Phone number cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!editingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anniversary">Anniversary (Optional)</Label>
                  <Input
                    id="anniversary"
                    type="date"
                    value={profile.anniversary}
                    onChange={(e) => setProfile(prev => ({ ...prev, anniversary: e.target.value }))}
                    disabled={!editingProfile}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Addresses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <CardTitle>Delivery Addresses</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={address.type === 'home' ? 'default' : 'outline'}>
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </Badge>
                      {address.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              ))}
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
        <div className="space-y-6">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.phone}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member Since</span>
                  <span>Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span>12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Savings</span>
                  <span className="text-primary font-medium">₹2,450</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Heart className="h-4 w-4 mr-3" />
                My Favorites
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Gift className="h-4 w-4 mr-3" />
                Loyalty Points
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <CreditCard className="h-4 w-4 mr-3" />
                Payment Methods
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Shield className="h-4 w-4 mr-3" />
                Privacy Settings
              </Button>
              <Separator />
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive" 
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;