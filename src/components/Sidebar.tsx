import React from 'react';
import { NavItem } from '../types/finance';
import { PaisaWaisaLogo } from './PaisaWaisaLogo';

interface SidebarProps {
  activeNav: NavItem;
  onSelectNav: (item: NavItem) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: NavItem; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'receipt_long' },
    { id: 'budget-planner', label: 'Budget Planner', icon: 'pie_chart' },
    { id: 'smart-save-ai', label: 'Smart Save AI', icon: 'smart_toy' },
    { id: 'savings-goals', label: 'Savings Goals', icon: 'savings' },
    { id: 'recurring-and-reminders', label: 'Recurring & Reminders', icon: 'event_repeat' },
    { id: 'financial-reports', label: 'Financial Reports', icon: 'query_stats' },
    { id: 'challenges-and-streaks', label: 'Challenges & Streaks', icon: 'military_tech' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[0_1px_16px_rgba(15,23,42,0.04)] border-r border-surface-container-high transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Brand Area */}
        <div className="p-space-lg flex flex-col gap-space-xs border-b border-surface-container-high/40">
          <div className="flex items-center justify-between">
            <PaisaWaisaLogo variant="horizontal" size="sm" showTagline={false} />
            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <div className="mt-space-xs">
            <span className="inline-flex items-center px-space-sm py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wide font-bold">
              Spend Smart • Save More • Live Better
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-space-md py-space-xs flex-1">
          <div className="px-space-sm mb-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Finance Hub
          </div>
          <nav className="flex flex-col gap-space-xs">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectNav(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all text-left w-full ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </button>
              );
            })}

            <div className="my-space-sm mx-space-sm h-px bg-surface-container-high" />

            <button
              onClick={() => {
                onSelectNav('profile-and-settings');
                onCloseMobile();
              }}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all text-left w-full ${
                activeNav === 'profile-and-settings'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span className="font-body-md text-body-md">Profile &amp; Settings</span>
            </button>
          </nav>
        </div>

        {/* 7-Day Streak Widget */}
        <div className="p-space-md m-space-md rounded-xl bg-surface-container-low border border-surface-container-high">
          <div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm">
            <span className="material-symbols-outlined text-xl text-primary animate-pulse">
              local_fire_department
            </span>
            <span className="font-metric-num-sm text-metric-num-sm font-bold">7-Day Streak</span>
          </div>
          <p className="mt-space-xs text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
            No non-essential spend today! ₹320 saved towards Goa trip.
          </p>
        </div>
      </aside>
    </>
  );
};
