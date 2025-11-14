'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiLogIn, FiShield, FiArrowRightCircle } from 'react-icons/fi';
import Link from 'next/link';

const CmsLoginPage = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIdentifier('admin');
    setPassword('admin');

    const storedSession = window.localStorage.getItem('cmsSession');
    const storedUser = window.localStorage.getItem('cmsUser');

    if (storedSession && storedUser) {
      router.replace('/cms/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      setError('Please enter both identifier and password.');
      return;
    }

    setLoading(true);

    if (trimmedIdentifier === 'admin' && trimmedPassword === 'admin') {
      const fakeUser = {
        id: 'cms-static-admin',
        email: 'admin@cms.local',
        name: 'CMS Administrator',
      };
      const fakeSession = {
        access_token: `cms-static-${Date.now()}`,
        user: fakeUser,
      };

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cmsSession', JSON.stringify(fakeSession));
        window.localStorage.setItem('cmsUser', JSON.stringify(fakeUser));
      }

      setSuccess('Static login successful. Welcome to the CMS dashboard.');
      setLoading(false);
      router.replace('/cms/dashboard');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmedIdentifier,
          password: trimmedPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
      setError(payload.error || 'Unable to log in. Please check your credentials.');
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cmsSession', JSON.stringify(payload.session));
      window.localStorage.setItem('cmsUser', JSON.stringify(payload.user));
    }

    setSuccess('Login successful. You may proceed to the CMS dashboard.');
    setPassword('');
    router.replace('/cms/dashboard');
    } catch (err) {
      console.error('CMS login error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.25),transparent_55%)] opacity-80 pointer-events-none" />
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/10 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#1f2937]/80 via-[#312e81]/80 to-[#0f172a]/80 px-10 py-12 border-r border-white/10">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.35em] uppercase text-slate-300">
              <FiShield className="text-[#38bdf8]" />
              Secure Access
            </p>
            <h1 className="mt-4 text-3xl font-bold text-white">CMS Control Center</h1>
            <p className="mt-3 text-sm text-slate-200 leading-relaxed">
              Manage products, orders, and inventory across your hi-tech storefront with a single, powerful dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center text-[#38bdf8]">
                <FiLock />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Enterprise Grade Security</p>
                <p className="text-xs text-slate-300">Protected with service-role credentials and auditing.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center text-[#38bdf8]">
                <FiArrowRightCircle />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Lightning Fast Workflows</p>
                <p className="text-xs text-slate-300">Jump into dashboards the moment you authenticate.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 sm:px-10 py-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-[0.25em] text-slate-200">
              <FiLogIn className="text-[#38bdf8]" />
              Sign in
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Welcome back, Administrator</h2>
            <p className="mt-2 text-sm text-slate-300">
              Use your CMS credentials to continue. Need access? Contact your hi-tech platform owner.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-200">
                Email or Username
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/60 rounded-lg px-4 py-3 pr-12 text-sm placeholder:text-slate-400 text-white transition disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm"
                  placeholder="admin@example.com"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-300">
                  <FiShield />
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/60 rounded-lg px-4 py-3 pr-12 text-sm placeholder:text-slate-400 text-white transition disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-300">
                  <FiLock />
                </span>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-400/40 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/40 rounded-lg px-4 py-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#38bdf8] to-[#6366f1] hover:from-[#0ea5e9] hover:to-[#4338ca] text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#6366f1]/40 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-xs text-slate-300 text-center leading-5">
            Ensure that your CMS user exists in the <code>cmsusers</code> table with accurate credentials.
            {` `}
            <Link href="/" className="text-[#38bdf8] hover:text-[#60a5fa] font-semibold">
              Return to storefront
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CmsLoginPage;