import React, { useState, useRef, useEffect } from 'react';
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
  Bell, 
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
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Create a ref for the address form
  const addressFormRef = useRef<HTMLDivElement>(null);

  // Mock user data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: user?.mobile || '9876543210',
    dateOfBirth: '1990-01-15',
    anniversary: '2020-06-20'
  });

  // Addresses state
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'HOME',
      address: '123 Main Street, Apartment 4B, Near Central Mall, Mumbai, Maharashtra - 400001',
      isDefault: true
    }
  ]);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    type: 'HOME',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Auto-scroll to form when it becomes visible
  useEffect(() => {
    if (showAddressForm && addressFormRef.current) {
      setTimeout(() => {
        addressFormRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100); // Small delay to ensure the form is rendered
    }
  }, [showAddressForm]);

  // Reset form when editing changes
  useEffect(() => {
    if (editingAddressId) {
      const addressToEdit = addresses.find(addr => addr.id === editingAddressId);
      if (addressToEdit) {
        // Parse the address back into form fields
        const addressParts = addressToEdit.address.split(', ');
        const line1 = addressParts[0] || '';
        const line2 = addressParts[1] && !addressParts[1].includes('-') ? addressParts[1] : '';
        const lastPart = addressParts[addressParts.length - 1];
        const statePincode = lastPart.split(' - ');
        const state = statePincode[0] || '';
        const pincode = statePincode[1] || '';
        const city = addressParts[addressParts.length - 2] || '';

        setNewAddress({
          type: addressToEdit.type,
          line1,
          line2,
          city,
          state,
          pincode,
          isDefault: addressToEdit.isDefault
        });
      }
    }
  }, [editingAddressId, addresses]);

  // Profile edit handlers
  const [profileDraft, setProfileDraft] = useState(profile);
  const handleProfileEdit = () => {
    setProfileDraft(profile);
    setEditingProfile(true);
  };
  const handleProfileCancel = () => {
    setEditingProfile(false);
    setProfileDraft(profile);
  };
  const handleProfileSave = () => {
    setProfile(profileDraft);
    setEditingProfile(false);
    toast({ title: 'Profile updated successfully!', duration: 3000 });
  };

  // Address handlers
  const handleAddAddress = () => {
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast({ title: 'Please fill all required fields', duration: 3000 });
      return;
    }

    const fullAddress = `${newAddress.line1}${newAddress.line2 ? ', ' + newAddress.line2 : ''}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}`;
    
    const addressToAdd = {
      id: Date.now().toString(),
      type: newAddress.type,
      address: fullAddress,
      isDefault: newAddress.isDefault
    };

    setAddresses(prev => [...prev, addressToAdd]);
    setNewAddress({
      type: 'HOME',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowAddressForm(false);
    toast({ title: 'Address added successfully!', duration: 3000 });
  };

  const handleCancelAddress = () => {
    setNewAddress({
      type: 'HOME',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({ title: 'Address deleted successfully!', duration: 3000 });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Details</CardTitle>
                {!editingProfile && (
                  <Button size="sm" variant="outline" className="ml-auto" onClick={handleProfileEdit}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>
              <CardDescription>View and edit your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); handleProfileSave(); }}>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={profileDraft.name} onChange={e => setProfileDraft(prev => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileDraft.email} onChange={e => setProfileDraft(prev => ({ ...prev, email: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" value={profileDraft.phone} disabled />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={profileDraft.dateOfBirth} onChange={e => setProfileDraft(prev => ({ ...prev, dateOfBirth: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="anniv">Anniversary</Label>
                    <Input id="anniv" type="date" value={profileDraft.anniversary} onChange={e => setProfileDraft(prev => ({ ...prev, anniversary: e.target.value }))} />
                  </div>
                  <div className="flex gap-2 col-span-1 md:col-span-2 mt-2">
                    <Button type="submit" className="text-sm"><Save className="h-4 w-4 mr-1" /> Save</Button>
                    <Button type="button" variant="outline" className="text-sm" onClick={handleProfileCancel}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Name:</span>
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email:</span>
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Mobile:</span>
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Date of Birth:</span>
                    <span>{profile.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Anniversary:</span>
                    <span>{profile.anniversary}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>My Addresses</CardTitle>
                <Button size="sm" variant="outline" className="ml-auto" onClick={handleAddAddress}>
                  <Plus className="h-4 w-4 mr-1" /> Add New
                </Button>
              </div>
              <CardDescription>Manage your delivery addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{addr.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {addr.address}
                        </div>
                        {addr.isDefault && <Badge variant="default" className="mt-2">Default</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteAddress(addr.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {showAddressForm && (
                  <div ref={addressFormRef} className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-4">Add New Address</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="addressType">Address Type</Label>
                        <select 
                          id="addressType"
                          className="w-full p-2 border rounded"
                          value={newAddress.type}
                          onChange={e => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                        >
                          <option value="HOME">Home</option>
                          <option value="WORK">Work</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="line1">Address Line 1 *</Label>
                        <Input 
                          id="line1"
                          placeholder="Street address, apartment, suite, unit, building, floor, etc."
                          value={newAddress.line1}
                          onChange={e => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="line2">Address Line 2</Label>
                        <Input 
                          id="line2"
                          placeholder="Landmark, nearby location (optional)"
                          value={newAddress.line2}
                          onChange={e => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input 
                            id="city"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={e => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input 
                            id="pincode"
                            placeholder="Pincode"
                            value={newAddress.pincode}
                            onChange={e => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onChange={e => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="isDefault" className="text-sm">Set as default address</Label>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveAddress} className="flex-1">
                          Save Address
                        </Button>
                        <Button variant="outline" onClick={handleCancelAddress} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                    defaultChecked
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
                    defaultChecked
                    className="toggle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:order-last order-first space-y-6">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg">Account Summary</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;