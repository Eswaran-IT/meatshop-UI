import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Meat } from '@/types';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  Clock,
  Minus,
  Plus
} from 'lucide-react';

// Mock data
const mockMeat: Meat = {
  id: '1',
  name: 'Premium Chicken Breast',
  description: 'Fresh, boneless chicken breast perfect for grilling, roasting, or pan-frying. Our chickens are farm-raised without antibiotics and hormones. Rich in protein and ideal for healthy meals.',
  pricePerKg: 280,
  minKg: 0.5,
  image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600',
  categoryId: '1',
  inStock: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [meat, setMeat] = useState<Meat | null>(null);
  const [weight, setWeight] = useState(0.5);
  const [adding, setAdding] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API loading
    const loadMeat = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMeat(mockMeat);
      setLoading(false);
    };

    loadMeat();
  }, [id]);

  const handleWeightChange = (newWeight: number) => {
    if (meat && newWeight >= meat.minKg && newWeight <= 10) {
      setWeight(newWeight);
    }
  };

  const handleAddToCart = async () => {
    if (!meat) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      addToCart({
        id: meat.id,
        name: meat.name,
        price: meat.pricePerKg,
        minWeight: meat.minKg,
        weight,
        image: meat.image
      });
      toast({
        title: "Added to Cart",
        description: `${weight}kg of ${meat.name} added to your cart`,
        position: "top-center"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
        position: "top-center"
      });
    }
    setAdding(false);
  };

  if (loading || !meat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = meat.pricePerKg * weight;

  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={meat.image} 
              alt={meat.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 border rounded-lg">
              <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Free Delivery</div>
              <div className="text-xs text-muted-foreground">Above ₹500</div>
            </div>
            <div className="p-3 border rounded-lg">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Fresh Quality</div>
              <div className="text-xs text-muted-foreground">100% Fresh</div>
            </div>
            <div className="p-3 border rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Same Day</div>
              <div className="text-xs text-muted-foreground">Delivery</div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-success">
                <Star className="h-3 w-3 mr-1" />
                Fresh
              </Badge>
              {meat.inStock ? (
                <Badge variant="outline" className="text-success border-success">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold">{meat.name}</h1>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">₹{meat.pricePerKg}</span>
              <span className="text-muted-foreground">per kg</span>
            </div>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              {meat.description}
            </p>
          </div>

          {/* Weight Selector */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-base font-semibold">
                    Select Weight (kg)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Minimum: {meat.minKg}kg • Maximum: 10kg
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleWeightChange(weight - 0.1)}
                    disabled={weight <= meat.minKg}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 space-y-2">
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
                      min={meat.minKg}
                      max={10}
                      step={0.1}
                      className="text-center text-lg font-semibold"
                    />
                    <div className="flex justify-center space-x-2">
                      {[0.5, 1, 1.5, 2].map((w) => (
                        <Button
                          key={w}
                          variant={weight === w ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleWeightChange(w)}
                          disabled={w < meat.minKg}
                        >
                          {w}kg
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleWeightChange(weight + 0.1)}
                    disabled={weight >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {weight}kg × ₹{meat.pricePerKg}/kg
                  </p>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  disabled={adding || !meat.inStock || weight < meat.minKg}
                  className="w-full"
                  size="lg"
                  variant="meat"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {adding ? 'Adding...' : `Add to Cart - ₹${totalPrice.toFixed(2)}`}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Nutritional Benefits</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• High in protein (25g per 100g)</li>
                <li>• Low in fat and calories</li>
                <li>• Rich in vitamins B6 and B12</li>
                <li>• Contains essential amino acids</li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Storage Instructions</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Store in refrigerator (0-4°C)</li>
                <li>• Use within 2-3 days of purchase</li>
                <li>• Can be frozen for up to 6 months</li>
                <li>• Thaw in refrigerator before cooking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;