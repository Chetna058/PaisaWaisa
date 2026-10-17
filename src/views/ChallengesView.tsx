import React from 'react';
import { Currency } from '../types/finance';
import { formatCurrency } from '../utils/currency';

interface ChallengesViewProps {
  currency: Currency;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ currency }) => {
  const challenges = [
    {
      id: 'c-1',
      title: '7-Day Zero Non-Essential Spend',
      description: 'Zero food delivery and casual cafe spends for 7 consecutive days.',
      progress: 7,
      total: 7,
      isCompleted: true,
      reward: `+${formatCurrency(320, currency)} saved to Goa Pot`,
      badge: 'Completed ★',
    },
    {
      id: 'c-2',
      title: 'Hostel Night Canteen Restraint',
      description: 'Limit after-hours chai & bun-maska spending to under ₹100 for the week.',
      progress: 4,
      total: 7,
      isCompleted: false,
      reward: 'Campus Frugal Champ Badge',
      badge: 'In Progress (Day 4/7)',
    },
    {
      id: 'c-3',
      title: '50/30/20 Discipline Master',
      description: 'Maintain needs below 50% and achieve 20% savings for April.',
      progress: 22,
      total: 30,
      isCompleted: false,
      reward: 'Automatic +₹1,540 MacBook Booster',
      badge: 'Day 22 / 30',
    },
  ];

  return (
    <div className="px-margin pt-space-md pb-space-xl flex flex-col gap-space-xl">
      <div>
        <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-semibold mb-1">
          Gamified Savings
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
          Challenges &amp; Streaks
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
          Level up your student money habits with fun peer challenges and streak rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="p-space-lg rounded-xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    c.isCompleted
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-primary-fixed text-on-primary-fixed'
                  }`}
                >
                  {c.badge}
                </span>
                <span className="material-symbols-outlined text-primary text-xl">
                  {c.isCompleted ? 'military_tech' : 'flag'}
                </span>
              </div>

              <h3 className="font-headline-sm text-base font-bold text-on-surface mt-2">
                {c.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                {c.description}
              </p>

              <div className="mt-space-md flex flex-col gap-1">
                <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
                  <span>Progress</span>
                  <span>{c.progress} / {c.total} days</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      c.isCompleted ? 'bg-secondary' : 'bg-primary'
                    }`}
                    style={{ width: `${(c.progress / c.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs border-t border-surface-container-high flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">{c.reward}</span>
              <span className="material-symbols-outlined text-secondary text-sm">
                {c.isCompleted ? 'verified' : 'hourglass_top'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
