import React, { useState } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

const Login: React.FC = () => {
  const { login, signup, googleLogin } = useAuth();
  const { navigate } = useNavigation();

  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
    setIsLoading(false);
    setShowPassword(false);
  };
  
  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const action = isLoginView ? login : signup;
    
    // Simulate API call
    setTimeout(() => {
        const result = action(username, password);
        if (result.success) {
            const loggedInUser = isLoginView ? login(username, password).user : signup(username, password).user;
            if (loggedInUser.role === 'admin') {
                navigate('admin');
            } else {
                navigate('store');
            }
        } else {
            setError(result.message || 'An error occurred.');
        }
        setIsLoading(false);
    }, 1000);
  };
  
  const handleGoogleLogin = () => {
    const result = googleLogin();
    if(result.success) {
        navigate('store');
    } else {
        setError(result.message || 'Could not sign in with Google.');
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isLoginView ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button onClick={handleToggleView} className="font-medium text-blue-600 hover:text-blue-500">
              {isLoginView ? 'start your 14-day free trial' : 'sign in to your account'}
            </button>
          </p>
        </div>
        <div className="space-y-4">
            <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                <GoogleIcon className="w-5 h-5" />
                Sign {isLoginView ? 'in' : 'up'} with Google
            </button>
        </div>
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password-input" className="sr-only">
                Password
              </label>
              <input
                id="password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center text-sm text-red-600 pt-2">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                <span>{error}</span>
            </div>
            )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isLoginView ? 'Sign in' : 'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
