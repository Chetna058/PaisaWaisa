import React from 'react';
import { Currency, BudgetCategory } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface SmartSaveAIViewProps {
  categories: BudgetCategory[];
  currency: Currency;
  onOpenAddBuffer: (categoryId: string, amount: number) => void;
}

export const SmartSaveAIView: React.FC<SmartSaveAIViewProps> = ({
  categories,
  currency,
  onOpenAddBuffer,
}) => {
  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            AI Spending Intelligence
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
          Smart Save AI
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
          Campus-trained financial intelligence analyzing your mess tabs, Swiggy late-night orders, and unspent balances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Recommendation 1 */}
        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                Canteen Habit
              </span>
              <span className="text-secondary font-bold text-xs">+₹350 / wk potential</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">
              Night Canteen Chai Shift
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              You had 11 bun-maska &amp; cutting chai orders past midnight this month. Shifting 3 orders to the subsidized hostel mess tea frees up {formatCurrency(350, currency)} weekly towards your Goa Trip pot.
            </p>
          </div>
          <div className="mt-space-md pt-space-xs flex justify-end">
            <button
              onClick={() => onOpenAddBuffer('food', 350)}
              className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all cursor-pointer"
            >
              Reallocate ₹350
            </button>
          </div>
        </div>

        {/* Recommendation 2 */}
        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                Automatic Sweep
              </span>
              <span className="text-primary font-bold text-xs">Ready Apr 30</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">
              Books &amp; Study Surplus Sweep
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              You only used ₹900 out of ₹2,000 in Books &amp; Study. Smart Save detects this semester’s xerox costs have peaked. Safe to sweep ₹1,100 directly into the MacBook Air fund.
            </p>
          </div>
          <div className="mt-space-md pt-space-xs flex justify-end">
            <span className="text-xs font-semibold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span> Auto-Sweep Scheduled
            </span>
          </div>
        </div>

        {/* Recommendation 3 */}
        <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                Group Split
              </span>
              <span className="text-tertiary font-bold text-xs">₹420 Owed to You</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">
              Hostel Wi-Fi Split Pending
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              3 wingmates have not yet settled the high-speed optical router recharge bill from April 8. Send automatic 1-click WhatsApp payment reminders with UPI QR link.
            </p>
          </div>
          <div className="mt-space-md pt-space-xs flex justify-end">
            <button
              onClick={() => alert('WhatsApp reminder dispatched with UPI payment link!')}
              className="px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md font-semibold cursor-pointer"
            >
              Send UPI Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
