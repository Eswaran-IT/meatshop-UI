import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, Key, User } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'login' | 'register'>('login');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
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

    setLoading(true);
    try {
      const success = await login(mobile, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        onSuccess();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid mobile number or password. Try: 9876543210/customer123 or 9999999999/admin123",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!mobile || mobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await register(mobile, name, password);
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to Butcher Blend!",
        });
        onSuccess();
      } else {
        toast({
          title: "Registration Failed",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {step === 'login' && 'Welcome to Butcher Blend'}
            {step === 'register' && 'Create Account'}
          </CardTitle>
          <CardDescription>
            {step === 'login' && 'Enter your credentials to continue'}
            {step === 'register' && 'Sign up for a new account'}
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
          {step === 'register' && (
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
                placeholder={step === 'login' ? "Enter your password" : "Create a password"}
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Demo Credentials Info */}
          {step === 'login' && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Customer: 9876543210 / customer123</p>
              <p>Admin: 9999999999 / admin123</p>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={step === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Processing...' : (step === 'login' ? 'Login' : 'Create Account')}
          </Button>

          {/* Switch between Login/Register */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setStep(step === 'login' ? 'register' : 'login')}
              disabled={loading}
            >
              {step === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
