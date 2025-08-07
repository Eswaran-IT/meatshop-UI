import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Beef, 
  FolderTree, 
  Percent, 
  Package,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Manage Meats', url: '/admin/meats', icon: Beef },
    { title: 'Categories', url: '/admin/categories', icon: FolderTree },
    { title: 'Offers & Combos', url: '/admin/offers', icon: Percent },
    { title: 'Orders', url: '/admin/orders', icon: Package },
    { title: 'Loyalty Rewards', url: '/admin/loyalty-rewards', icon: Percent },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const AppSidebar = () => {
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';

    return (
      <Sidebar className={collapsed ? "w-14" : "w-64"}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={
                          isActive(item.url) 
                            ? "bg-primary text-primary-foreground font-medium" 
                            : "hover:bg-accent"
                        }
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold">MeatShop Admin</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search orders, products..."
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    3
                  </Badge>
                </Button>
                
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                  <Button onClick={logout} variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="container mx-auto p-6 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;