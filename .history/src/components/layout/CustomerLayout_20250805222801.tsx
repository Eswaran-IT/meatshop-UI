import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Phone,
  ShoppingCart, 
  User, 
  Package,
  LogOut,
  Menu,
  Gift,
  Home,
  Info
} from 'lucide-react';

const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToOffers = () => {
    if (location.pathname === '/') {
      // If on home page, scroll to offers section
      const offersSection = document.getElementById('special-offers');
      if (offersSection) {
        offersSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home then scroll
      window.location.href = '/#special-offers';
    }
  };

  const scrollToMeats = () => {
    if (location.pathname === '/') {
      // If on home page, scroll to meats section  
      const meatsSection = document.getElementById('meats-section');
      if (meatsSection) {
        meatsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home then scroll
      window.location.href = '/#meats-section';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar with Location & Contact */}
      <div className="hidden md:block bg-red-600 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Mumbai, Maharashtra</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>+91 9876543210</span>
            </div>
          </div>
          <div className="text-yellow-300">
            Free Delivery on Orders Above ₹500!
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl text-red-600">Butcher Blend</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              
              <button 
                onClick={scrollToOffers}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
              >
                <Gift className="h-4 w-4" />
                Special Offers
              </button>
              
              <button 
                onClick={scrollToMeats}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Shop Now
              </button>
            </nav>

            {/* Right Side - Cart & User */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center">
                      {Math.round(itemCount)}
                    </Badge>
                  )}
                </div>
                <span className="hidden lg:block">Cart</span>
              </Link>

              {/* User Authentication */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:block">Profile</span>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/login'}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => window.location.href = '/login'}
                  >
                    Register
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {!user && (
                      <div className="flex gap-2 mb-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            window.location.href = '/login';
                            setIsMenuOpen(false);
                          }}
                        >
                          Login
                        </Button>
                        <Button 
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => {
                            window.location.href = '/register';
                            setIsMenuOpen(false);
                          }}
                        >
                          Register
                        </Button>
                      </div>
                    )}
                    
                    <Link 
                      to="/" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                    
                    <button 
                      onClick={() => {
                        scrollToOffers();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <Gift className="h-5 w-5" />
                      Special Offers
                    </button>
                    
                    <button 
                      onClick={() => {
                        scrollToMeats();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-red-600 text-white font-medium"
                    >
                      Shop Now
                    </button>

                    {user && (
                      <>
                        <Link 
                          to="/orders" 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Package className="h-5 w-5" />
                          My Orders
                        </Link>
                        
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Phone className="h-4 w-4" />
                        +91 9876543210
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        Mumbai, Maharashtra
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Test user notification */}
        {user && (
          <div className="max-w-7xl mx-auto px-4 py-3 mt-2">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 flex items-center justify-between">
                <div>
                  You are currently logged in as <span className="font-semibold">{user.name}</span> ({user.isAdmin ? 'Admin' : 'Customer'}).
                  This is a test account.
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white text-blue-800 border-blue-300"
                  onClick={logout}
                >
                  <LogOut className="h-3 w-3 mr-1" /> Logout
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;