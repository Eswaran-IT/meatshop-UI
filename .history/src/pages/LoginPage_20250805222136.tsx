import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, Key, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Login states
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMobile, setForgotPasswordMobile] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const { login } = useAuth();
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
        navigate('/');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid mobile number or password",
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

  const handleForgotPassword = async () => {
    if (!forgotPasswordMobile || forgotPasswordMobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setForgotPasswordLoading(true);
    // Simulate password reset
    setTimeout(() => {
      toast({
        title: "Reset Link Sent",
        description: "Check your SMS for password reset instructions",
      });
      setForgotPasswordLoading(false);
      setShowForgotPassword(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to your account</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {!showForgotPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your 10-digit mobile number"
                      className="pl-10"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-xs"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <div className="text-center text-sm mt-6">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="font-medium text-lg">Forgot Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your mobile number to receive a password reset link
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgot-mobile">Mobile Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="forgot-mobile"
                      type="tel"
                      placeholder="Enter your 10-digit mobile number"
                      className="pl-10"
                      value={forgotPasswordMobile}
                      onChange={(e) => setForgotPasswordMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
