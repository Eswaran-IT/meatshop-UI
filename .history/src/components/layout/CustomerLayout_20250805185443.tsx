import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  Home, 
  ShoppingCart, 
  User, 
  Package,
  LogOut,
  Search,
  Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: itemCount > 0 ? itemCount.toFixed(1) + ' kg' : null },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => (
    <Link 
      to={item.href}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
        ${isActive(item.href) 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }
        ${mobile ? 'justify-start text-base' : 'justify-center md:justify-start'}
      `}
    >
      <item.icon className="h-5 w-5" />
      <span className={mobile ? 'block' : 'hidden md:block'}>{item.name}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {item.badge}
        </Badge>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col space-y-4 py-4">
                  <div className="px-3 py-2">
                    <h2 className="text-lg font-semibold">MeatShop</h2>
                    <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
                  </div>
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <NavLink key={item.name} item={item} mobile />
                    ))}
                  </nav>
                  <Button 
                    onClick={logout} 
                    variant="ghost" 
                    className="mx-3 mt-auto justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-primary">MeatShop</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for meats..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            {/* User Info & Cart */}
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      variant="destructive"
                    >
                      {Math.ceil(itemCount)}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Hi, {user?.name}</span>
                <Button onClick={logout} variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - Fixed Position */}
        <aside className="hidden md:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r bg-card/50 overflow-y-auto z-40">
          <div className="flex flex-col w-full p-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content - Offset for sidebar */}
        <main className="flex-1 min-h-screen md:ml-64">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t">
        <nav className="flex items-center justify-around p-2">
          {navigation.map((item) => (
            <Link 
              key={item.name}
              to={item.href}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-colors
                ${isActive(item.href) 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
                }
              `}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {Math.ceil(parseFloat(item.badge))}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CustomerLayout;