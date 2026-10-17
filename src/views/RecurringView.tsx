import React, { useState } from 'react';
import { Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface RecurringViewProps {
  currency: Currency;
}

interface BillItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  frequency: string;
}

export const RecurringView: React.FC<RecurringViewProps> = ({ currency }) => {
  const [bills, setBills] = useState<BillItem[]>([
    {
      id: 'b-1',
      name: 'Hostel 14 Maintenance & Water',
      category: 'Rent & Utilities',
      amount: 2500,
      dueDate: 'Apr 02 (Paid)',
      isPaid: true,
      frequency: 'Monthly',
    },
    {
      id: 'b-2',
      name: 'Jio 5G Unlimited Campus Data Plan',
      category: 'Mobile & Data',
      amount: 219,
      dueDate: 'May 02, 2025',
      isPaid: false,
      frequency: 'Every 28 Days',
    },
    {
      id: 'b-3',
      name: 'Spotify Premium Student Plan',
      category: 'Entertainment',
      amount: 59,
      dueDate: 'Apr 28, 2025',
      isPaid: false,
      frequency: 'Monthly',
    },
    {
      id: 'b-4',
      name: 'Hostel Laundry Monthly Pass (10 Tokens)',
      category: 'Personal & Laundry',
      amount: 400,
      dueDate: 'May 05, 2025',
      isPaid: false,
      frequency: 'Monthly',
    },
    {
      id: 'b-5',
      name: 'OCT Sports & Activity Pass',
      category: 'Personal & Health',
      amount: 300,
      dueDate: 'May 10, 2025',
      isPaid: false,
      frequency: 'Monthly',
    },
  ]);

  const togglePaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPaid: !b.isPaid } : b))
    );
  };

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      <div>
        <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-semibold mb-1">
          Bills &amp; Subscriptions
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
          Recurring &amp; Reminders
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
          Never incur hostel late fees or loose mobile internet before submission deadlines.
        </p>
      </div>

      <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm overflow-hidden">
        <div className="px-space-lg py-space-sm bg-surface-container-low border-b border-surface-container-high flex justify-between items-center text-xs text-on-surface-variant font-bold uppercase tracking-wider">
          <span>Upcoming Dues</span>
          <div className="flex gap-12 mr-2">
            <span>Cycle</span>
            <span>Amount &amp; Action</span>
          </div>
        </div>

        <div className="divide-y divide-surface-container-high">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="px-space-lg py-space-md flex items-center justify-between hover:bg-surface-container-low/40 transition-colors"
            >
              <div className="flex items-center gap-space-md">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    bill.isPaid
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-primary-fixed text-on-primary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {bill.isPaid ? 'task_alt' : 'event_repeat'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{bill.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                    <span className="font-semibold text-primary">{bill.category}</span>
                    <span>•</span>
                    <span>Due: {bill.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-lg">
                <span className="hidden md:inline-block text-xs font-semibold text-on-surface-variant">
                  {bill.frequency}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-metric-num-sm text-base font-bold text-on-surface">
                    {formatCurrency(bill.amount, currency)}
                  </span>
                  <button
                    onClick={() => togglePaid(bill.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bill.isPaid
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-primary text-on-primary hover:bg-primary-container shadow-xs'
                    }`}
                  >
                    {bill.isPaid ? 'Paid ✓' : 'Mark Paid'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
