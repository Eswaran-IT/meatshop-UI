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
  CheckCircle
} from 'lucide-react';

// Mock data
const categories = [
  { id: 1, name: 'Chicken', count: 12 },
  { id: 2, name: 'Mutton', count: 8 },
  { id: 3, name: 'Fish', count: 15 },
  { id: 4, name: 'Beef', count: 6 },
  { id: 5, name: 'Pork', count: 4 }
];

const featuredProducts = [
  // Add more mock products for each category to ensure 3 per category
  {
    id: 5,
    name: 'Chicken Drumsticks',
    description: 'Juicy chicken drumsticks, perfect for grilling',
    price: 260,
    originalPrice: 300,
    discount: 13,
    rating: 4.7,
    reviews: 110,
    category: 'Chicken'
  },
  {
    id: 6,
    name: 'Chicken Thighs',
    description: 'Tender chicken thighs for curries and roasts',
    price: 270,
    originalPrice: 310,
    discount: 12,
    rating: 4.6,
    reviews: 90,
    category: 'Chicken'
  },
  {
    id: 7,
    name: 'Mutton Chops',
    description: 'Succulent mutton chops for grilling',
    price: 600,
    originalPrice: 700,
    discount: 14,
    rating: 4.8,
    reviews: 80,
    category: 'Mutton'
  },
  {
    id: 8,
    name: 'Mutton Mince',
    description: 'Fresh mutton mince for kebabs and curries',
    price: 590,
    originalPrice: 670,
    discount: 12,
    rating: 4.7,
    reviews: 70,
    category: 'Mutton'
  },
  {
    id: 9,
    name: 'Fish Steaks',
    description: 'Firm fish steaks, ideal for frying',
    price: 360,
    originalPrice: 410,
    discount: 12,
    rating: 4.6,
    reviews: 60,
    category: 'Fish'
  },
  {
    id: 10,
    name: 'Fish Curry Cut',
    description: 'Fish pieces ready for curry',
    price: 340,
    originalPrice: 390,
    discount: 13,
    rating: 4.5,
    reviews: 55,
    category: 'Fish'
  },
  {
    id: 11,
    name: 'Beef Mince',
    description: 'Lean beef mince for burgers and kebabs',
    price: 630,
    originalPrice: 720,
    discount: 13,
    rating: 4.7,
    reviews: 50,
    category: 'Beef'
  },
  {
    id: 12,
    name: 'Beef Ribs',
    description: 'Juicy beef ribs for slow cooking',
    price: 670,
    originalPrice: 760,
    discount: 12,
    rating: 4.6,
    reviews: 45,
    category: 'Beef'
  },
  {
    id: 13,
    name: 'Pork Chops',
    description: 'Tender pork chops for grilling',
    price: 400,
    originalPrice: 450,
    discount: 11,
    rating: 4.5,
    reviews: 40,
    category: 'Pork'
  },
  {
    id: 14,
    name: 'Pork Belly',
    description: 'Rich pork belly for roasting',
    price: 420,
    originalPrice: 470,
    discount: 11,
    rating: 4.4,
    reviews: 35,
    category: 'Pork'
  },
  {
    id: 1,
    name: 'Premium Chicken Breast',
    description: 'Boneless, skinless chicken breast pieces',
    price: 280,
    originalPrice: 320,
    discount: 13,
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
        position: "top-center"
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
        image: "" // No image available in mock data
      });

      toast({
        title: "Added to Cart",
        description: `${weight}kg of ${product.name} added to your cart.`,
        position: "top-center"
      });
    }
  };

  // Filter products based on search and category
  let filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === null || 
                          categories.find(cat => cat.id === activeCategory)?.name === product.category;
    return matchesSearch && matchesCategory;
  });

  // If no category filter, show 3 products per category
  if (activeCategory === null) {
    const grouped: { [cat: string]: typeof featuredProducts } = {};
    categories.forEach(cat => {
      grouped[cat.name] = featuredProducts.filter(p => p.category === cat.name).slice(0, 3);
    });
    filteredProducts = Object.values(grouped).flat();
  }

  return (
    <>
      {/* Animated Free Delivery Banner */}
      <div className="w-full overflow-x-hidden bg-gradient-to-r from-yellow-200 to-red-200 py-2 relative" style={{margin:0, padding:0}}>
        <div
          className="whitespace-nowrap animate-marquee text-lg font-semibold text-red-700 flex items-center gap-2"
          style={{
            animation: 'marquee 12s linear infinite',
            willChange: 'transform',
            display: 'inline-block',
            minWidth: '100%'
          }}
        >
          <span role="img" aria-label="truck">🚚</span>
          Free Delivery on Orders Above ₹500!
          <span className="ml-4 text-base text-gray-700">Order Now &amp; Save on Delivery Charges!</span>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <div className="min-h-screen" style={{ margin: 0, padding: 0, width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Hero Section with Real Image */}
      <section className="relative h-[350px]">
        <img
          src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Fresh Meat Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center z-10">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl space-y-6">
              <Badge className="mb-4 bg-red-600 hover:bg-red-700">Premium Quality</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Fresh & Premium Quality Meat
              </h1>
              <p className="text-lg text-gray-200">
                Experience the finest cuts of meat, sourced from trusted farms and delivered fresh to your doorstep.
              </p>
              {/* Removed hero buttons as requested; only image and text remain */}
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

      {/* Special Offers Section */}
      <section id="special-offers" className="py-12 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Special Offers</h2>
          <div className="text-gray-700 mb-6">Check out our latest deals and discounts on select products!</div>
          {/* Special Offers with full-width tabs */}
          <Tabs defaultValue="coupons" className="w-full">
            <TabsList className="flex w-full mb-8 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="coupons" className="flex-1 text-lg py-3 transition rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-red-700">Coupon Codes</TabsTrigger>
              <TabsTrigger value="combos" className="flex-1 text-lg py-3 transition rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-red-700">Combo Offers</TabsTrigger>
            </TabsList>
            <TabsContent value="coupons">
              <div className="flex flex-wrap gap-6 justify-start">
                {/* Chicken Coupon */}
                <Card className="flex-1 min-w-[260px] max-w-xs bg-white border border-gray-200 overflow-hidden shadow-lg flex flex-col min-h-[410px]">
                  <CardContent className="p-0 flex flex-col h-full">
                    <img
                      src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
                      alt="Special Offer - Chicken Coupon"
                      className="w-full h-40 object-cover"
                    />
                    <div className="flex flex-col flex-1 p-4 justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-red-700 min-h-[56px] flex items-center">Flat 10% Off on All Chicken Products</h3>
                        <p className="text-gray-600 mb-2 min-h-[40px] flex items-center">Use code <span className="font-mono bg-gray-100 px-2 py-1 rounded">CHICKEN10</span> at checkout.</p>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700 text-white mt-2 w-full" style={{marginTop: 'auto'}} onClick={() => {
                        navigator.clipboard.writeText('CHICKEN10');
                        document.getElementById('meats-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}>Use Now</Button>
                    </div>
                  </CardContent>
                </Card>
                {/* Mutton Coupon */}
                <Card className="flex-1 min-w-[260px] max-w-xs bg-white border border-gray-200 overflow-hidden shadow-lg flex flex-col min-h-[410px]">
                  <CardContent className="p-0 flex flex-col h-full">
                    <img
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                      alt="Special Offer - Mutton Coupon"
                      className="w-full h-40 object-cover"
                    />
                    <div className="flex flex-col flex-1 p-4 justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-red-700 min-h-[56px] flex items-center">15% Off on Mutton for New Users</h3>
                        <p className="text-gray-600 mb-2 min-h-[40px] flex items-center">Sign up and get instant discount on your first mutton order.</p>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700 text-white mt-2 w-full" style={{marginTop: 'auto'}} onClick={() => {
                        navigator.clipboard.writeText('MUTTON15');
                        document.getElementById('meats-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}>Use Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="combos">
              <div className="flex flex-wrap gap-6 justify-start">
                {/* Chicken + Mutton Combo */}
                <Card className="flex-1 min-w-[260px] max-w-xs bg-white border border-gray-200 overflow-hidden shadow-lg flex flex-col min-h-[410px]">
                  <CardContent className="p-0 flex flex-col h-full">
                    <img
                      src="https://images.unsplash.com/photo-1519864342061-cd7d1e8e39c4?auto=format&fit=crop&w=400&q=80"
                      alt="Special Offer - Chicken Mutton Combo"
                      className="w-full h-40 object-cover"
                    />
                    <div className="flex flex-col flex-1 p-4 justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-red-700 min-h-[56px] flex items-center">Chicken + Mutton Combo</h3>
                        <p className="text-gray-600 mb-2 min-h-[40px] flex items-center">Buy 1kg Chicken and get 500g Mutton at 50% off. Limited time combo!</p>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700 text-white mt-2 w-full" style={{marginTop: 'auto'}} onClick={() => {
                        // Add to cart logic for combo offer (add both chicken and mutton combo to cart)
                        if (!isAuthenticated) {
                          toast({
                            title: "Login Required",
                            description: "Please login or register to add items to cart",
                            position: "top-center"
                          });
                          return;
                        }
                        addToCart({
                          id: 'combo-chicken-mutton',
                          name: 'Chicken + Mutton Combo',
                          price: 280 + 580 * 0.5, // Example price
                          minWeight: 1.5,
                          weight: 1.5,
                          image: ''
                        });
                        toast({
                          title: "Combo Added to Cart",
                          description: `Chicken + Mutton Combo added to your cart!`,
                          position: "top-center"
                        });
                      }}>Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
                {/* Fish + Beef Combo */}
                <Card className="flex-1 min-w-[260px] max-w-xs bg-white border border-gray-200 overflow-hidden shadow-lg flex flex-col min-h-[410px]">
                  <CardContent className="p-0 flex flex-col h-full">
                    <img
                      src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80"
                      alt="Special Offer - Fish Beef Combo"
                      className="w-full h-40 object-cover"
                    />
                    <div className="flex flex-col flex-1 p-4 justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-red-700 min-h-[56px] flex items-center">Fish + Beef Combo</h3>
                        <p className="text-gray-600 mb-2 min-h-[40px] flex items-center">Get 10% off when you buy both Fish and Beef together. Perfect for family feasts!</p>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700 text-white mt-2 w-full" style={{marginTop: 'auto'}} onClick={() => {
                        // Add to cart logic for combo offer (add both fish and beef combo to cart)
                        if (!isAuthenticated) {
                          toast({
                            title: "Login Required",
                            description: "Please login or register to add items to cart",
                            position: "top-center"
                          });
                          return;
                        }
                        addToCart({
                          id: 'combo-fish-beef',
                          name: 'Fish + Beef Combo',
                          price: 350 + 650, // Example price
                          minWeight: 2,
                          weight: 2,
                          image: ''
                        });
                        toast({
                          title: "Combo Added to Cart",
                          description: `Fish + Beef Combo added to your cart!`,
                          position: "top-center"
                        });
                      }}>Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Meats Section (with search and filter only) removed as requested */}

      {/* Meats Grid Section */}
      <section id="meats-section" className="py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Meats</h2>
          {/* Search and Category Filter side by side below heading */}
          <div className="flex flex-row gap-4 mb-8">
            <div className="w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-1/2">
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
          </div>
          {/* Meats Grid with flex-wrap */}
          <div className="flex flex-wrap gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group flex-1 min-w-[260px] max-w-xs flex flex-col min-h-[410px]">
                  <div className="relative">
                    {/* Product image removed */}
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1 justify-between h-full">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-lg min-h-[32px] flex items-center">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 min-h-[36px] flex items-center">{product.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center text-yellow-500">
                          <Star className="fill-current h-4 w-4" />
                          <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4 mt-auto">
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
              <div className="w-full text-center py-12">
                <h3 className="text-lg font-medium">No meats found</h3>
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
            
            {/* Quick Links removed as requested */}
            
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
            
            {/* Follow Us and Newsletter Subscription section removed */}
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
