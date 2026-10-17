import React, { useState } from 'react';
import { SavingsGoal, Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface SavingsGoalsViewProps {
  goals: SavingsGoal[];
  currency: Currency;
  onContribute: (goalId: string, amount: number) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  goals,
  currency,
  onContribute,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(500);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoal && depositAmount > 0) {
      onContribute(selectedGoal.id, depositAmount);
      setSelectedGoal(null);
      setDepositAmount(500);
    }
  };

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-semibold mb-1">
            Student Micro-Pots
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Savings Goals &amp; Future Pots
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Auto-sweep unspent semester allowances into high-conviction goals without affecting essentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div
              key={goal.id}
              className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">{goal.icon}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                    {pct}% Reached
                  </span>
                </div>

                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  {goal.title}
                </h3>
                <span className="text-xs text-on-surface-variant block mt-0.5">
                  Target: {goal.targetDate} • {goal.category}
                </span>

                <div className="mt-space-md flex items-baseline justify-between">
                  <span className="font-metric-num-lg text-xl font-bold text-primary">
                    {formatCurrency(goal.currentAmount, currency)}
                  </span>
                  <span className="text-xs text-on-surface-variant font-semibold">
                    Goal: {formatCurrency(goal.targetAmount, currency)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden mt-2 border border-surface-container-highest">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-on-surface-variant">
                  <span>Pace: +{formatCurrency(goal.monthlyPace, currency)} / mo</span>
                  <span className="text-secondary font-semibold">
                    {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount), currency)} to go
                  </span>
                </div>
              </div>

              <div className="mt-space-lg pt-space-sm border-t border-surface-container-high flex justify-end">
                <button
                  onClick={() => setSelectedGoal(goal)}
                  className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-xs transition-all cursor-pointer"
                >
                  + Add Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {selectedGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-black/40 backdrop-blur-sm animate-fade-in"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest shadow-2xl p-space-lg border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Contribute to {selectedGoal.title}
              </h3>
              <button
                onClick={() => setSelectedGoal(null)}
                className="p-1 rounded text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="mt-space-md flex flex-col gap-space-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Deposit Amount ({currency})
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-metric-num-sm font-bold border border-surface-container-high outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                {[200, 500, 1000, 1500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="flex-1 py-1 text-xs rounded bg-surface-container-high hover:bg-primary hover:text-on-primary font-semibold transition-colors"
                  >
                    +{formatCurrency(amt, currency)}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant">
                Will be swept from Safe-To-Spend margin without exceeding your monthly budget.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setSelectedGoal(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container-high text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container shadow-xs"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
