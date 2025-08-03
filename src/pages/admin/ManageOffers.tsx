import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Offer } from '@/types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  MoreVertical,
  Percent,
  Calendar,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';

// Mock data
const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Weekend Special',
    description: '20% off on all chicken products this weekend',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    type: 'discount',
    value: 20,
    validFrom: '2024-03-01',
    validTo: '2024-03-03',
    isActive: true,
    items: ['1', '2']
  },
  {
    id: '2',
    title: 'Family Combo',
    description: 'Chicken + Mutton combo pack at special price',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    type: 'combo',
    value: 1999,
    validFrom: '2024-03-01',
    validTo: '2024-03-31',
    isActive: true,
    items: ['1', '2', '3']
  },
  {
    id: '3',
    title: 'Fish Friday',
    description: 'Special discount on fresh fish every Friday',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    type: 'special',
    value: 15,
    validFrom: '2024-03-01',
    validTo: '2024-03-29',
    isActive: false,
    items: ['4']
  }
];

interface OfferFormData {
  title: string;
  description: string;
  image: string;
  type: 'discount' | 'combo' | 'special';
  value: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  items: string[];
}

const ManageOffers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  
  const { toast } = useToast();
  const form = useForm<OfferFormData>();

  useEffect(() => {
    // Simulate API loading
    const loadOffers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOffers(mockOffers);
      setFilteredOffers(mockOffers);
      setLoading(false);
    };

    loadOffers();
  }, []);

  useEffect(() => {
    const filtered = offers.filter(offer =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOffers(filtered);
  }, [searchTerm, offers]);

  const onSubmit = (data: OfferFormData) => {
    if (editingOffer) {
      // Update existing offer
      setOffers(prev => prev.map(offer =>
        offer.id === editingOffer.id 
          ? { ...offer, ...data }
          : offer
      ));
      toast({
        title: "Offer Updated",
        description: `${data.title} has been updated successfully`,
      });
    } else {
      // Add new offer
      const newOffer: Offer = {
        id: Date.now().toString(),
        ...data
      };
      setOffers(prev => [...prev, newOffer]);
      toast({
        title: "Offer Added",
        description: `${data.title} has been added successfully`,
      });
    }
    
    setDialogOpen(false);
    setEditingOffer(null);
    form.reset();
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    form.reset({
      title: offer.title,
      description: offer.description,
      image: offer.image,
      type: offer.type,
      value: offer.value,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      isActive: offer.isActive,
      items: offer.items || []
    });
    setDialogOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setOffers(prev => prev.map(offer =>
      offer.id === id ? { ...offer, isActive: !offer.isActive } : offer
    ));
    toast({
      title: "Offer Status Updated",
      description: "Offer status has been updated successfully",
    });
  };

  const handleDelete = (id: string, title: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
    toast({
      title: "Offer Deleted",
      description: `${title} has been deleted successfully`,
    });
  };

  const openAddDialog = () => {
    setEditingOffer(null);
    form.reset({
      title: '',
      description: '',
      image: '',
      type: 'discount',
      value: 0,
      validFrom: '',
      validTo: '',
      isActive: true,
      items: []
    });
    setDialogOpen(true);
  };

  const getOfferTypeColor = (type: string) => {
    switch (type) {
      case 'discount': return 'bg-green-100 text-green-800';
      case 'combo': return 'bg-blue-100 text-blue-800';
      case 'special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOfferValue = (offer: Offer) => {
    if (offer.type === 'discount' || offer.type === 'special') {
      return `${offer.value}% OFF`;
    }
    return `₹${offer.value}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Offers & Combos</h1>
          <p className="text-muted-foreground">
            Create and manage special offers, discounts, and combo deals
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="meat" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Weekend Special" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe this offer..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select offer type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="discount">Percentage Discount</SelectItem>
                          <SelectItem value="combo">Fixed Price Combo</SelectItem>
                          <SelectItem value="special">Special Offer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="value"
                  rules={{ required: "Value is required", min: { value: 1, message: "Value must be greater than 0" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch('type') === 'combo' ? 'Fixed Price (₹)' : 'Discount Percentage (%)'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder={form.watch('type') === 'combo' ? "1999" : "20"}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="validFrom"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid From</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validTo"
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid To</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image"
                  rules={{ required: "Image URL is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Active Status</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="meat" className="flex-1">
                    {editingOffer ? 'Update' : 'Add'} Offer
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{offers.length}</div>
            <p className="text-xs text-muted-foreground">Total Offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {offers.filter(o => o.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {offers.filter(o => o.type === 'combo').length}
            </div>
            <p className="text-xs text-muted-foreground">Combo Deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {offers.filter(o => o.type === 'discount').length}
            </div>
            <p className="text-xs text-muted-foreground">Discounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Offers & Combos</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={offer.image} 
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{offer.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {offer.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getOfferTypeColor(offer.type)}>
                        {offer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{getOfferValue(offer)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(offer.validFrom).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          to {new Date(offer.validTo).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={offer.isActive ? "default" : "secondary"}
                        className={`cursor-pointer ${offer.isActive ? 'bg-success text-success-foreground' : ''}`}
                        onClick={() => handleToggleStatus(offer.id)}
                      >
                        {offer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(offer)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(offer.id)}
                          >
                            <Switch className="h-4 w-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(offer.id, offer.title)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOffers.length === 0 && (
            <div className="text-center py-8">
              <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                {searchTerm ? 'No offers found matching your search.' : 'No offers added yet.'}
              </p>
              {!searchTerm && (
                <Button variant="meat" onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Offer
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageOffers;