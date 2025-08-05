import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Twitter
} from 'lucide-react';

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
  { id: 1, name: 'Chicken', image: categoryImages.chicken, count: 12 },
  { id: 2, name: 'Mutton', image: categoryImages.mutton, count: 8 },
  { id: 3, name: 'Fish', image: categoryImages.fish, count: 15 },
  { id: 4, name: 'Beef', image: categoryImages.beef, count: 6 },
  { id: 5, name: 'Pork', image: categoryImages.pork, count: 4 }
];

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Chicken Breast',
    description: 'Boneless, skinless chicken breast pieces',
    price: 280,
    originalPrice: 320,
    discount: 13,
    image: productImages.chickenBreast,
    rating: 4.8,
    reviews: 156,
    category: 'Chicken'
  },
  {
    id: 2,
    name: 'Mutton Curry Cut',
    description: 'Fresh mutton pieces with bone',
    price: 580,
    originalPrice: 650,
    discount: 11,
    image: productImages.muttonCurry,
    rating: 4.9,
    reviews: 124,
    category: 'Mutton'
  },
  {
    id: 3,
    name: 'Fresh River Fish',
    description: 'Cleaned and ready to cook river fish',
    price: 350,
    originalPrice: 400,
    discount: 13,
    image: productImages.fish,
    rating: 4.7,
    reviews: 98,
    category: 'Fish'
  },
  {
    id: 4,
    name: 'Premium Beef Cut',
    description: 'Tender beef cuts for steak and roast',
    price: 650,
    originalPrice: 750,
    discount: 13,
    image: productImages.beef,
    rating: 4.8,
    reviews: 86,
    category: 'Beef'
  }
];

const branches = [
  {
    id: 1,
    name: 'Central Market Branch',
    address: '123 Market Street, Central Area',
    phone: '+91 98765 43210',
    hours: '9:00 AM - 9:00 PM',
    mapsLink: 'https://maps.google.com'
  },
  {
    id: 2,
    name: 'North City Branch',
    address: '456 North Avenue, Business District',
    phone: '+91 98765 43211',
    hours: '8:30 AM - 9:30 PM',
    mapsLink: 'https://maps.google.com'
  },
  {
    id: 3,
    name: 'East Side Branch',
    address: '789 East Road, Shopping Complex',
    phone: '+91 98765 43212',
    hours: '9:00 AM - 8:00 PM',
    mapsLink: 'https://maps.google.com'
  }
];

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [productWeights, setProductWeights] = useState<{[key: number]: number}>({});

  const handleAddToCart = (productId: number) => {
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
    
    const weight = productWeights[productId] || 0.5;
    const product = featuredProducts.find(p => p.id === productId);
    
    if (product) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        minWeight: 0.5,
        weight: weight,
        image: product.image
      });
      
      toast({
        title: "Added to Cart",
        description: `${weight}kg of ${product.name} added to your cart.`,
      });
    }
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
      {/* Hero Section with Real Image */}
      <section className="relative h-[600px]">
        <img 
          src={heroImage}
          alt="Premium Quality Meat" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl space-y-6">
              <Badge className="mb-4 bg-red-600 hover:bg-red-700">Premium Quality</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Fresh & Premium Quality Meat
              </h1>
              <p className="text-lg text-gray-200">
                Experience the finest cuts of meat, sourced from trusted farms and delivered fresh to your doorstep.
              </p>
              <div className="flex gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/offers">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                    View Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold">Free Same Day Delivery</h3>
                  <p className="text-sm text-muted-foreground">On orders above ₹500</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Premium Quality Meat</h3>
                  <p className="text-sm text-muted-foreground">Fresh from trusted farms</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">100% Satisfaction</h3>
                  <p className="text-sm text-muted-foreground">Quality guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>
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
                <Card key={product.id} className="overflow-hidden group">
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
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="fill-current h-4 w-4" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold">₹{product.price}</span>
                            {product.discount > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">per kg</p>
                        </div>
                      </div>
                      
                      {/* Weight Selection with +/- controls */}
                      <div className="flex justify-between items-center border rounded-md p-2">
                        <span className="text-sm font-medium">Weight:</span>
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => {
                              const currentWeight = productWeights[product.id] || 0.5;
                              if (currentWeight > 0.5) {
                                setProductWeights({
                                  ...productWeights,
                                  [product.id]: parseFloat((currentWeight - 0.5).toFixed(1))
                                });
                              }
                            }}
                          >
                            -
                          </Button>
                          <span className="w-14 text-center">
                            {productWeights[product.id] || 0.5} kg
                          </span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => {
                              const currentWeight = productWeights[product.id] || 0.5;
                              setProductWeights({
                                ...productWeights,
                                [product.id]: parseFloat((currentWeight + 0.5).toFixed(1))
                              });
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => handleAddToCart(product.id)}
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
          <h2 className="text-3xl font-bold tracking-tight mb-8">Our Branches</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-xl">{branch.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
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
              <h3 className="text-xl font-bold mb-4">Butcher Blend</h3>
              <p className="text-gray-400">
                Premium quality meat delivered fresh to your doorstep. Our products are sourced from trusted farms and suppliers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                <li><Link to="/offers" className="text-gray-400 hover:text-white">Special Offers</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Main Street, Mumbai, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@butcherblend.com</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
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
