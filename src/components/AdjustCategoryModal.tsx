import React, { useState, useEffect } from 'react';
import { BudgetCategory, Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface AdjustCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BudgetCategory | null;
  onSave: (categoryId: string, newLimit: number, sendAlert: boolean) => void;
  currency: Currency;
  totalMasterBudget: number;
}

export const AdjustCategoryModal: React.FC<AdjustCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
  currency,
  totalMasterBudget,
}) => {
  const [limit, setLimit] = useState(4000);
  const [sendAlert, setSendAlert] = useState(true);

  useEffect(() => {
    if (category) {
      setLimit(category.limit);
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const spent = category.spent;
  const percentage = Math.round((spent / Math.max(limit, 1)) * 100);
  const remaining = Math.max(0, limit - spent);
  const dailyRemaining = (remaining / 11).toFixed(1);

  const getPercentageColor = (pct: number) => {
    if (pct >= 90) return 'text-tertiary';
    if (pct >= 75) return 'text-primary';
    return 'text-secondary';
  };

  const applyPreset = (type: 'essentials' | 'wants' | 'savings') => {
    if (type === 'essentials') {
      // 50% split for primary essentials
      setLimit(Math.round(totalMasterBudget * 0.28));
    } else if (type === 'wants') {
      // 30% split
      setLimit(Math.round(totalMasterBudget * 0.15));
    } else {
      // 20% savings
      setLimit(Math.round(totalMasterBudget * 0.1));
    }
  };

  const handleSave = () => {
    onSave(category.id, limit, sendAlert);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-xl bg-surface-container-lowest shadow-2xl p-space-lg max-h-[92vh] overflow-y-auto border border-surface-container-high">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Live Calculator
            </span>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Adjust {category.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
            type="button"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* College 50/30/20 Preset Selector */}
        <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Recommended Student Rule (50/30/20)
            </span>
            <span className="px-space-xs py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              Smart Suggestion
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
            Distribute your {formatCurrency(totalMasterBudget, currency)} monthly pool into 50% Essentials ({formatCurrency(totalMasterBudget * 0.5, currency)}), 30% Campus Life ({formatCurrency(totalMasterBudget * 0.3, currency)}), and 20% Savings/Cushion ({formatCurrency(totalMasterBudget * 0.2, currency)}).
          </p>
          <div className="grid grid-cols-3 gap-space-xs">
            <button
              onClick={() => applyPreset('essentials')}
              className="px-space-sm py-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all text-left border border-surface-container-high"
              type="button"
            >
              <span className="block font-label-sm text-label-sm font-bold">50% Needs</span>
              <span className="font-body-sm text-body-sm opacity-80 text-xs">
                {formatCurrency(totalMasterBudget * 0.5, currency)}
              </span>
            </button>
            <button
              onClick={() => applyPreset('wants')}
              className="px-space-sm py-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all text-left border border-surface-container-high"
              type="button"
            >
              <span className="block font-label-sm text-label-sm font-bold">30% Wants</span>
              <span className="font-body-sm text-body-sm opacity-80 text-xs">
                {formatCurrency(totalMasterBudget * 0.3, currency)}
              </span>
            </button>
            <button
              onClick={() => applyPreset('savings')}
              className="px-space-sm py-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all text-left border border-surface-container-high"
              type="button"
            >
              <span className="block font-label-sm text-label-sm font-bold">20% Growth</span>
              <span className="font-body-sm text-body-sm opacity-80 text-xs">
                {formatCurrency(totalMasterBudget * 0.2, currency)}
              </span>
            </button>
          </div>
        </div>

        {/* Live Interactive Slider Form */}
        <div className="mt-space-md flex flex-col gap-space-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-space-xs">
              Category Name
            </label>
            <input
              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none border border-surface-container-high"
              readOnly
              type="text"
              value={category.name}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                New Spending Ceiling (Monthly)
              </label>
              <div className="flex items-center gap-1 font-metric-num-sm text-metric-num-sm text-primary font-bold">
                <span>{formatCurrency(limit, currency)}</span>
              </div>
            </div>
            <input
              className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
              max="10000"
              min="200"
              step="50"
              type="range"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
              <span>{formatCurrency(200, currency)} min</span>
              <span>Target: {formatCurrency(limit, currency)}</span>
              <span>{formatCurrency(10000, currency)} max</span>
            </div>
          </div>

          {/* Dynamic Impact Preview */}
          <div className="p-space-md rounded-xl bg-surface-container-high/60 flex flex-col gap-space-xs border border-surface-container-high">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Instant Recalculation Impact
            </span>
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Current Spent:</span>
              <span className="font-semibold text-on-surface">
                {formatCurrency(spent, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Calculated Utilization:</span>
              <span className={`font-semibold ${getPercentageColor(percentage)}`}>
                {percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Remaining Daily Allowance (11 days):</span>
              <span className="font-semibold text-secondary">
                {formatCurrency(Number(dailyRemaining), currency)} / day
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs">
            <input
              id="send-alert-check"
              checked={sendAlert}
              onChange={(e) => setSendAlert(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
              type="checkbox"
            />
            <label
              htmlFor="send-alert-check"
              className="font-body-sm text-body-sm text-on-surface cursor-pointer select-none"
            >
              Send WhatsApp &amp; Push notification when 85% of this limit is touched
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-space-lg pt-space-sm flex items-center justify-end gap-space-sm border-t border-surface-container-high">
          <button
            onClick={onClose}
            className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold shadow-md transition-all"
            type="button"
          >
            Apply &amp; Recalculate
          </button>
        </div>
      </div>
    </div>
  );
};
