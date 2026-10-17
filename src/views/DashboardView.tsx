import React from 'react';
import { BudgetCategory, Transaction, Currency, SavingsGoal } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface DashboardViewProps {
  categories: BudgetCategory[];
  transactions: Transaction[];
  totalMasterBudget: number;
  currency: Currency;
  onNavigateBudget: () => void;
  onOpenAddTransaction: () => void;
  savingsGoal: SavingsGoal;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  categories,
  transactions,
  totalMasterBudget,
  currency,
  onNavigateBudget,
  onOpenAddTransaction,
  savingsGoal,
}) => {
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const safeMargin = Math.max(0, totalMasterBudget - totalSpent);
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-semibold mb-1">
            Student Overview
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Campus Financial Control
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Real-time balance, instant UPI tracker, and campus burn rate for Chetna Bisen (IIT Bombay).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateBudget}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md border border-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-primary">pie_chart</span>
            <span>View Budget Planner</span>
          </button>
          <button
            onClick={onOpenAddTransaction}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md font-label-md text-label-md font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Add Spend</span>
          </button>
        </div>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
            Total Pocket + Stipend
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-metric-num-lg text-metric-num-lg text-on-surface font-bold">
              {formatCurrency(totalMasterBudget, currency)}
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
            April 2025 allocation
          </span>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
            Outflow So Far
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-metric-num-lg text-metric-num-lg text-tertiary font-bold">
              {formatCurrency(totalSpent, currency)}
            </span>
            <span className="text-xs text-on-surface-variant font-bold ml-1">
              ({Math.round((totalSpent / totalMasterBudget) * 100)}%)
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
            Across 8 campus categories
          </span>
        </div>

        <div className="p-space-lg rounded-xl bg-secondary-container/20 border border-secondary/20 shadow-sm">
          <span className="font-label-md text-label-md text-secondary block mb-1 font-semibold">
            Safe To Spend Margin
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-metric-num-lg text-metric-num-lg text-secondary font-bold">
              {formatCurrency(safeMargin, currency)}
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-secondary mt-1 block font-semibold">
            ~{formatCurrency(Math.round(safeMargin / 11), currency)}/day for 11 days
          </span>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
            Active Milestone Pot
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-metric-num-lg text-metric-num-lg text-primary font-bold">
              {formatCurrency(savingsGoal.currentAmount, currency)}
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
            {savingsGoal.title}
          </span>
        </div>
      </div>

      {/* 2-Column Split: Quick UPI Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left: Quick UPI Pay and Burn Gauge (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl bg-surface-container-lowest p-space-lg border border-surface-container-high shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Campus Fast Split &amp; UPI
              </h3>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                OCT Hostel
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Tap to quick-settle frequent campus tabs or split dinner with wingmates.
            </p>

            <div className="grid grid-cols-2 gap-space-sm">
              <button
                onClick={onOpenAddTransaction}
                className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high text-left transition-colors border border-surface-container-high cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">local_cafe</span>
                  <span className="font-bold text-sm text-on-surface">Canteen Chai Tab</span>
                </div>
                <span className="text-xs text-on-surface-variant block">Quick Log ₹20</span>
              </button>

              <button
                onClick={onOpenAddTransaction}
                className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high text-left transition-colors border border-surface-container-high cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">directions_subway</span>
                  <span className="font-bold text-sm text-on-surface">Metro Smartcard</span>
                </div>
                <span className="text-xs text-on-surface-variant block">Quick Top-Up ₹100</span>
              </button>

              <button
                onClick={onOpenAddTransaction}
                className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high text-left transition-colors border border-surface-container-high cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">print</span>
                  <span className="font-bold text-sm text-on-surface">Department Xerox</span>
                </div>
                <span className="text-xs text-on-surface-variant block">Quick Log ₹50</span>
              </button>

              <button
                onClick={onOpenAddTransaction}
                className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high text-left transition-colors border border-surface-container-high cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">group</span>
                  <span className="font-bold text-sm text-on-surface">Split Mess Bill</span>
                </div>
                <span className="text-xs text-on-surface-variant block">Equal Split by 4</span>
              </button>
            </div>
          </div>

          <div className="mt-space-lg p-space-sm rounded-lg bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Default UPI VPA:</span>
            <span className="text-xs font-mono font-bold text-primary">chetnabisen@okhdfcbank</span>
          </div>
        </div>

        {/* Right: Recent Transactions (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl bg-surface-container-lowest p-space-lg border border-surface-container-high shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Recent Campus Outflows
              </h3>
              <button
                onClick={onNavigateBudget}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                View Details →
              </button>
            </div>

            <div className="divide-y divide-surface-container-high">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary text-sm">
                      <span className="material-symbols-outlined text-base">receipt_long</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-on-surface block truncate max-w-xs">
                        {tx.title}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {tx.category} • {tx.date}
                      </span>
                    </div>
                  </div>
                  <span className="font-metric-num-sm text-sm font-bold text-on-surface">
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-space-md pt-space-xs flex justify-between items-center text-xs text-on-surface-variant border-t border-surface-container-high">
            <span>Synced 2 minutes ago with Google Pay</span>
            <span className="text-secondary font-semibold">Live Sync Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
