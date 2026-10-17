import React from 'react';
import { BudgetCategory, Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface ReportsViewProps {
  categories: BudgetCategory[];
  totalMasterBudget: number;
  currency: Currency;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  categories,
  totalMasterBudget,
  currency,
}) => {
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      <div>
        <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-semibold mb-1">
          Analytics &amp; Audit
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
          Financial Reports &amp; Statements
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
          Comprehensive breakdown of semester inflows, mess outlays, and category efficiency ratios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Category Share */}
        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <h3 className="font-headline-sm text-base font-bold text-on-surface mb-space-sm">
            Spending Distribution
          </h3>
          <div className="flex flex-col gap-3">
            {categories.map((c) => {
              const pct = ((c.spent / Math.max(totalSpent, 1)) * 100).toFixed(1);
              return (
                <div key={c.id} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface">{c.name}</span>
                    <span className="text-on-surface-variant">
                      {formatCurrency(c.spent, currency)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.progressClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Burn Rate Summary */}
        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-space-sm">
              Semester Mid-Term Audit
            </h3>
            <div className="space-y-3 text-sm text-on-surface-variant">
              <div className="p-3 rounded-lg bg-surface-container-low flex justify-between items-center">
                <span>Budget Adherence Score</span>
                <span className="text-secondary font-bold font-metric-num-sm">91 / 100</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex justify-between items-center">
                <span>Fast Burn Categories</span>
                <span className="text-tertiary font-bold">Food (88%), Mobile (82%)</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex justify-between items-center">
                <span>Top Discipline Category</span>
                <span className="text-secondary font-bold">Emergency Cushion (0% spent)</span>
              </div>
            </div>
          </div>

          <div className="mt-space-lg p-3 rounded-xl bg-secondary-container/20 border border-secondary/20 text-xs text-on-surface">
            <span className="font-bold text-secondary block mb-1">Audit Recommendation:</span>
            You are comfortably preserving 31.8% of your ₹14,000 monthly allowance. Keep leisure spends below ₹150 for this weekend to secure the full +₹1,540 auto-rollover.
          </div>
        </div>
      </div>
    </div>
  );
};
