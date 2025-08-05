import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingCart,
  ChevronRight,
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Truck,
  ThumbsUp,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  User,
  LogOut,
  Percent,
  Package,
  Tag
} from 'lucide-react';

// Import test credentials for reference
import testCredentials from '@/lib/testCredentials';

// Real Image URLs
const heroImage = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

const categoryImages = {
  chicken: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  mutton: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  fish: 'https://images.unsplash.com/photo-1534948216015-843149f72be3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  beef: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  pork: 'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
};

const productImages = {
  chickenBreast: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  muttonCurry: 'https://images.unsplash.com/photo-1617692855027-33b14f061079?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  beef: 'https://images.unsplash.com/photo-1598514983318-2f64f55f1cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
};

// Mock data
const categories = [
  { id: '1', name: 'Chicken', image: categoryImages.chicken, count: 12, minWeight: 0.5 },
  { id: '2', name: 'Mutton', image: categoryImages.mutton, count: 8, minWeight: 0.5 },
  { id: '3', name: 'Fish', image: categoryImages.fish, count: 15, minWeight: 0.25 },
  { id: '4', name: 'Beef', image: categoryImages.beef, count: 6, minWeight: 0.5 },
  { id: '5', name: 'Pork', image: categoryImages.pork, count: 4, minWeight: 0.5 }
];

const featuredProducts = [
  {
    id: '1',
    name: 'Premium Chicken Breast',
    description: 'Boneless, skinless chicken breast pieces',
    pricePerKg: 280,
    originalPrice: 320,
    discount: 13,
    image: productImages.chickenBreast,
    rating: 4.8,
    reviews: 156,
    category: 'Chicken',
    minWeight: 0.5
  },
  {
    id: '2',
    name: 'Mutton Curry Cut',
    description: 'Fresh mutton pieces with bone',
    pricePerKg: 580,
    originalPrice: 650,
    discount: 11,
    image: productImages.muttonCurry,
    rating: 4.9,
    reviews: 124,
    category: 'Mutton',
    minWeight: 0.5
  },
  {
    id: '3',
    name: 'Fresh River Fish',
    description: 'Cleaned and ready to cook river fish',
    pricePerKg: 350,
    originalPrice: 400,
    discount: 13,
    image: productImages.fish,
    rating: 4.7,
    reviews: 98,
    category: 'Fish',
    minWeight: 0.5
  },
  {
    id: '4',
    name: 'Premium Beef Cut',
    description: 'Tender beef cuts for steak and roast',
    pricePerKg: 650,
    originalPrice: 750,
    discount: 13,
    image: productImages.beef,
    rating: 4.8,
    reviews: 86,
    category: 'Beef',
    minWeight: 0.5
  }
];

// Special offers data
const discountOffers = [
  {
    id: '1',
    code: 'NEW10',
    description: '10% off on your first order',
    minAmount: 500,
    discount: '10%',
    validUntil: '2025-12-31'
  },
  {
    id: '2',
    code: 'MEAT20',
    description: '₹200 off on orders above ₹2000',
    minAmount: 2000,
    discount: '₹200',
    validUntil: '2025-09-30'
  },
  {
    id: '3',
    code: 'WEEKEND15',
    description: '15% off on weekend orders',
    minAmount: 800,
    discount: '15%',
    validUntil: '2025-12-31'
  }
];

const comboOffers = [
  {
    id: '1',
    name: 'Family Feast Pack',
    description: 'Assorted meat combo for family gathering',
    items: [
      { name: 'Chicken Breast', weight: '1kg' },
      { name: 'Mutton Curry Cut', weight: '0.5kg' },
      { name: 'Fresh Fish', weight: '0.5kg' }
    ],
    price: 1200,
    originalPrice: 1500,
    savings: '20%',
    image: 'https://images.unsplash.com/photo-1623653318687-8fffb38ea6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '2',
    name: 'BBQ Special',
    description: 'Perfect combo for weekend barbecue',
    items: [
      { name: 'Chicken Drumsticks', weight: '0.5kg' },
      { name: 'Beef Steaks', weight: '0.5kg' },
      { name: 'Pork Ribs', weight: '0.5kg' }
    ],
    price: 950,
    originalPrice: 1100,
    savings: '13%',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
];

const branches = [
  {
    id: '1',
    name: 'Central Market Branch',
    address: '123 Market Street, Central Area',
    phone: '+91 98765 43210',
    hours: '9:00 AM - 9:00 PM',
    mapsLink: 'https://maps.google.com'
  },
  {
    id: '2',
    name: 'North City Branch',
    address: '456 North Avenue, Business District',
    phone: '+91 98765 43211',
    hours: '8:30 AM - 9:30 PM',
    mapsLink: 'https://maps.google.com'
  },
  {
    id: '3',
    name: 'East Side Branch',
    address: '789 East Road, Shopping Complex',
    phone: '+91 98765 43212',
    hours: '9:00 AM - 8:00 PM',
    mapsLink: 'https://maps.google.com'
  }
];

const HomePage: React.FC = () => {
  const { addToCart: addItemToCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [specialOffersTab, setSpecialOffersTab] = useState('discounts');
  
  // Handle weight selection for products
  const handleWeightChange = (productId: string, weight: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: parseFloat(weight)
    }));
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };
  
  // Generate weight options based on product's minimum weight
  const getWeightOptions = (minWeight: number) => {
    const options = [];
    for (let i = minWeight; i <= 2; i += minWeight) {
      options.push(i);
    }
    return options;
  };

  const handleAddToCart = (product: {
    id: string;
    name: string;
    pricePerKg: number;
    image: string;
    minWeight: number;
  }) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login or register to add items to cart",
        action: (
          <div className="flex gap-2">
            <Link to="/auth?tab=login">
              <Button size="sm" variant="outline">
                Login
              </Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button size="sm" variant="secondary">
                Register
              </Button>
            </Link>
          </div>
        )
      });
      return;
    }
    
    const quantity = quantities[product.id] || product.minWeight;
    
    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.pricePerKg,
      minWeight: product.minWeight,
      weight: quantity,
      image: product.image
    });
    
    toast({
      title: "Added to Cart",
      description: `${quantity}kg ${product.name} added to cart`,
    });
  };

  // Filter products based on search and category
  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === null || 
                          categories.find(cat => cat.id === activeCategory)?.name === product.category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header/Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-red-600" />
              <span className="font-bold text-xl">Butcher Blend</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="font-medium text-gray-700 hover:text-red-600">Home</Link>
              <Link to="/products" className="font-medium text-gray-700 hover:text-red-600">Meats</Link>
              <Link to="/offers" className="font-medium text-gray-700 hover:text-red-600">Special Offers</Link>
              <Link to="/about" className="font-medium text-gray-700 hover:text-red-600">About Us</Link>
            </nav>

            {/* Auth and Cart Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-red-600" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              
              {isAuthenticated ? (
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">{user?.name || 'User'}</span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth?tab=login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/auth?tab=register" className="hidden md:block">
                    <Button variant="default" size="sm">Register</Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Home</Link>
                <Link to="/products" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Meats</Link>
                <Link to="/offers" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Special Offers</Link>
                <Link to="/about" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">About Us</Link>
                {!isAuthenticated && (
                  <Link to="/auth?tab=register" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    Register
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Real Image - Reduced Height */}
      <section className="relative h-[400px]">
        <img 
          src={heroImage}
          alt="Premium Quality Meat" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl space-y-4">
              <Badge className="mb-2 bg-red-600 hover:bg-red-700">Premium Quality</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Fresh & Premium Quality Meat
              </h1>
              <p className="text-base text-gray-200">
                Experience the finest cuts of meat, sourced from trusted farms.
              </p>
              <div className="flex gap-4 pt-2">
                <Link to="/products">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse Meats
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/offers">
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    View Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold">Free Same Day Delivery</h3>
                  <p className="text-xs text-muted-foreground">On orders above ₹500</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Premium Quality Meat</h3>
                  <p className="text-xs text-muted-foreground">Fresh from trusted farms</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">100% Satisfaction</h3>
                  <p className="text-xs text-muted-foreground">Quality guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-8 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Special Offers</h2>
              <p className="text-muted-foreground">Exclusive deals and discounts</p>
            </div>
            <Link to="/offers">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="discounts" onValueChange={setSpecialOffersTab} value={specialOffersTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="discounts" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Discount Coupons
              </TabsTrigger>
              <TabsTrigger value="combos" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Combo Offers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discounts">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {discountOffers.map((offer) => (
                  <Card key={offer.id} className="bg-white overflow-hidden border-dashed border-2 border-red-200">
                    <CardContent className="p-6 relative">
                      <Badge className="absolute top-2 right-2 bg-red-100 text-red-600 hover:bg-red-200">
                        {offer.discount} OFF
                      </Badge>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-bold">{offer.code}</h3>
                      </div>
                      <p className="text-sm mb-4">{offer.description}</p>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex justify-between mb-1">
                          <span>Minimum Order:</span>
                          <span className="font-medium">₹{offer.minAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valid until:</span>
                          <span className="font-medium">{new Date(offer.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Copy Code
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="combos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comboOffers.map((combo) => (
                  <Card key={combo.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={combo.image}
                          alt={combo.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <Badge className="mb-2 bg-red-500">{combo.savings} OFF</Badge>
                        <h3 className="font-bold text-lg">{combo.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{combo.description}</p>
                        
                        <div className="my-3 space-y-1 text-sm">
                          <h4 className="font-medium">Included Items:</h4>
                          <ul className="pl-4 list-disc space-y-1">
                            {combo.items.map((item, idx) => (
                              <li key={idx} className="text-gray-700">
                                {item.name} ({item.weight})
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">₹{combo.price}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{combo.originalPrice}
                              </span>
                            </div>
                          </div>
                          <Button>Add to Cart</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Categories and Product Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Our Categories</h2>
              <p className="text-muted-foreground">Browse through our premium meat selections</p>
            </div>
            <div className="w-full md:w-72 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="all">
              <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setActiveCategory(null)}
                  className="px-6"
                >
                  All
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.name.toLowerCase()}
                    onClick={() => setActiveCategory(category.id)}
                    className="px-6"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Categories Card View with Real Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 className="font-bold text-xl text-white drop-shadow-md">{category.name}</h3>
                      <p className="text-sm text-gray-100">{category.count} items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground">Our best-selling products this week</p>
            </div>
            <Link to="/products">
              <Button variant="ghost">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <Badge variant="secondary" className="mb-2 w-fit">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="fill-current h-4 w-4" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold">₹{product.pricePerKg}</span>
                            {product.discount > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">per kg</p>
                        </div>
                        
                        <div className="flex items-center">
                          <Select
                            value={quantities[product.id]?.toString() || product.minWeight.toString()}
                            onValueChange={(value) => handleWeightChange(product.id, value)}
                          >
                            <SelectTrigger className="w-[90px] h-9">
                              <SelectValue placeholder={`${product.minWeight} kg`} />
                            </SelectTrigger>
                            <SelectContent>
                              {getWeightOptions(product.minWeight).map((weight) => (
                                <SelectItem key={weight} value={weight.toString()}>
                                  {weight} kg
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground">Try changing your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Branches Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Our Branches</h2>
            <p className="text-muted-foreground mt-2">Visit our stores for fresh cuts and personalized service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="font-bold text-xl">{branch.name}</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm border-t pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2 border-red-200 hover:bg-red-50" asChild>
                    <a href={branch.mapsLink} target="_blank" rel="noopener noreferrer">
                      View on Maps
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-red-500" />
                Butcher Blend
              </h3>
              <p className="text-gray-400">
                Premium quality meat delivered fresh to your doorstep. Our products are sourced from trusted farms and suppliers.
              </p>
              <div className="flex space-x-4 mt-6">
                <a 
                  href="#" 
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-gray-300" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-gray-300" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-gray-300" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/branches" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Our Branches
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>123 Main Street, Mumbai, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>info@butcherblend.com</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for exclusive offers and updates</p>
              <div className="flex flex-col space-y-2">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-gray-800 border-gray-700 focus:border-red-500"
                />
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy and will never share your information.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
                <div className="flex">
                  <Input 
                    placeholder="Your email" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Button className="ml-2 bg-red-600 hover:bg-red-700">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Butcher Blend. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;