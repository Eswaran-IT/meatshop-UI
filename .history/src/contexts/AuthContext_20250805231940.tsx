import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  mobile: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  register: (mobile: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS = {
  CUSTOMER: {
    mobile: '9876543210',
    password: 'customer123',
    name: 'Demo Customer',
    isAdmin: false
  },
  ADMIN: {
    mobile: '9999999999',
    password: 'admin123',
    name: 'Admin User',
    isAdmin: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    // Only allow demo credentials
    let userData: User | null = null;
    if (mobile === DEMO_USERS.CUSTOMER.mobile && password === DEMO_USERS.CUSTOMER.password) {
      userData = {
        id: Date.now().toString(),
        mobile,
        name: DEMO_USERS.CUSTOMER.name,
        isAdmin: false
      };
    } else if (mobile === DEMO_USERS.ADMIN.mobile && password === DEMO_USERS.ADMIN.password) {
      userData = {
        id: Date.now().toString(),
        mobile,
        name: DEMO_USERS.ADMIN.name,
        isAdmin: true
      };
    }
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (mobile: string, name: string, password: string): Promise<boolean> => {
    // In demo, just simulate success and create a new customer account
    const userData: User = {
      id: Date.now().toString(),
      mobile,
      name,
      isAdmin: false // New registrations are always customers
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};