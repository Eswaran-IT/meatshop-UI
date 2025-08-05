import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, User, Key, Info } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode = 'login', onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract redirect parameter if it exists
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');
  
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const { login, register } = useAuth();
  const { toast } = useToast();

  // Test credentials
  const testCredentials = {
    customer: { 
      mobile: '9876543210', 
      password: 'customer123',
      name: 'Demo Customer'
    },
    admin: { 
      mobile: '9999999999', 
      password: 'admin123',
      name: 'Admin User'
    }
  };

  const handleSubmit = async () => {
    // Form validation
    if (!mobile || mobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        toast({
          title: "Name Required",
          description: "Please enter your name",
          variant: "destructive"
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure your passwords match",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    
    try {
      let success;
      
      if (mode === 'login') {
        success = await login(mobile, password);
        if (success) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid mobile number or password",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      } else {
        success = await register(mobile, name, password);
        if (success) {
          toast({
            title: "Registration Successful",
            description: "Your account has been created!",
          });
        } else {
          toast({
            title: "Registration Failed",
            description: "There was a problem creating your account",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      // Handle redirection
      if (redirect) {
        navigate(`/${redirect}`);
      } else if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: mode === 'login' ? "Login failed" : "Registration failed",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const applyTestCredentials = (type: 'customer' | 'admin') => {
    setMobile(testCredentials[type].mobile);
    setPassword(testCredentials[type].password);
    if (mode === 'register') {
      setName(testCredentials[type].name);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' ? 'Sign in to your Butcher Blend account' : 'Join Butcher Blend today'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mobile Number Input */}
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              className="pl-10"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={loading}
            />
          </div>
        </div>

        {/* Name Input (for registration) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && mode === 'login') {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>

        {/* Confirm Password Input (for registration) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Test Credentials - Only for login */}
        {mode === 'login' && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Info className="h-4 w-4 mr-1 text-blue-500" />
                Test Credentials
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCredentials(!showCredentials)}
                className="h-8 text-xs"
              >
                {showCredentials ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showCredentials && (
              <div className="space-y-3">
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Customer</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => useTestCredentials('customer')}
                      >
                        Use
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500">Mobile:</div>
                      <div className="font-mono">{testCredentials.customer.mobile}</div>
                      <div className="text-gray-500">Password:</div>
                      <div className="font-mono">{testCredentials.customer.password}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-red-200 bg-red-50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Administrator</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => useTestCredentials('admin')}
                      >
                        Use
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500">Mobile:</div>
                      <div className="font-mono">{testCredentials.admin.mobile}</div>
                      <div className="text-gray-500">Password:</div>
                      <div className="font-mono">{testCredentials.admin.password}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading 
            ? (mode === 'login' ? 'Logging in...' : 'Creating Account...') 
            : (mode === 'login' ? 'Login' : 'Create Account')
          }
        </Button>

        {/* Switch between Login/Register */}
        <div className="flex justify-center">
          <Link 
            to={mode === 'login' ? '/register' : '/login'} 
            className="text-sm text-blue-600 hover:underline"
          >
            {mode === 'login' 
              ? "Don't have an account? Register here" 
              : "Already have an account? Login here"
            }
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
