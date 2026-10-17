import React, { useState } from 'react';
import { Currency } from '../types/finance';
import { UserProfile } from '../services/auth';
import { PaisaWaisaLogo } from '../components/PaisaWaisaLogo';

interface ProfileViewProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userProfile: UserProfile;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  isAuthenticating: boolean;
  onUpdateProfileName: (name: string, email: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currency,
  onCurrencyChange,
  isDarkMode,
  onToggleDarkMode,
  userProfile,
  onGoogleSignIn,
  onGoogleSignOut,
  isAuthenticating,
  onUpdateProfileName,
}) => {
  const [upiId, setUpiId] = useState('chetnabisen@okhdfcbank');
  const [room, setRoom] = useState('Hostel 15, Room 218');
  const [phone, setPhone] = useState('+91 98201 44820');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-semibold">
            Identity &amp; Account Settings
          </span>
          {userProfile.isGoogleConnected && (
            <span className="inline-flex items-center gap-1 px-space-sm py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Google Account Connected
            </span>
          )}
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
          Profile &amp; Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
          Campus financial profile synchronized with your verified Google Account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* User Card (4 Cols) */}
        <div className="lg:col-span-4 p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col items-center text-center">
          <div className="relative">
            {userProfile.photoUrl ? (
              <img
                alt={userProfile.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-md"
                src={userProfile.photoUrl}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-primary/20">
                {userProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <span
              title="Verified Student Identity"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-bold shadow-xs ring-2 ring-surface"
            >
              ✓
            </span>
          </div>

          <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-3">
            {userProfile.name}
          </h3>
          <span className="text-xs text-on-surface-variant font-mono mt-0.5">
            {userProfile.email}
          </span>
          <span className="text-xs text-primary font-bold mt-1">
            {userProfile.institution}
          </span>

          {/* Google Sync Action Box */}
          <div className="w-full mt-space-md p-space-md rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
              Google Account Sync
            </span>
            {userProfile.isGoogleConnected ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-xs text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  Synced with Google Profile
                </span>
                <button
                  type="button"
                  onClick={onGoogleSignOut}
                  className="w-full py-1.5 px-3 rounded-lg bg-surface-container-high text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Disconnect Account
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>
                  {isAuthenticating ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </button>
            )}
          </div>

          <div className="w-full mt-space-md pt-space-sm border-t border-surface-container-high flex flex-col gap-2 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Email:</span>
              <span className="font-semibold text-on-surface font-mono truncate max-w-[170px]" title={userProfile.email}>
                {userProfile.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Department:</span>
              <span className="font-semibold text-on-surface">{department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Hostel:</span>
              <span className="font-semibold text-on-surface">{room}</span>
            </div>
          </div>
        </div>

        {/* Settings Form (8 Cols) */}
        <div className="lg:col-span-8 p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <form onSubmit={handleSave} className="flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-base font-bold text-on-surface pb-space-xs border-b border-surface-container-high">
              Student Information &amp; App Customization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => onUpdateProfileName(e.target.value, userProfile.email)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-surface-container-high outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Google Account Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-mono text-sm border border-surface-container-high outline-none opacity-80"
                />
              </div>
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Primary Campus UPI Virtual Payment Address (VPA)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-mono text-sm border border-surface-container-high outline-none focus:border-primary"
              />
              <span className="text-[11px] text-on-surface-variant mt-1 block">
                Linked to Google Pay and campus QR terminals for 1-click settlements.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Hostel &amp; Room
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-surface-container-high outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Phone (for WhatsApp Alerts)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-surface-container-high outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Display Currency
              </label>
              <div className="inline-flex rounded-lg bg-surface-container-low p-1 border border-surface-container-high">
                {(['INR', 'USD', 'EUR'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => onCurrencyChange(curr)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      currency === curr
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {curr === 'INR' ? '₹ INR (Rupees)' : curr === 'USD' ? '$ USD' : '€ EUR'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-on-surface">Color Theme</span>
                <span className="text-xs text-on-surface-variant">
                  Toggle between Neo-Campus Mint light and deep navy dark mode
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
              >
                {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>

            {savedSuccess && (
              <div className="p-2.5 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Student profile parameters updated successfully!
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-md transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PaisaWaisa Brand Identity & Logo Kit */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-sm border-b border-surface-container-high">
          <div>
            <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
              Official Brand Identity
            </span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              PaisaWaisa Logo &amp; Assets
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Vector assets designed for web dashboards, presentation pitch decks, and GitHub repositories.
            </p>
          </div>
          <a
            href="/paisawaisa-logo.svg"
            download="PaisaWaisa_Logo_Master.svg"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download Vector SVG</span>
          </a>
        </div>

        {/* Logo Variations Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* 1. Full Horizontal Lockup (Light Canvas) */}
          <div className="p-6 rounded-xl bg-[#FAFAF8] border border-slate-200 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Primary Lockup (Light)
            </span>
            <div className="py-2">
              <PaisaWaisaLogo variant="horizontal" size="lg" showTagline={true} />
            </div>
            <span className="text-[10px] text-slate-400">Header &amp; Navbars</span>
          </div>

          {/* 2. Full Horizontal Lockup (Dark Canvas) */}
          <div className="p-6 rounded-xl bg-[#092B28] border border-[#115E59] flex flex-col items-center justify-center text-center gap-3 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Dark Mode Lockup
            </span>
            <div className="py-2">
              <PaisaWaisaLogo variant="horizontal" size="lg" showTagline={true} />
            </div>
            <span className="text-[10px] text-emerald-400/80">Dark Surfaces &amp; Splash</span>
          </div>

          {/* 3. Centered Brand Mark / App Icon */}
          <div className="p-6 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center justify-center text-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Favicon / App Icon
            </span>
            <div className="py-1">
              <PaisaWaisaLogo variant="mark" size="lg" showTagline={false} />
            </div>
            <span className="text-[10px] text-on-surface-variant">
              Favicon, App Launcher &amp; Badges
            </span>
          </div>
        </div>

        {/* Brand Architecture Specs */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-wrap gap-4 items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#093F3C]" />
            <span>Dark Teal: <strong className="text-on-surface">#093F3C (Paisa)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#059669]" />
            <span>Emerald Green: <strong className="text-on-surface">#059669 (Waisa)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#34D399]" />
            <span>Mint Green: <strong className="text-on-surface">#34D399 (Arrow)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]" />
            <span>Golden Yellow: <strong className="text-on-surface">#F59E0B (Coins)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
