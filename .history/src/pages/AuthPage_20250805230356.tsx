import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';

const AuthPage: React.FC = () => {
  const location = useLocation();
  if (location.pathname.includes('register')) {
    return <RegisterPage />;
  }
  return <LoginPage />;
};

export default AuthPage;
