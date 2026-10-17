import React from 'react';
import { Currency } from '../types/finance';
import { UserProfile } from '../services/auth';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenAddTransaction: () => void;
  onOpenNotifications: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  unreadAlertCount: number;
  userProfile: UserProfile;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  isAuthenticating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onOpenAddTransaction,
  onOpenNotifications,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  unreadAlertCount,
  userProfile,
  onGoogleSignIn,
  onGoogleSignOut,
  isAuthenticating,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 border-b border-surface-container-high transition-colors">
      <div className="h-16 w-full px-space-md lg:px-space-lg flex items-center justify-between gap-space-md">
        {/* Left Side */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* Mobile hamburger menu */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface cursor-pointer"
            aria-label="Open sidebar"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          {/* Academic Semester Indicator */}
          <div className="hidden sm:inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container-low text-on-surface border border-surface-container-high">
            <span className="material-symbols-outlined text-sm text-primary">school</span>
            <span className="font-label-md text-label-md font-semibold text-on-surface">
              Sem 4 - Spring 2025
            </span>
          </div>

          {/* Currency Switcher */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-container-low border border-surface-container-high">
            <button
              onClick={() => onCurrencyChange('INR')}
              className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                currency === 'INR'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              $ USD
            </button>
            <button
              onClick={() => onCurrencyChange('EUR')}
              className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                currency === 'EUR'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              € EUR
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-space-md">
          {/* Add Transaction Button */}
          <button
            onClick={onOpenAddTransaction}
            className="inline-flex items-center gap-1.5 px-3 sm:px-space-md py-1.5 sm:py-space-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-[0_4px_14px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span className="whitespace-nowrap">+ Add Transaction</span>
          </button>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Campus Notifications"
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-tertiary-container ring-2 ring-surface" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-surface-container-high" />

          {/* Student Profile Lockup with Google Sync */}
          <div className="flex items-center gap-space-sm pl-1">
            <div className="relative">
              {userProfile.photoUrl ? (
                <img
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full object-cover border border-primary/40 shadow-xs"
                  src={userProfile.photoUrl}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-xs shadow-xs border border-primary/30">
                  {userProfile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              {userProfile.isGoogleConnected && (
                <span
                  title="Google Account Connected"
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-secondary text-white flex items-center justify-center text-[8px] ring-1 ring-surface font-bold"
                >
                  ✓
                </span>
              )}
            </div>

            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                  {userProfile.name}
                </span>
                {userProfile.isGoogleConnected ? (
                  <span className="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    Google
                  </span>
                ) : (
                  <button
                    onClick={onGoogleSignIn}
                    disabled={isAuthenticating}
                    className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                    title="Connect Google Account"
                  >
                    {isAuthenticating ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
              <span className="font-label-sm text-label-sm text-primary leading-tight">
                {userProfile.institution}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
