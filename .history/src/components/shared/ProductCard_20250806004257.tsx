import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  minWeight: number;
  image: string;
  category?: string;
  rating?: number;
  discount?: number;
  isSpecialOffer?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  minWeight,
  image,
  category,
  rating = 4.5,
  discount,
  isSpecialOffer,
  className = ""
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [weight, setWeight] = React.useState(minWeight);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: (
          <span className="flex items-center gap-2 text-red-600">
            <span className="inline-block"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></span>
            Please login or register to add items to cart
          </span>
        ),
        action: (
          <div className="flex gap-2">
            <a href="/login"><button className="px-2 py-1 border rounded text-sm">Login</button></a>
            <a href="/register"><button className="px-2 py-1 border rounded text-sm">Register</button></a>
          </div>
        ),
        position: "top-center"
      });
      return;
    }
    addToCart({
      id,
      name,
      price,
      minWeight,
      weight,
      image
    });
  };

  const adjustWeight = (increment: boolean) => {
    if (increment) {
      setWeight(prev => prev + 0.5);
    } else if (weight > minWeight) {
      setWeight(prev => Math.max(prev - 0.5, minWeight));
    }
  };

  const finalPrice = discount ? price * (1 - discount / 100) : price;
  const totalPrice = finalPrice * weight;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isSpecialOffer && (
            <Badge className="bg-primary text-primary-foreground">
              Special Offer
            </Badge>
          )}
          {discount && (
            <Badge variant="destructive">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {category}
            </p>
          )}
          
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {discount ? (
                  <>
                    <span className="text-lg font-bold text-primary">
                      ₹{finalPrice.toFixed(0)}/kg
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{price}/kg
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    ₹{price}/kg
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Min: {minWeight}kg
              </p>
            </div>
          </div>

          {/* Weight Selector */}
          <div className="flex items-center justify-between bg-accent rounded-lg p-2">
            <span className="text-sm font-medium">Weight:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => adjustWeight(false)}
                disabled={weight <= minWeight}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium min-w-[40px] text-center">
                {weight}kg
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => adjustWeight(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Total Price Display */}
          <div className="bg-primary/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Total Price</p>
            <p className="font-bold text-primary text-lg">₹{totalPrice.toFixed(0)}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full gap-2 hover:gap-3 transition-all"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;