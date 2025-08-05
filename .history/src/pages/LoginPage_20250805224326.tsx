import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

// Test credentials display component
const TestCredentialsDisplay: React.FC<{
  setMobile: (mobile: string) => void;
  setPassword: (password: string) => void;
}> = ({ setMobile, setPassword }) => {
  const [showCredentials, setShowCredentials] = useState(false);
  
  return (
    <div className="mb-6">
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
                  onClick={() => {
                    setMobile(testCredentials.customer.mobile);
                    setPassword(testCredentials.customer.password);
                  }}
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
                  onClick={() => {
                    setMobile(testCredentials.admin.mobile);
                    setPassword(testCredentials.admin.password);
                  }}
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
  );
};

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
                {/* Test credentials display */}
                <TestCredentialsDisplay setMobile={setMobile} setPassword={setPassword} />
              
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
