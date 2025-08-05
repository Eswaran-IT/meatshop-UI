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
  sendOtp: (mobile: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin mobile numbers (in real app, this would come from API)
const ADMIN_MOBILES = ['9999999999'];

// Mock credentials as specified in FINAL_STATUS.md
const MOCK_CREDENTIALS = {
  '9876543210': 'customer123', // Customer
  '9999999999': 'admin123'     // Admin
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

  const sendOtp = async (mobile: string): Promise<boolean> => {
    // Mock API call
    console.log(`Sending OTP to ${mobile}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const login = async (mobile: string, password: string): Promise<boolean> => {
    // Use password instead of OTP for the specified credentials
    if (MOCK_CREDENTIALS[mobile as keyof typeof MOCK_CREDENTIALS] === password) {
      const isAdmin = ADMIN_MOBILES.includes(mobile);
      const userData: User = {
        id: Date.now().toString(),
        mobile,
        name: isAdmin ? 'Admin User' : 'Customer',
        isAdmin
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (mobile: string, name: string, password: string): Promise<boolean> => {
    // For mock implementation, accept any new registration with password
    // In real app, this would validate and create new user
    const isAdmin = ADMIN_MOBILES.includes(mobile);
    const userData: User = {
      id: Date.now().toString(),
      mobile,
      name,
      isAdmin
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
    sendOtp,
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