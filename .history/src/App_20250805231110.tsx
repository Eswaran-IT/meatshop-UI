import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import OTPForm from "@/components/auth/OTPForm";
import CustomerLayout from "@/components/layout/CustomerLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import HomePage from "@/pages/customer/HomePage";
import ProductPage from "@/pages/customer/ProductPage";
import CartPage from "@/pages/customer/CartPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageMeats from "@/pages/admin/ManageMeats";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManageOffers from "@/pages/admin/ManageOffers";
import ManageOrders from "@/pages/admin/ManageOrders";
import AdminSettings from "@/pages/admin/AdminSettings";
import OrdersPage from "@/pages/customer/OrdersPage";
import ProfilePage from "@/pages/customer/ProfilePage";
import NotFound from "./pages/NotFound";
import LoginForm from "@/components/auth/LoginForm.new";
import RegisterForm from "@/components/auth/RegisterForm";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <OTPForm onSuccess={() => window.location.reload()} />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <OTPForm onSuccess={() => window.location.reload()} />;
  }
  
  return (
    <Routes>
      {isAdmin ? (
        <>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="meats" element={<ManageMeats />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="offers" element={<ManageOffers />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth" element={<OTPForm onSuccess={() => window.location.reload()} />} />
          <Route path="/login" element={<LoginForm onSuccess={() => window.location.replace('/')} />} />
          <Route path="/register" element={<RegisterForm onSuccess={() => window.location.replace('/login')} />} />
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="category/:id" element={<div>Category Page</div>} />
            <Route path="product/:id" element={<ProductPage />} />
          </Route>
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
