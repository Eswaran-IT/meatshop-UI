import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Meat } from '@/types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
const mockMeats: Meat[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    description: 'Boneless chicken breast, perfect for grilling',
    pricePerKg: 500, // Fixed price
    minKg: 0.5,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    categoryId: '1',
    inStock: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Mutton Leg',
    description: 'Fresh mutton leg, ideal for curries',
    pricePerKg: 500, // Fixed price
    minKg: 1,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    categoryId: '2',
    inStock: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Fish Fillet',
    description: 'Fresh fish fillet, ready to cook',
    pricePerKg: 420, // Keep original for fish
    minKg: 0.5,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    categoryId: '3',
    inStock: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Beef Steak',
    description: 'Premium beef steak cuts',
    pricePerKg: 500, // Fixed price
    minKg: 0.5,
    image: 'https://images.unsplash.com/photo-1588347818113-0c3d626ca2db?w=400',
    categoryId: '4',
    inStock: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface MeatFormData {
  name: string;
  description: string;
  pricePerKg: number;
  minKg: number;
  image: string;
  categoryId: string;
  inStock: boolean;
}

const ManageMeats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [meats, setMeats] = useState<Meat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMeats, setFilteredMeats] = useState<Meat[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeat, setEditingMeat] = useState<Meat | null>(null);
  const { toast } = useToast();
  const form = useForm<MeatFormData>();

  useEffect(() => {
    // Simulate API loading
    const loadMeats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMeats(mockMeats);
      setFilteredMeats(mockMeats);
      setLoading(false);
    };
    loadMeats();
  }, []);

  useEffect(() => {
    const filtered = meats.filter(meat =>
      meat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMeats(filtered);
  }, [searchTerm, meats]);

  const onSubmit = (data: MeatFormData) => {
    if (editingMeat) {
      setMeats(prev => prev.map(meat =>
        meat.id === editingMeat.id
          ? { ...meat, ...data }
          : meat
      ));
      toast({
        title: "Meat Updated",
        description: `${data.name} has been updated successfully`,
      });
    } else {
      const newMeat: Meat = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMeats(prev => [...prev, newMeat]);
      toast({
        title: "Meat Added",
        description: `${data.name} has been added successfully`,
      });
    }
    setDialogOpen(false);
    setEditingMeat(null);
    form.reset();
  };

  const handleEdit = (meat: Meat) => {
    setEditingMeat(meat);
    form.reset({
      name: meat.name,
      description: meat.description,
      pricePerKg: meat.pricePerKg,
      minKg: meat.minKg,
      image: meat.image,
      categoryId: meat.categoryId,
      inStock: meat.inStock,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingMeat(null);
    form.reset({
      name: '',
      description: '',
      pricePerKg: 0,
      minKg: 0.5,
      image: '',
      categoryId: '',
      inStock: true,
    });
    setDialogOpen(true);
  };

  const handleToggleStock = (id: string) => {
    setMeats(prev => prev.map(meat =>
      meat.id === id ? { ...meat, inStock: !meat.inStock } : meat
    ));
    toast({
      title: "Stock Status Updated",
      description: "Meat stock status has been updated successfully",
    });
  };

  const handleDeleteMeat = (id: string, name: string) => {
    setMeats(prev => prev.filter(meat => meat.id !== id));
    toast({
      title: "Meat Deleted",
      description: `${name} has been deleted successfully`,
    });
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
          <h1 className="text-3xl font-bold tracking-tight">Manage Meats</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your meat inventory
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="meat" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Meat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMeat ? 'Edit Meat' : 'Add New Meat'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meat Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Chicken Breast" {...field} />
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
                        <Input placeholder="Describe this meat..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerKg"
                  rules={{ required: "Price is required", min: { value: 1, message: "Price must be greater than 0" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Kg (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="280" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minKg"
                  rules={{ required: "Min weight is required", min: { value: 0.1, message: "Min weight must be at least 0.1kg" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.5" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  rules={{ required: "Image URL is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  rules={{ required: "Category ID is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category ID</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>In Stock</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="meat" className="flex-1">
                    {editingMeat ? 'Update' : 'Add'} Meat
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
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
            <div className="text-2xl font-bold">{meats.length}</div>
            <p className="text-xs text-muted-foreground">Total Meats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {meats.filter(m => m.inStock).length}
            </div>
            <p className="text-xs text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">
              {meats.filter(m => !m.inStock).length}
            </div>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ₹{Math.round(meats.reduce((avg, meat) => avg + meat.pricePerKg, 0) / meats.length)}
            </div>
            <p className="text-xs text-muted-foreground">Avg Price/kg</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Meat Inventory</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search meats..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Price/kg</TableHead>
                  <TableHead>Min Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeats.map((meat) => (
                  <TableRow key={meat.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={meat.image} 
                          alt={meat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{meat.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {meat.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">₹{meat.pricePerKg}</span>
                    </TableCell>
                    <TableCell>
                      {meat.minKg}kg
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={meat.inStock ? "default" : "destructive"}
                        className={`cursor-pointer ${meat.inStock ? 'bg-success text-success-foreground' : ''}`}
                        onClick={() => handleToggleStock(meat.id)}
                      >
                        {meat.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Category {meat.categoryId}
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
                          <DropdownMenuItem onClick={() => handleEdit(meat)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStock(meat.id)}
                          >
                            <Badge className="h-4 w-4 mr-2" />
                            Toggle Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMeat(meat.id, meat.name)}
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
          
          {filteredMeats.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No meats found matching your search.' : 'No meats added yet.'}
              </p>
              {!searchTerm && (
                <Button variant="meat" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Meat
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageMeats;