import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Star, Truck, Shield, Clock } from 'lucide-react';

// Mock data - in real app, this would come from API
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Chicken',
    description: 'Fresh chicken cuts',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Mutton',
    description: 'Premium mutton',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Fish',
    description: 'Fresh seafood',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Beef',
    description: 'Quality beef cuts',
    image: 'https://images.unsplash.com/photo-1588347818113-0c3d626ca2db?w=400',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const mockOffers: Offer[] = [
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