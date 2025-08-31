import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    login(credentialResponse.credential).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-xl shadow-lg text-center max-w-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Finance Tracker</h1>
        <p className="text-gray-500 mb-6">Welcome! Sign in to manage your finances.</p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert('Google Login Failed')}
          width="320px"
          theme="filled_blue"
        />
      </div>
    </div>
  );
};

export default LoginPage;
