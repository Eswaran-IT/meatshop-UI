import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Star, Truck, Shield, Clock } from 'lucide-react';

// Mock data for meat products
const meatCategories = [
  { id: '1', name: 'Chicken', image: '/placeholder.svg', count: 12 },
  { id: '2', name: 'Mutton', image: '/placeholder.svg', count: 8 },
  { id: '3', name: 'Fish', image: '/placeholder.svg', count: 15 },
  { id: '4', name: 'Beef', image: '/placeholder.svg', count: 6 }
];

const specialOffers = [
  {
    id: '1',
    name: 'Family Combo',
    items: ['1kg Chicken', '500g Mutton', '500g Fish'],
    originalPrice: 1200,
    discountPrice: 999,
    discount: 17,
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'BBQ Special',
    items: ['1kg Chicken Breast', '1kg Mutton Chops'],
    originalPrice: 970,
    discountPrice: 799,
    discount: 18,
    image: '/placeholder.svg'
  }
];

const featuredMeats = [
  {
    id: '1',
    name: 'Fresh Chicken Breast',
    category: 'Chicken',
    pricePerKg: 320,
    image: '/placeholder.svg',
    rating: 4.5,
    description: 'Premium quality chicken breast, perfect for grilling',
    inStock: true
  },
  {
    id: '2',
    name: 'Mutton Curry Cut',
    category: 'Mutton',
    pricePerKg: 650,
    image: '/placeholder.svg',
    rating: 4.8,
    description: 'Fresh mutton curry cut, ideal for traditional cooking',
    inStock: true
  },
  {
    id: '3',
    name: 'Pomfret Fish',
    category: 'Fish',
    pricePerKg: 480,
    image: '/placeholder.svg',
    rating: 4.6,
    description: 'Fresh pomfret fish, cleaned and ready to cook',
    inStock: true
  },
  {
    id: '4',
    name: 'Beef Roast',
    category: 'Beef',
    pricePerKg: 420,
    image: '/placeholder.svg',
    rating: 4.4,
    description: 'Premium beef roast cut, perfect for special occasions',
    inStock: true
  }
];

const HomePage: React.FC = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const updateQuantity = (meatId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [meatId]: Math.max(0.5, (prev[meatId] || 0.5) + change)
    }));
  };

  const addToCart = (meat: any) => {
    const quantity = quantities[meat.id] || 0.5;
    addItem({
      id: meat.id,
      name: meat.name,
      price: meat.pricePerKg,
      quantity: quantity,
      image: meat.image
    });
    
    toast({
      title: "Added to Cart",
      description: `${quantity}kg ${meat.name} added to cart`,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Fresh Meat
                <br />
                <span className="text-yellow-400">Delivered Daily</span>
              </h1>
              <p className="text-xl mb-6">
                Premium quality meats sourced fresh and delivered to your doorstep
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  View Offers
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/placeholder.svg" 
                alt="Fresh Meat" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">On orders above ₹500</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">Fresh and premium quality guaranteed</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Same Day Delivery</h3>
              <p className="text-gray-600">Order before 2 PM for same day delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers - BEFORE Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
            <p className="text-gray-600 text-lg">Save more with our special combo deals</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {specialOffers.map(offer => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img 
                      src={offer.image} 
                      alt={offer.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{offer.name}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {offer.discount}% OFF
                        </Badge>
                      </div>
                      
                      <ul className="text-sm text-gray-600 mb-3">
                        {offer.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-red-600">₹{offer.discountPrice}</span>
                        <span className="text-gray-500 line-through">₹{offer.originalPrice}</span>
                      </div>

                      <Button className="bg-red-600 hover:bg-red-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add Combo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Choose from our premium selection of fresh meats</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {meatCategories.map(category => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-20 h-20 mx-auto mb-4 rounded-full object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meats Section - with ID for navigation */}
      <section id="meats-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fresh Meats</h2>
            <p className="text-gray-600 text-lg">Our best-selling premium meats</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMeats.map(meat => (
              <Card key={meat.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={meat.image} 
                    alt={meat.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{meat.rating}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{meat.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{meat.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-red-600">₹{meat.pricePerKg}</span>
                    <span className="text-gray-600">/kg</span>
                  </div>

                  {/* Weight Selector - starts from 0.5kg */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Weight:</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(meat.id, -0.5)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-12 text-center">
                        {quantities[meat.id] || 0.5}kg
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(meat.id, 0.5)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-lg font-semibold">
                      Total: ₹{((quantities[meat.id] || 0.5) * meat.pricePerKg).toFixed(0)}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => addToCart(meat)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
  {
    id: '1',
    title: 'Family Combo Pack',
    description: '2kg Chicken + 1kg Mutton + Free Delivery',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
    type: 'combo',
    value: 1299,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isActive: true,
    items: ['1', '2']
  },
  {
    id: '2',
    title: '20% Off on Fish',
    description: 'Get 20% discount on all fresh fish varieties',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500',
    type: 'discount',
    value: 20,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isActive: true
  }
];

const mockFeaturedMeats: Meat[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    description: 'Boneless chicken breast, perfect for grilling',
    pricePerKg: 280,
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
    pricePerKg: 650,
    minKg: 1,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    categoryId: '2',
    inStock: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [featuredMeats, setFeaturedMeats] = useState<Meat[]>([]);

  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories(mockCategories);
      setOffers(mockOffers);
      setFeaturedMeats(mockFeaturedMeats);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Fresh Meat Delivered
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium quality meats delivered fresh to your doorstep. Order now and taste the difference!
          </p>
        </div>
        <Button size="lg" variant="meat" className="text-lg px-8 py-4">
          Start Shopping
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground">Choose from our fresh meat categories</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="aspect-square relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Special Offers</h2>
          <p className="text-muted-foreground">Don't miss our amazing deals</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          <Percent className="h-3 w-3 mr-1" />
                          {offer.type === 'discount' ? `${offer.value}% OFF` : 'COMBO'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Limited Time
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{offer.title}</h3>
                      <p className="text-muted-foreground">{offer.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {offer.type === 'combo' && (
                        <div className="text-2xl font-bold text-primary">
                          ₹{offer.value}
                        </div>
                      )}
                      <Button variant="meat" className="w-full">
                        {offer.type === 'combo' ? 'Order Combo' : 'Shop Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">Our customers' favorite picks</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMeats.map((meat) => (
            <Link 
              key={meat.id}
              to={`/product/${meat.id}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="aspect-square relative">
                  <img 
                    src={meat.image} 
                    alt={meat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-success">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {meat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {meat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg text-primary">
                        ₹{meat.pricePerKg}/kg
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Min: {meat.minKg}kg
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;