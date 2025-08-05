import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, User, Key, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthPageProps {
  defaultTab?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ defaultTab = 'login' }) => {
  // Get tab from URL query parameter
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab') as 'login' | 'register' | null;
  
  // Login states
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register states
  const [registerName, setRegisterName] = useState('');
  const [registerMobile, setRegisterMobile] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMobile, setForgotPasswordMobile] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    tabFromUrl === 'login' || tabFromUrl === 'register' ? tabFromUrl : defaultTab
  );
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
    navigate(`/auth?tab=${value}`, { replace: true });
  };

  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!loginMobile || loginMobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    if (!loginPassword) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive"
      });
      return;
    }

    setLoginLoading(true);
    try {
      const success = await login(loginMobile, loginPassword);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        window.location.href = '/'; // Redirect to home page
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
    setLoginLoading(false);
  };

  const handleRegister = async () => {
    if (!registerMobile || registerMobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    if (!registerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (!registerPassword) {
      toast({
        title: "Password Required",
        description: "Please enter a password",
        variant: "destructive"
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setRegisterLoading(true);
    try {
      const success = await register(registerMobile, registerName, registerPassword);
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to Butcher Blend!",
        });
        window.location.href = '/'; // Redirect to home page
      } else {
        toast({
          title: "Registration Failed",
          description: "Mobile number might already be registered",
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
    setRegisterLoading(false);
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
    // In a real app, this would send a reset code to the user's phone
    // For demo, we'll just show a success message
    setTimeout(() => {
      toast({
        title: "Reset Link Sent",
        description: "Check your mobile for a password reset link",
      });
      setForgotPasswordLoading(false);
      setShowForgotPassword(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Butcher Blend</h1>
          <p className="text-muted-foreground">Fresh meat delivered to your doorstep</p>
        </div>
        
        {showForgotPassword ? (
          <Card>
            <CardContent className="pt-6 pb-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Forgot Password</h2>
                  <p className="text-sm text-muted-foreground">Enter your mobile number to reset your password</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="forgot-mobile">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10"
                      value={forgotPasswordMobile}
                      onChange={(e) => setForgotPasswordMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      disabled={forgotPasswordLoading}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={forgotPasswordLoading}
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} value={activeTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4">
              <Card>
                <CardContent className="pt-6 pb-8 space-y-6">
                  {/* Demo Credentials Info */}
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertTitle className="text-blue-800">Demo Accounts</AlertTitle>
                    <AlertDescription className="text-sm">
                      <div className="space-y-1 mt-2">
                        <p><strong>Customer:</strong> 9876543210 / customer123</p>
                        <p><strong>Admin:</strong> 9999999999 / admin123</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-mobile"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        className="pl-10"
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        disabled={loginLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-sm"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={loginLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleLogin}
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : 'Login'}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => setActiveTab('register')}
                    >
                      Create one now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register" className="mt-4">
              <Card>
                <CardContent className="pt-6 pb-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-mobile"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        className="pl-10"
                        value={registerMobile}
                        onChange={(e) => setRegisterMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        disabled={registerLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a strong password"
                        className="pl-10"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleRegister}
                    disabled={registerLoading}
                  >
                    {registerLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => setActiveTab('login')}
                    >
                      Login here
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
