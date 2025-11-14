'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiSettings,
  FiRefreshCw,
  FiArrowLeft,
  FiBell,
  FiShield,
  FiLock,
  FiMail,
  FiUser,
  FiSave,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';

const defaultPreferences = {
  newsletter: true,
  productUpdates: true,
  orderAlerts: true,
  securityAlerts: true,
};

const defaultProfile = {
  displayName: '',
  supportEmail: '',
  supportPhone: '',
  companyName: '',
  signature: '',
};

const CmsSettingsPage = () => {
  const router = useRouter();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [profile, setProfile] = useState(defaultProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUser = window.localStorage.getItem('cmsUser');
    const storedSession = window.localStorage.getItem('cmsSession');

    if (!storedUser || !storedSession) {
      router.replace('/cms/auth/login');
    }

    try {
      const pref = window.localStorage.getItem('cmsSettings.preferences');
      const prof = window.localStorage.getItem('cmsSettings.profile');
      if (pref) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(pref) });
      }
      if (prof) {
        setProfile({ ...defaultProfile, ...JSON.parse(prof) });
      }
    } catch (error) {
      console.error('Failed to parse settings from storage:', error);
    }
  }, [router]);

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleProfileChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    try {
      setSaving(true);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cmsSettings.preferences', JSON.stringify(preferences));
        window.localStorage.setItem('cmsSettings.profile', JSON.stringify(profile));
      }
      setTimeout(() => {
        setSaving(false);
      }, 800);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,29,149,0.25),transparent_55%)] opacity-80 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.35em] uppercase text-slate-300">
              <FiSettings className="text-[#38bdf8]" /> Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">CMS Preferences</h1>
            <p className="mt-1 text-sm text-slate-300">
              Update your personal profile, contact information, and notification preferences for the hi-tech CMS.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/cms/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition shadow-lg shadow-black/10"
            >
              <FiArrowLeft />
              Back to dashboard
            </Link>
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#38bdf8] to-[#6366f1] hover:from-[#0ea5e9] hover:to-[#4338ca] text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-[#6366f1]/30"
            >
              <FiRefreshCw className="text-lg" />
              Reload
            </button>
          </div>
        </header>

        <section className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-white">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Profile & Support</h2>
                <p className="text-xs text-white/70">
                  Personalize the profile that appears in CMS notifications and support emails.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-wide text-white/60 mb-1">Display Name</label>
                <input
                  value={profile.displayName}
                  onChange={(event) => handleProfileChange('displayName', event.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/60 transition"
                  placeholder="e.g. Abdul from Hi-Tech"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-wide text-white/60 mb-1">Company / Store Name</label>
                <input
                  value={profile.companyName}
                  onChange={(event) => handleProfileChange('companyName', event.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/60 transition"
                  placeholder="Hi-Tech Store"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-wide text-white/60 mb-1">Support Email</label>
                <div className="relative">
                  <input
                    value={profile.supportEmail}
                    onChange={(event) => handleProfileChange('supportEmail', event.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/60 transition pr-10"
                    placeholder="support@hi-tech.com"
                  />
                  <FiMail className="absolute top-1/2 right-3 -translate-y-1/2 text-white/50" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-wide text-white/60 mb-1">Support Phone</label>
                <input
                  value={profile.supportPhone}
                  onChange={(event) => handleProfileChange('supportPhone', event.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/60 transition"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wide text-white/60 mb-1">Email Signature</label>
              <textarea
                value={profile.signature}
                onChange={(event) => handleProfileChange('signature', event.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/60 transition min-h-[120px]"
                placeholder="Regards,\nAbdul at Hi-Tech Store"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-white">
                <FiBell className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                <p className="text-xs text-white/70">
                  Choose the alerts you want to receive from the hi-tech CMS platform.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'newsletter',
                  title: 'Monthly newsletter',
                  description: 'Summary of new features, promotions, and insights.',
                  icon: FiMail,
                },
                {
                  id: 'productUpdates',
                  title: 'Product updates',
                  description: 'Alerts when new product types or categories are added.',
                  icon: FiSettings,
                },
                {
                  id: 'orderAlerts',
                  title: 'Order alerts',
                  description: 'Notifications whenever an order is placed or status changes.',
                  icon: FiBell,
                },
                {
                  id: 'securityAlerts',
                  title: 'Security alerts',
                  description: 'Critical info about logins, permissions, and security changes.',
                  icon: FiShield,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isEnabled = !!preferences[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center text-white">
                        <Icon />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-white/70">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceToggle(item.id)}
                      className="text-white focus:outline-none"
                    >
                      {isEnabled ? (
                        <FiToggleRight className="text-3xl text-[#38bdf8]" />
                      ) : (
                        <FiToggleLeft className="text-3xl text-white/50" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-white">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Security & Access</h2>
                <p className="text-xs text-white/70">
                  Review your security posture and recommended best practices for the CMS.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FiShield /> Two-factor authentication
                </h3>
                <p className="text-xs text-white/70">
                  Enabling 2FA secures your admin access with an additional verification step.
                </p>
                <button className="text-xs font-semibold text-[#38bdf8] hover:text-[#60a5fa] transition">
                  Configure 2FA
                </button>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FiShield /> Session activity
                </h3>
                <p className="text-xs text-white/70">
                  Monitor recent logins and sign-outs to spot suspicious access early.
                </p>
                <button className="text-xs font-semibold text-[#38bdf8] hover:text-[#60a5fa] transition">
                  View activity log
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-[#38bdf8] to-[#6366f1] hover:from-[#0ea5e9] hover:to-[#4338ca] text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-[#6366f1]/40 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CmsSettingsPage;

