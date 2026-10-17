import React, { useState } from 'react';
import { Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface EditOverallLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  onSave: (newLimit: number, pocketMoney: number, stipend: number) => void;
  currency: Currency;
}

export const EditOverallLimitModal: React.FC<EditOverallLimitModalProps> = ({
  isOpen,
  onClose,
  currentLimit,
  onSave,
  currency,
}) => {
  const [pocketMoney, setPocketMoney] = useState(8000);
  const [stipend, setStipend] = useState(6000);

  if (!isOpen) return null;

  const total = pocketMoney + stipend;

  const handleSave = () => {
    onSave(total, pocketMoney, stipend);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest shadow-2xl p-space-lg max-h-[92vh] overflow-y-auto border border-surface-container-high">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Semester Allowance Control
            </span>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Configure Master Budget Cap
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-space-md flex flex-col gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Total Master Monthly Ceiling
            </span>
            <span className="font-metric-num-lg text-metric-num-lg text-primary font-bold">
              {formatCurrency(total, currency)}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Active Billing Cycle: Apr 1 - Apr 30 (Spring 2025)
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Monthly Pocket Money from Parents
              </label>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {formatCurrency(pocketMoney, currency)}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="500"
              value={pocketMoney}
              onChange={(e) => setPocketMoney(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
              <span>{formatCurrency(2000, currency)}</span>
              <span>{formatCurrency(20000, currency)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Campus Research / TA Stipend
              </label>
              <span className="font-label-md text-label-md font-bold text-secondary">
                {formatCurrency(stipend, currency)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              value={stipend}
              onChange={(e) => setStipend(Number(e.target.value))}
              className="w-full accent-secondary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
              <span>₹0</span>
              <span>{formatCurrency(15000, currency)}</span>
            </div>
          </div>

          <div className="p-space-sm rounded-lg bg-secondary-container/30 border border-secondary/20 flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-base">info</span>
            <span className="font-body-sm text-body-sm text-on-surface">
              Safe-to-spend margin will automatically re-index against the remaining 11 days of this month.
            </span>
          </div>
        </div>

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
            Update Master Cap
          </button>
        </div>
      </div>
    </div>
  );
};
