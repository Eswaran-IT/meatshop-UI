import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag, ShoppingCart } from 'lucide-react';

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  validUntil: string;
  type: 'discount' | 'combo' | 'special';
  className?: string;
  onClick?: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  id,
  title,
  description,
  image,
  originalPrice,
  discountedPrice,
  discount,
  validUntil,
  type,
  className = "",
  onClick
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'combo': return 'bg-blue-500';
      case 'special': return 'bg-purple-500';
      default: return 'bg-primary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'combo': return 'Combo Deal';
      case 'special': return 'Special Offer';
      default: return 'Discount';
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${className}`}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getTypeColor(type)} text-white`}>
            {discount}% OFF
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {getTypeLabel(type)}
          </Badge>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{discountedPrice}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Savings Display */}
          <div className="bg-success/10 rounded-lg p-2 text-center">
            <p className="text-xs text-success-foreground">You Save</p>
            <p className="font-bold text-success text-lg">
              ₹{originalPrice - discountedPrice}
            </p>
          </div>

          {/* Validity */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Valid until {validUntil}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <Button 
          onClick={onClick}
          className="w-full gap-2 hover:gap-3 transition-all"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          Grab This Deal
        </Button>
        
        <Link to={`/offer/${id}`} className="w-full">
          <Button variant="outline" className="w-full" size="sm">
            <Tag className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;