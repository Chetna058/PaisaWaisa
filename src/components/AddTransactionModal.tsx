import React, { useState } from 'react';
import { BudgetCategory, Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BudgetCategory[];
  onAddTransaction: (transaction: {
    title: string;
    category: string;
    amount: number;
    paymentMode: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
    type: 'expense' | 'income';
    merchant?: string;
  }) => void;
  currency: Currency;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddTransaction,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'food');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'Cash' | 'NetBanking'>('UPI');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  if (!isOpen) return null;

  const quickAmounts = [20, 60, 150, 320, 500];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const matchedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : 'Food & Canteen';

    onAddTransaction({
      title: title.trim() || `${categoryName} Spend`,
      category: categoryName,
      amount: Number(amount),
      paymentMode,
      type,
      merchant: title.trim() || 'Campus UPI Merchant',
    });

    setTitle('');
    setAmount('');
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
              Instant Campus Ledger
            </span>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Log Campus Outflow
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

        <form onSubmit={handleSubmit} className="mt-space-md flex flex-col gap-space-md">
          {/* Expense vs Income toggle */}
          <div className="flex p-1 bg-surface-container-low rounded-lg border border-surface-container-high">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-md font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Expense / Outflow
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-md font-semibold transition-all ${
                type === 'income'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Income / Stipend
            </button>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-space-xs">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-metric-num-sm text-primary font-bold">
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-9 pr-space-md py- space-sm py-2.5 rounded-lg bg-surface-container-low text-on-surface font-metric-num-sm text-metric-num-sm outline-none border border-surface-container-high focus:border-primary"
              />
            </div>
            {/* Quick Amount presets */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Quick:</span>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className="px-2.5 py-1 text-xs rounded-full bg-surface-container-high text-on-surface font-semibold hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                >
                  +{formatCurrency(amt, currency)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-space-xs">
              Description / Merchant / Split Details
            </label>
            <input
              type="text"
              placeholder="e.g. Canteen chai & bun maska, Swiggy, Metro pass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none border border-surface-container-high focus:border-primary"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-space-xs">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none border border-surface-container-high focus:border-primary cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Limit: {formatCurrency(c.limit, currency)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-space-xs">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['UPI', 'Card', 'Cash', 'NetBanking'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-1 text-center font-label-md text-label-md rounded-lg font-semibold border transition-all ${
                    paymentMode === mode
                      ? 'bg-primary-container text-on-primary-container border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-outline-variant'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-space-sm pt-space-sm flex items-center justify-end gap-space-sm border-t border-surface-container-high">
            <button
              onClick={onClose}
              type="button"
              className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold shadow-md transition-all"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
