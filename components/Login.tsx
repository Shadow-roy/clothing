import React, { useState } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

const Login: React.FC = () => {
  const { login, signup } = useAuth();
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
    setError('');

    if (!username || !password) {
      setError('Please fill out all fields.');
      return;
    }
    
    setIsLoading(true);
    const action = isLoginView ? login : signup;
    
    // Simulate API call
    setTimeout(() => {
        const result = action(username, password);
        if (result.success) {
            if (result.user?.role === 'admin') {
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
  
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center font-serif text-4xl font-bold text-gray-800 dark:text-white">ChicChariot</h1>
        <div className="p-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              {isLoginView ? 'Login' : 'Sign Up'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {isLoginView ? 'Access your account and track your orders' : 'Create an account to get started'}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
            </div>

            {error && (
              <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  <span>{error}</span>
              </div>
              )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
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
                  isLoginView ? 'Login' : 'Create account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={handleToggleView} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none">
                {isLoginView ? 'Sign up' : 'Login'}
              </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;