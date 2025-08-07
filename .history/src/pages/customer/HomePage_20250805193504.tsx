import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Star, Truck, Shield, Clock } from 'lucide-react';

// Mock data for meat products
const meatCategories = [
  { id: '1', name: 'Chicken', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400', count: 12 },
  { id: '2', name: 'Mutton', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', count: 8 },
  { id: '3', name: 'Fish', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400', count: 15 },
  { id: '4', name: 'Beef', image: 'https://images.unsplash.com/photo-1588347818113-0c3d626ca2db?w=400', count: 6 }
];

const specialOffers = [
  {
    id: '1',
    name: 'Family Combo',
    items: ['1kg Chicken', '500g Mutton', '500g Fish'],
    originalPrice: 1200,
    discountPrice: 999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500'
  },
  {
    id: '2',
    name: 'BBQ Special',
    items: ['1kg Chicken Breast', '1kg Mutton Chops'],
    originalPrice: 970,
    discountPrice: 799,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500'
  }
];

const featuredMeats = [
  {
    id: '1',
    name: 'Fresh Chicken Breast',
    category: 'Chicken',
    pricePerKg: 320,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    rating: 4.5,
    description: 'Premium quality chicken breast, perfect for grilling',
    inStock: true
  },
  {
    id: '2',
    name: 'Mutton Curry Cut',
    category: 'Mutton',
    pricePerKg: 650,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    rating: 4.8,
    description: 'Fresh mutton curry cut, ideal for traditional cooking',
    inStock: true
  },
  {
    id: '3',
    name: 'Pomfret Fish',
    category: 'Fish',
    pricePerKg: 480,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    rating: 4.6,
    description: 'Fresh pomfret fish, cleaned and ready to cook',
    inStock: true
  },
  {
    id: '4',
    name: 'Beef Roast',
    category: 'Beef',
    pricePerKg: 420,
    image: 'https://images.unsplash.com/photo-1588347818113-0c3d626ca2db?w=400',
    rating: 4.4,
    description: 'Premium beef roast cut, perfect for special occasions',
    inStock: true
  }
];

const HomePage: React.FC = () => {
  const { addToCart: addItemToCart } = useCart();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const updateQuantity = (meatId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [meatId]: Math.max(0.5, (prev[meatId] || 0.5) + change)
    }));
  };

  const handleAddToCart = (meat: any) => {
    const quantity = quantities[meat.id] || 0.5;
    addItemToCart({
      id: meat.id,
      name: meat.name,
      price: meat.pricePerKg,
      minWeight: 0.5,
      weight: quantity,
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
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600" 
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