import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  minWeight: number;
  weight: number;
  image: string;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  addToCart: (item: Omit<CartItem, 'total'>) => void;
  updateQuantity: (id: string, weight: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // On app start, clear cart if no user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      localStorage.removeItem('cart');
      setItems([]);
      return;
    }
    // Otherwise, load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'total'>) => {
    const total = newItem.price * newItem.weight;
    const existingItem = items.find(item => item.id === newItem.id);
    
    if (existingItem) {
      setItems(items.map(item =>
        item.id === newItem.id
          ? { ...item, weight: newItem.weight, total }
          : item
      ));
    } else {
      setItems([...items, { ...newItem, total }]);
    }
  };

  const updateQuantity = (id: string, weight: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, weight, total: item.price * weight }
        : item
    ));
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const itemCount = items.reduce((sum, item) => sum + item.weight, 0);

  const value: CartContextType = {
    items,
    totalAmount,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};