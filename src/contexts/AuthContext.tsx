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
  login: (mobile: string, otp: string) => Promise<boolean>;
  register: (mobile: string, name: string, otp: string) => Promise<boolean>;
  sendOtp: (mobile: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin mobile numbers (in real app, this would come from API)
const ADMIN_MOBILES = ['9999999999', '8888888888'];

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

  const login = async (mobile: string, otp: string): Promise<boolean> => {
    // Mock API call - in real app, validate OTP
    if (otp === '1234') {
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

  const register = async (mobile: string, name: string, otp: string): Promise<boolean> => {
    // Mock API call - in real app, validate OTP and create user
    if (otp === '1234') {
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
    }
    return false;
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