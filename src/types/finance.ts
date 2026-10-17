export type Currency = 'INR' | 'USD' | 'EUR';

export interface BudgetCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  limit: number;
  spent: number;
  tagType: 'critical' | 'caution' | 'safe' | 'intact';
  tagLabel: string;
  note: string;
  secondaryNote: string;
  colorClass: string;
  bgIconClass: string;
  textColorClass: string;
  progressClass: string;
  barColor: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  paymentMode: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
  merchant?: string;
  status: 'settled' | 'pending';
}

export interface SavingsGoal {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  monthlyPace: number;
  targetDate: string;
  icon: string;
  image?: string;
}

export interface HealthAlert {
  id: string;
  type: 'high' | 'caution' | 'safe';
  badge: string;
  percentage: number;
  title: string;
  description: string;
  footerLeft: string;
  actionText?: string;
  actionType?: 'addBuffer' | 'viewTransactions' | 'rollover';
}

export type NavItem =
  | 'dashboard'
  | 'transactions'
  | 'budget-planner'
  | 'smart-save-ai'
  | 'savings-goals'
  | 'recurring-and-reminders'
  | 'financial-reports'
  | 'challenges-and-streaks'
  | 'profile-and-settings';
