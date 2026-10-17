import React, { useState } from 'react';
import { Transaction, Currency, BudgetCategory } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
  currency: Currency;
  onOpenAddTransaction: () => void;
  initialCategoryFilter?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  currency,
  onOpenAddTransaction,
  initialCategoryFilter,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'UPI' | 'Card' | 'Cash' | 'NetBanking'>('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      (tx.merchant && tx.merchant.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tx.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesPayment = paymentFilter === 'all' || tx.paymentMode === paymentFilter;

    return matchesSearch && matchesCategory && matchesPayment;
  });

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Campus Transactions &amp; UPI Ledger
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Real-time feed of all UPI outflows, canteen slips, and stipend deposits for Semester 4.
          </p>
        </div>
        <button
          onClick={onOpenAddTransaction}
          className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md font-label-md text-label-md font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest border border-surface-container-high flex flex-col sm:flex-row gap-space-sm items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search transactions, canteen, Swiggy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm outline-none border border-surface-container-high focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold outline-none border border-surface-container-high cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-lg bg-surface-container-low p-0.5 border border-surface-container-high">
            {(['all', 'UPI', 'Card', 'Cash'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPaymentFilter(mode)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  paymentFilter === mode
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {mode === 'all' ? 'All Modes' : mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm overflow-hidden">
        <div className="px-space-lg py-space-sm bg-surface-container-low border-b border-surface-container-high flex justify-between items-center text-xs text-on-surface-variant font-bold uppercase tracking-wider">
          <span>Transaction Details</span>
          <div className="flex gap-12 mr-2">
            <span className="hidden md:inline">Mode</span>
            <span>Amount</span>
          </div>
        </div>

        <div className="divide-y divide-surface-container-high">
          {filtered.length === 0 ? (
            <div className="p-space-xl text-center flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">receipt</span>
              <p className="font-semibold text-on-surface">No transactions found</p>
              <p className="text-sm">Try clearing your search query or log a new transaction.</p>
            </div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                className="px-space-lg py-space-md flex items-center justify-between hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex items-center gap-space-md">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'income'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-primary-fixed text-on-primary-fixed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {tx.type === 'income' ? 'arrow_downward' : 'shopping_bag'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-sm font-bold text-on-surface">
                      {tx.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                      <span className="font-semibold text-primary">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                      {tx.merchant && (
                        <>
                          <span>•</span>
                          <span className="hidden sm:inline">{tx.merchant}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-space-lg">
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded text-xs bg-surface-container-high text-on-surface font-semibold">
                    {tx.paymentMode}
                  </span>
                  <div className="text-right">
                    <span
                      className={`font-metric-num-sm text-base font-bold ${
                        tx.type === 'income' ? 'text-secondary' : 'text-on-surface'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </span>
                    <span className="block text-[11px] text-on-surface-variant">
                      {tx.status === 'settled' ? '✓ Settled' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
