import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Info,
  ChevronDown,
  UserCircle,
  LayoutDashboard
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
              <button 
                onClick={() => {
                  if (user) {
                    // User is logged in, navigate to cart
                    window.location.href = '/cart';
                  } else {
                    // User is not logged in, redirect to login with a message
                    window.location.href = '/login?redirect=cart';
                    toast({
                      title: "Login Required",
                      description: "Please log in or register to view your cart",
                      variant: "default",
                    });
                  }
                }}
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
              </button>

              {/* User Authentication */}
              {user ? (
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 hover:bg-gray-100 hover:text-red-600"
                      >
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-red-100 text-red-600">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {user.isAdmin && (
                            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></div>
                          )}
                        </div>
                        <span className="hidden lg:inline-block font-medium">
                          {user.name}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{user.name}</span>
                        {user.isAdmin && (
                          <Badge className="ml-auto text-xs bg-red-100 text-red-600 hover:bg-red-100">Admin</Badge>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer w-full">
                          <UserCircle className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="cursor-pointer w-full">
                          <Package className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      
                      {user.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer w-full">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Register
                    </Button>
                  </Link>
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
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-red-100 text-red-600">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {user.isAdmin && (
                              <Badge className="mt-1 text-xs bg-red-100 text-red-600">Admin</Badge>
                            )}
                          </div>
                        </div>

                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserCircle className="h-5 w-5" />
                          My Profile
                        </Link>
                        
                        <Link 
                          to="/orders" 
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Package className="h-5 w-5" />
                          My Orders
                        </Link>

                        {user.isAdmin && (
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <Button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full mt-2 flex items-center gap-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </Button>
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