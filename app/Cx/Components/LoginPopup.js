'use client';

import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { openSans } from '../Font/font';

const LoginPopup = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute top-full right-0 mt-2 w-96 bg-white rounded-sm shadow-2xl z-50 border border-gray-200 ${openSans.className}`}
      onMouseEnter={(e) => {
        e.stopPropagation();
        // Keep popup open when hovering over it
      }}
      onMouseLeave={(e) => {
        // Only close if not moving to parent or bridge
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onClose();
        }
      }}
    >
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
          Sign in to your account
        </h3>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <a
              href="#"
              className="text-sm text-[#00aeef] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                // Handle forgot password
              }}
            >
              Forgot Password
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FaRegEyeSlash className="text-lg" />
              ) : (
                <FaRegEye className="text-lg" />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#00aeef] hover:bg-[#0099d9] text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition mb-4">
          LOGIN
          <FiArrowRight />
        </button>

        {/* Create Account Section */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">Don't have account</p>
          <button className="w-full border-2 border-[#00aeef] text-[#00aeef] hover:bg-[#00aeef] hover:text-white py-3 rounded-sm font-bold transition">
            CREATE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
