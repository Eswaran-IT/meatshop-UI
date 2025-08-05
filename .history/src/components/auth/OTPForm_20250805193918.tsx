import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, Key, User } from 'lucide-react';

interface OTPFormProps {
  onSuccess: () => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'register'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
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

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 4-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await login(mobile, otp);
      if (success) {
        onSuccess();
      } else {
        // Assume new user needs registration
        setIsNewUser(true);
        setStep('register');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await register(mobile, name, otp);
      if (success) {
        onSuccess();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-meat-red-light to-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            {step === 'mobile' && 'Welcome to MeatShop'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'register' && 'Complete Registration'}
          </CardTitle>
          <CardDescription>
            {step === 'mobile' && 'Enter your mobile number to continue'}
            {step === 'otp' && `Enter the OTP sent to ${mobile}`}
            {step === 'register' && 'Please provide your name to complete registration'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 'mobile' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSendOtp} 
                disabled={loading || mobile.length !== 10}
                className="w-full"
                variant="meat"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="otp"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="pl-10 text-center text-lg tracking-widest"
                    maxLength={4}
                  />
                </div>
              </div>
              <Button 
                onClick={handleVerifyOtp} 
                disabled={loading || otp.length !== 4}
                className="w-full"
                variant="meat"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button 
                onClick={() => setStep('mobile')} 
                variant="ghost"
                className="w-full"
              >
                Change Mobile Number
              </Button>
            </>
          )}

          {step === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={handleRegister} 
                disabled={loading || !name.trim()}
                className="w-full"
                variant="meat"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Use OTP: <span className="font-bold">1234</span> for demo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPForm;