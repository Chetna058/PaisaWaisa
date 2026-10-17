import React, { useState } from 'react';
import { BudgetCategory, Currency, HealthAlert, SavingsGoal } from '../types/finance';
import { formatCurrency, formatCompact } from '../utils/currency';

interface BudgetPlannerViewProps {
  categories: BudgetCategory[];
  totalMasterBudget: number;
  currency: Currency;
  onOpenAdjustCategory: (category: BudgetCategory) => void;
  onOpenEditOverallLimit: () => void;
  onOpenAddBuffer: (categoryId: string, bufferAmount: number) => void;
  onNavigateTransactions: (categoryName?: string) => void;
  savingsGoal: SavingsGoal;
  alerts: HealthAlert[];
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  categories,
  totalMasterBudget,
  currency,
  onOpenAdjustCategory,
  onOpenEditOverallLimit,
  onOpenAddBuffer,
  onNavigateTransactions,
  savingsGoal,
  alerts,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'high' | 'intact'>('all');
  const [autoSweepEnabled, setAutoSweepEnabled] = useState(true);

  // Calculate live dynamic metrics
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const safeMargin = Math.max(0, totalMasterBudget - totalSpent);
  const spentPercentage = ((totalSpent / Math.max(totalMasterBudget, 1)) * 100).toFixed(1);
  const dailySafeSpend = (safeMargin / 11).toFixed(0);
  const preservedPercentage = Math.max(0, 100 - Number(spentPercentage)).toFixed(1);

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const pct = (cat.spent / Math.max(cat.limit, 1)) * 100;
    if (filterType === 'high') {
      return pct >= 70;
    }
    if (filterType === 'intact') {
      return pct <= 50;
    }
    return true;
  });

  // Rollover calculations
  const academicCat = categories.find((c) => c.id === 'books');
  const travelCat = categories.find((c) => c.id === 'travel');
  const personalCat = categories.find((c) => c.id === 'personal');

  const academicLeftover = academicCat ? Math.max(0, academicCat.limit - academicCat.spent) : 1100;
  const travelLeftover = travelCat ? Math.max(0, travelCat.limit - travelCat.spent) : 420;
  const personalLeftover = personalCat ? Math.max(0, personalCat.limit - personalCat.spent) : 580;
  const transitCareResidue = Math.round(travelLeftover * 0.5 + personalLeftover * 0.4);
  const totalEstimatedRollover = academicLeftover + transitCareResidue;

  // Download CSV handler
  const handleDownloadCSV = () => {
    const headers = ['Category', 'Subtitle', 'Spent', 'Limit', 'Utilization %', 'Remaining'];
    const rows = categories.map((c) => {
      const pct = Math.round((c.spent / Math.max(c.limit, 1)) * 100);
      const rem = Math.max(0, c.limit - c.spent);
      return [
        `"${c.name}"`,
        `"${c.subtitle}"`,
        c.spent,
        c.limit,
        `${pct}%`,
        rem,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PaisaWaisa_April_2025_Budget.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Context Header */}
      <div className="px-margin pt-space-md pb-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="inline-flex items-center px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Semester 4 • April 2025
              </span>
              <span className="inline-flex items-center gap-1.5 px-space-sm py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                11 Days Left
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
              Monthly Budget Planner
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
              Allocate your allowance wisely across college necessities, fun, and emergency savings with real-time burn-rate analytics.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={() => onOpenAdjustCategory(categories[0])}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md border border-surface-container-high cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-primary">tune</span>
              <span>50/30/20 Presets</span>
            </button>
            <button
              onClick={onOpenEditOverallLimit}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md font-label-md text-label-md font-semibold transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">edit_calendar</span>
              <span>Edit Overall Limit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="px-margin pb-space-xl flex flex-col gap-space-xl">
        {/* Bento Master Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          {/* Master Budget Overview Card (8 Cols) */}
          <div className="lg:col-span-8 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-xl">
                    account_balance_wallet
                  </span>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                    Master Budget Cap
                  </span>
                </div>
                <span className="font-label-sm text-label-sm px-space-sm py-space-xs rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                  Cycle: Apr 1 – Apr 30
                </span>
              </div>

              {/* Numbers Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-space-md">
                <div className="p-space-md rounded-lg bg-surface-container-low border border-surface-container-high/60">
                  <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
                    Total Allocated Limit
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-num-lg text-metric-num-lg text-on-surface font-bold">
                      {formatCurrency(totalMasterBudget, currency)}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                    Monthly pocket money + stipend
                  </span>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-low border border-surface-container-high/60">
                  <span className="font-label-md text-label-md text-on-surface-variant block mb-1">
                    Spent So Far
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-num-lg text-metric-num-lg text-on-surface font-bold">
                      {formatCurrency(totalSpent, currency)}
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold ml-1">
                      {spentPercentage}%
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                    22 out of 30 days tracked
                  </span>
                </div>

                <div className="p-space-md rounded-lg bg-secondary-container/30 border border-secondary/20">
                  <span className="font-label-md text-label-md text-secondary block mb-1 font-semibold">
                    Safe-To-Spend Margin
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-num-lg text-metric-num-lg text-secondary font-bold">
                      {formatCurrency(safeMargin, currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-sm text-secondary">flash_on</span>
                    <span className="font-semibold text-secondary">
                      ~{formatCurrency(Number(dailySafeSpend), currency)}/day
                    </span>{' '}
                    for next 11 days
                  </div>
                </div>
              </div>

              {/* Multi-tier Visual Progress Bar */}
              <div className="mt-space-lg">
                <div className="flex justify-between items-center text-body-sm font-body-sm mb-space-xs">
                  <span className="text-on-surface font-semibold">Spending Burn-Rate Progress</span>
                  <span className="text-on-surface-variant font-label-md text-label-md">
                    {formatCurrency(totalSpent, currency)} of {formatCurrency(totalMasterBudget, currency)}
                  </span>
                </div>

                <div className="w-full h-3.5 bg-surface-container-high rounded-full overflow-hidden flex p-0.5 border border-surface-container-highest">
                  {/* Food: ~25.1% */}
                  <div
                    className="h-full bg-tertiary-container rounded-l-full transition-all duration-500"
                    style={{ width: `${Math.min(30, (3520 / totalMasterBudget) * 100)}%` }}
                    title={`Food: ${formatCurrency(3520, currency)}`}
                  />
                  {/* Rent: ~17.8% */}
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(25, (2500 / totalMasterBudget) * 100)}%` }}
                    title={`Hostel/Utilities: ${formatCurrency(2500, currency)}`}
                  />
                  {/* Entertainment: ~8.3% */}
                  <div
                    className="h-full bg-primary-container transition-all duration-500"
                    style={{ width: `${Math.min(15, (1170 / totalMasterBudget) * 100)}%` }}
                    title={`Entertainment: ${formatCurrency(1170, currency)}`}
                  />
                  {/* Books: ~6.4% */}
                  <div
                    className="h-full bg-secondary-fixed-dim transition-all duration-500"
                    style={{ width: `${Math.min(10, (900 / totalMasterBudget) * 100)}%` }}
                    title={`Academic: ${formatCurrency(900, currency)}`}
                  />
                  {/* Travel: ~5.5% */}
                  <div
                    className="h-full bg-secondary transition-all duration-500"
                    style={{ width: `${Math.min(8, (780 / totalMasterBudget) * 100)}%` }}
                    title={`Transit: ${formatCurrency(780, currency)}`}
                  />
                  {/* Other: ~5.1% */}
                  <div
                    className="h-full bg-outline-variant transition-all duration-500"
                    style={{ width: `${Math.min(8, (1080 / totalMasterBudget) * 100)}%` }}
                    title={`Recharge + Personal: ${formatCurrency(1080, currency)}`}
                  />
                  {/* Safe Margin empty track filler */}
                  <div className="h-full bg-transparent flex-1" />
                </div>

                <div className="flex flex-wrap items-center gap-space-md mt-space-sm font-label-sm text-label-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" /> Food ({formatCompact(3520, currency)})
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Rent ({formatCompact(2500, currency)})
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> Leisure ({formatCompact(1170, currency)})
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim" /> Academics ({formatCompact(900, currency)})
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high" /> Safe Buffer ({formatCompact(safeMargin, currency)} left)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low -mx-space-lg -mb-space-lg p-space-md border-t border-surface-container-high">
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-lg">verified_user</span>
                <span className="font-body-sm text-body-sm">
                  Burn pace is on track. You are preserving{' '}
                  <strong className="text-on-surface">{preservedPercentage}%</strong> of your campus allowance.
                </span>
              </div>
              <button
                className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                onClick={onOpenEditOverallLimit}
                type="button"
              >
                Reconfigure limits <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Campus Smart Insights & Student Lifestyle Visual (4 Cols) */}
          <div className="lg:col-span-4 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
                  Student Life Snapshot
                </span>
                <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                  OCT Campus
                </span>
              </div>

              <div className="relative rounded-lg overflow-hidden h-36 w-full mb-space-md group">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="An Indian university campus canteen vibrant study group with laptops, chai glasses, textbooks, and a serene courtyard in warm afternoon natural lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuButiWlgNRZZVuKKjv4BgIh4RUwdhHzQ1j1wx5SSKp0R_aNa9O1TLcGa9trcI5As7obSaMJCjdratFMZzOVIkU7nLir1M_l1htOyPFSVIysrjLFnb_sHcTmK2KUqdKEgIt_803q7rDOFRsexYz6sFbS7Z44LIJZplW1TZtyjZh9JWhrAABXSalwwBQJQccYAtakMxUdmv8ZYxhjUSvY1UK5uH32t6dovQhdM08-F6aX1YNIZy6GPm3CpA"
                  onError={(e) => {
                    (e.target as HTMLElement).parentElement?.classList.add('bg-linear-to-r', 'from-primary-container', 'to-primary');
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end p-space-md">
                  <span className="text-white font-headline-sm text-headline-sm font-bold drop-shadow-sm">
                    Hostel 14 Tab Settled
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Your night canteen chai &amp; bun-maska spending went down by 14% this week. That freed up {formatCurrency(350, currency)} into your weekend excursion bucket!
              </p>
            </div>

            <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-high border border-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">savings</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {savingsGoal.title}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {formatCurrency(savingsGoal.currentAmount, currency)} / {formatCurrency(savingsGoal.targetAmount, currency)}
                  </span>
                </div>
              </div>
              <span className="font-metric-num-sm text-metric-num-sm text-primary font-bold">
                +{formatCompact(savingsGoal.monthlyPace, currency)} mo
              </span>
            </div>
          </div>
        </div>

        {/* Automated Health & Smart Threshold Alerts Strip */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <span>Automated Health &amp; Threshold Triggers</span>
            </h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
              Triggered at 75%, 90% and 100% capacity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-space-xs">
            {/* High Alert Item */}
            <div className="rounded-xl p-space-md bg-tertiary-fixed text-on-tertiary-fixed flex flex-col justify-between shadow-sm border border-tertiary/20">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-space-sm py-0.5 rounded-full bg-tertiary text-on-tertiary font-bold">
                    <span className="material-symbols-outlined text-xs">warning</span> High Alert
                  </span>
                  <span className="font-metric-num-sm text-metric-num-sm font-bold">88.0%</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-tertiary-fixed mt-space-xs">
                  Food &amp; Canteen at 88%
                </h3>
                <p className="font-body-sm text-body-sm mt-1 text-on-tertiary-fixed/90 leading-relaxed">
                  {formatCurrency(3520, currency)} spent of {formatCurrency(4000, currency)} monthly limit. Approaching critical 90% threshold with 11 days remaining.
                </p>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-tertiary-fixed font-semibold">
                  {formatCurrency(480, currency)} remaining buffer
                </span>
                <button
                  className="px-space-sm py-1 rounded bg-tertiary text-on-tertiary text-label-sm font-label-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  onClick={() => onOpenAddBuffer('food', 500)}
                  type="button"
                >
                  Add {formatCurrency(500, currency)} buffer
                </button>
              </div>
            </div>

            {/* Warning Item */}
            <div className="rounded-xl p-space-md bg-surface-container-high text-on-surface flex flex-col justify-between shadow-sm border border-surface-container-highest">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold">
                    <span className="material-symbols-outlined text-xs">info</span> Caution
                  </span>
                  <span className="font-metric-num-sm text-metric-num-sm font-bold text-primary">
                    78.0%
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-space-xs">
                  Entertainment &amp; Weekend Cafes
                </h3>
                <p className="font-body-sm text-body-sm mt-1 text-on-surface-variant leading-relaxed">
                  {formatCurrency(1170, currency)} spent of {formatCurrency(1500, currency)} limit. Slow down casual weekend outings to safeguard the upcoming Lonavala college roadtrip.
                </p>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {formatCurrency(330, currency)} uncommitted
                </span>
                <button
                  className="font-label-sm text-label-sm text-primary font-semibold hover:underline cursor-pointer"
                  onClick={() => onNavigateTransactions('Entertainment')}
                  type="button"
                >
                  View Transactions
                </button>
              </div>
            </div>

            {/* Safe Standing Item */}
            <div className="rounded-xl p-space-md bg-secondary-container/40 text-on-surface flex flex-col justify-between shadow-sm border border-secondary/20">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-space-sm py-0.5 rounded-full bg-secondary text-on-secondary font-bold">
                    <span className="material-symbols-outlined text-xs">check_circle</span> Healthy Surplus
                  </span>
                  <span className="font-metric-num-sm text-metric-num-sm font-bold text-secondary">
                    45.0%
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-space-xs">
                  Books &amp; Academic Photocopy
                </h3>
                <p className="font-body-sm text-body-sm mt-1 text-on-surface-variant leading-relaxed">
                  Spent {formatCurrency(900, currency)} of {formatCurrency(2000, currency)} ceiling. {formatCurrency(1100, currency)} clean surplus available to automatically roll over to next month's fest tickets!
                </p>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  {formatCurrency(1100, currency)} Roll-Forward Ready
                </span>
                <span className="material-symbols-outlined text-secondary">trending_flat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category-Wise Budget Allocations Grid */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Campus Spending Categories
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tap on any category card to tweak allocation parameters or configure custom alerts.
              </p>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Filter by:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-primary-fixed text-on-primary-fixed shadow-xs'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                All ({categories.length})
              </button>
              <button
                onClick={() => setFilterType('high')}
                className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                  filterType === 'high'
                    ? 'bg-primary-fixed text-on-primary-fixed shadow-xs'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                High Burn
              </button>
              <button
                onClick={() => setFilterType('intact')}
                className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                  filterType === 'intact'
                    ? 'bg-primary-fixed text-on-primary-fixed shadow-xs'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                Intact
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter mt-space-xs">
            {filteredCategories.map((category) => {
              const pct = Math.round((category.spent / Math.max(category.limit, 1)) * 100);
              return (
                <div
                  key={category.id}
                  className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all duration-200 border border-surface-container-high flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${category.bgIconClass}`}
                        >
                          <span className="material-symbols-outlined text-lg">{category.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface text-base">
                            {category.name}
                          </h4>
                          <span className="font-label-sm text-label-sm text-on-surface-variant block">
                            {category.subtitle}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-space-sm py-space-xs rounded-full font-label-sm text-label-sm font-bold ${category.colorClass}`}
                      >
                        {category.tagLabel}
                      </span>
                    </div>

                    <div className="mt-space-md flex items-baseline justify-between">
                      <span className="font-metric-num-lg text-metric-num-lg text-on-surface font-bold">
                        {formatCurrency(category.spent, currency)}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Limit {formatCurrency(category.limit, currency)}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mt-space-xs">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${category.progressClass}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-space-xs font-body-sm text-body-sm">
                      <span className={`flex items-center gap-1 font-semibold text-xs ${category.textColorClass}`}>
                        {category.id === 'food' && (
                          <span className="material-symbols-outlined text-xs">warning</span>
                        )}
                        {category.id === 'rent' && (
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                        )}
                        {category.id === 'books' && (
                          <span className="material-symbols-outlined text-xs">savings</span>
                        )}
                        {category.id === 'travel' && (
                          <span className="material-symbols-outlined text-xs text-primary">navigation</span>
                        )}
                        {category.id === 'entertainment' && (
                          <span className="material-symbols-outlined text-xs">hourglass_bottom</span>
                        )}
                        {category.id === 'mobile' && (
                          <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                        )}
                        {category.id === 'personal' && (
                          <span className="material-symbols-outlined text-xs">sentiment_very_satisfied</span>
                        )}
                        {category.id === 'emergency' && (
                          <span className="material-symbols-outlined text-xs">shield</span>
                        )}
                        {category.note}
                      </span>
                      <span className="text-xs text-on-surface-variant">{category.secondaryNote}</span>
                    </div>
                  </div>

                  <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-surface-container-high/40">
                    <button
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      onClick={() => onOpenAdjustCategory(category)}
                      type="button"
                    >
                      Adjust Limit <span className="material-symbols-outlined text-sm">tune</span>
                    </button>
                    <button
                      onClick={() => onNavigateTransactions(category.name)}
                      className="p-1 rounded text-outline-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="View transactions in this category"
                    >
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Analytics & Month-over-Month Carry-Forward Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          {/* Planned vs Actual Spending Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Planned vs. Actual Spending
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Visual delta comparing your semester targets with actual UPI outflows.
                  </p>
                </div>
                <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-surface-container-highest" />
                    <span className="text-on-surface-variant">Planned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-primary" />
                    <span className="text-on-surface">Spent</span>
                  </div>
                </div>
              </div>

              {/* Minimalist SVG Comparison Chart */}
              <div className="w-full flex flex-col gap-space-sm">
                {/* Food */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Food &amp; Canteen</span>
                    <span>
                      <strong className="text-tertiary">{formatCurrency(3520, currency)}</strong> / {formatCurrency(4000, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-5 rounded-md relative overflow-hidden flex border border-surface-container-highest">
                    <div
                      className="h-full bg-tertiary-container rounded-l-md transition-all duration-700"
                      style={{ width: '88%' }}
                    />
                  </div>
                </div>

                {/* Hostel */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Hostel &amp; Utilities</span>
                    <span>
                      <strong className="text-on-surface">{formatCurrency(2500, currency)}</strong> / {formatCurrency(2500, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-5 rounded-md relative overflow-hidden flex border border-surface-container-highest">
                    <div
                      className="h-full bg-primary rounded-l-md transition-all duration-700"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Books */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Books &amp; Academic</span>
                    <span>
                      <strong className="text-secondary">{formatCurrency(900, currency)}</strong> / {formatCurrency(2000, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-5 rounded-md relative overflow-hidden flex border border-surface-container-highest">
                    <div
                      className="h-full bg-secondary rounded-l-md transition-all duration-700"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>

                {/* Entertainment */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Entertainment &amp; Cafes</span>
                    <span>
                      <strong className="text-primary-container">{formatCurrency(1170, currency)}</strong> / {formatCurrency(1500, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-5 rounded-md relative overflow-hidden flex border border-surface-container-highest">
                    <div
                      className="h-full bg-primary-container rounded-l-md transition-all duration-700"
                      style={{ width: '78%' }}
                    />
                  </div>
                </div>

                {/* Transit */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="text-on-surface">Transit &amp; Rides</span>
                    <span>
                      <strong className="text-on-surface">{formatCurrency(780, currency)}</strong> / {formatCurrency(1200, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-5 rounded-md relative overflow-hidden flex border border-surface-container-highest">
                    <div
                      className="h-full bg-primary rounded-l-md transition-all duration-700"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container-high">
              <span>Overall variance is within <strong>+4.2%</strong> of ideal mid-semester pace.</span>
              <button
                onClick={handleDownloadCSV}
                className="font-label-sm text-label-sm text-primary font-semibold cursor-pointer hover:underline flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download CSV
              </button>
            </div>
          </div>

          {/* Month-over-Month Carry-Forward Engine (5 Cols) */}
          <div className="lg:col-span-5 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-space-sm py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm animate-spin-slow">autorenew</span> Auto-Rollover Engine
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  May 1 Projection
                </span>
              </div>

              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-space-md">
                Compound Your Discipline
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                PaisaWaisa detects your unspent margins at the 30th of each month and sweeps them directly into student micro-savings goals.
              </p>

              {/* Projected Rollover Box */}
              <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-surface-container-high">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    Estimated Rollover:
                  </span>
                  <span className="font-metric-num-lg text-metric-num-lg text-secondary font-bold">
                    +{formatCurrency(totalEstimatedRollover, currency)}
                  </span>
                </div>

                <div className="h-px bg-surface-container-high w-full" />

                <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">trending_up</span>
                      Academic Budget Leftover:
                    </span>
                    <span className="font-semibold text-on-surface">
                      {formatCurrency(academicLeftover, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">trending_up</span>
                      Transit &amp; Care Residue:
                    </span>
                    <span className="font-semibold text-on-surface">
                      {formatCurrency(transitCareResidue, currency)}
                    </span>
                  </div>
                </div>

                <div className="mt-space-xs p-space-sm rounded-lg bg-surface-container-lowest flex items-center gap-space-xs border border-surface-container-high">
                  <span className="material-symbols-outlined text-primary text-xl">laptop_mac</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      Destination: M2 MacBook Air Fund
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                      Pushes your milestone completion 18 days earlier!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-surface-container-high/40">
              <label className="flex items-center gap-space-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSweepEnabled}
                  onChange={(e) => setAutoSweepEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Enable 1-Click Month-End Sweep
                </span>
              </label>
              <span
                className="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer hover:text-on-surface"
                title="Unspent amounts are safely swept into your top priority savings pot at 11:59 PM on April 30."
              >
                help
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
