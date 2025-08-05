import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, User, Key, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Register states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();

  const handleRequestOTP = () => {
    if (!mobile || mobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsRequestingOTP(true);
    // Simulate OTP sending
    setTimeout(() => {
      toast({
        title: "OTP Sent",
        description: "Check your mobile for the OTP",
      });
      setIsRequestingOTP(false);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP sent to your mobile",
        variant: "destructive"
      });
      return;
    }

    // Simulate OTP verification
    setTimeout(() => {
      setIsOTPVerified(true);
      toast({
        title: "OTP Verified",
        description: "Your mobile number has been verified",
      });
    }, 1000);
  };

  const handleRegister = async () => {
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (!isOTPVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your mobile number with OTP",
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

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "The passwords you entered do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, mobile, password);
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully",
        });
        navigate('/login');
      } else {
        toast({
          title: "Registration Failed",
          description: "This mobile number might already be registered",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">Sign up for a new account</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                    disabled={isOTPVerified}
                  />
                </div>
              </div>

              {!isOTPVerified && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>&nbsp;</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full h-10" 
                        onClick={handleRequestOTP}
                        disabled={isRequestingOTP}
                      >
                        {isRequestingOTP ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Get OTP'
                        )}
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="w-full h-10" 
                        onClick={handleVerifyOTP}
                        disabled={!otp || otp.length !== 6}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isOTPVerified && (
                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Verified</AlertTitle>
                  <AlertDescription>
                    Mobile number verified successfully
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleRegister}
                disabled={loading || !isOTPVerified}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </Button>

              <div className="text-center text-sm mt-6">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
