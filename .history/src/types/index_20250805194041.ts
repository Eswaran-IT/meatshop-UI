export interface Meat {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  minKg: number;
  image: string;
  categoryId: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'discount' | 'combo' | 'special';
  value: number; // percentage for discount, fixed price for combo
  validFrom: string;
  validTo: string;
  isActive: boolean;
  items?: string[]; // meat IDs for combo offers
}

export interface OrderItem {
  meatId: string;
  meatName: string;
  price: number;
  weight: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress: string;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface OrderItem {
  meatId: string;
  meatName: string;
  price: number;
  weight: number;
  total: number;
}

export interface DashboardStats {
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockItems: number;
  totalCustomers: number;
  monthlyRevenue: number;
}