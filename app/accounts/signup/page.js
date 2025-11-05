'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import Navbar from '../../Cx/Layout/Navbar';
import Footer from '../../Cx/Layout/Footer';
import { openSans } from '../../Cx/Font/font';

const SignInPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Try backend API login
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse response:', jsonError);
          setError('Invalid response from server. Please check if the server is running correctly.');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorMessage = data.error || 'Authentication failed';
          console.error('Backend login error:', errorMessage);
          setError(errorMessage);
          setLoading(false);
          return;
        }

        // Login successful
        setSuccess(true);
        setError('');

        // Store user data
        if (data.user || data.userData) {
          localStorage.setItem('user', JSON.stringify(data.user || data.userData));
          localStorage.setItem('session', JSON.stringify(data.session));
        }

        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 1000);
        return;
      } catch (backendError) {
        // If backend is not available, show error
        if (backendError.name === 'TypeError' || backendError.message.includes('fetch')) {
          console.error('Backend server not reachable:', backendError);
          setError('Backend server is not running. Please start the server with: npm run server');
          setLoading(false);
          return;
        }
        throw backendError;
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Call backend API for registration
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Registration successful
      setSuccess(true);
      setError('');

      // Store user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('session', JSON.stringify(data.session));
      }

      // Redirect to home page
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login here
    alert('Google login will be implemented with OAuth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Sticky Breadcrumb */}
      <div className={`sticky top-0 z-40 bg-gray-100 border-b border-gray-200 shadow-sm ${openSans.className}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-[#00aeef] transition">
              Home
            </a>
            <span className='text-blue-500'>›</span>
            <span className="text-blue-500">Sign In</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`grow bg-gray-50 py-16 ${openSans.className}`}>
        <div className="container mx-auto px-4">
          {/* Sign In / Sign Up Card */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => {
                  setActiveTab('signin');
                  setError('');
                }}
                className={`flex-1 py-4 text-center font-semibold transition ${
                  activeTab === 'signin'
                    ? 'text-[#00aeef] border-b-2 border-[#00aeef]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setError('');
                }}
                className={`flex-1 py-4 text-center font-semibold transition ${
                  activeTab === 'signup'
                    ? 'text-[#00aeef] border-b-2 border-[#00aeef]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">
                    {activeTab === 'signin' ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...'}
                  </p>
                </div>
              )}

              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-sm text-[#00aeef] hover:underline"
                        onClick={() => {
                          router.push('/accounts/forgot-password');
                        }}
                      >
                        Forget Password?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <FaRegEyeSlash className="text-lg" />
                        ) : (
                          <FaRegEye className="text-lg" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00aeef] hover:bg-[#0099d9] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-md font-bold flex items-center justify-center gap-2 transition mb-4"
                  >
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    {!loading && <FiArrowRight />}
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FcGoogle className="text-2xl" />
                    Login with Google
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp}>
                  {/* Name Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <FaRegEyeSlash className="text-lg" />
                        ) : (
                          <FaRegEye className="text-lg" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00aeef] hover:bg-[#0099d9] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-md font-bold flex items-center justify-center gap-2 transition mb-4"
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    {!loading && <FiArrowRight />}
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Google Sign Up */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FcGoogle className="text-2xl" />
                    Sign up with Google
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignInPage;

