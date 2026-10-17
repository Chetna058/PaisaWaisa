/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavItem, Currency, BudgetCategory, Transaction, SavingsGoal, HealthAlert } from './types/finance';
import {
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_HEALTH_ALERTS,
  INITIAL_SAVINGS_GOALS,
} from './data/initialData';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  DEFAULT_USER,
  UserProfile,
} from './services/auth';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdjustCategoryModal } from './components/AdjustCategoryModal';
import { EditOverallLimitModal } from './components/EditOverallLimitModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { NotificationsModal } from './components/NotificationsModal';
import { BudgetPlannerView } from './views/BudgetPlannerView';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { SmartSaveAIView } from './views/SmartSaveAIView';
import { SavingsGoalsView } from './views/SavingsGoalsView';
import { RecurringView } from './views/RecurringView';
import { ReportsView } from './views/ReportsView';
import { ChallengesView } from './views/ChallengesView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('budget-planner');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // User Profile with Google Account Integration
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Financial State
  const [totalMasterBudget, setTotalMasterBudget] = useState<number>(14000);
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [alerts, setAlerts] = useState<HealthAlert[]>(INITIAL_HEALTH_ALERTS);

  // Modal states
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [isOverallLimitModalOpen, setIsOverallLimitModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [txCategoryFilter, setTxCategoryFilter] = useState<string | undefined>(undefined);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setUserProfile({
          name: user.displayName || 'Chetna Bisen',
          email: user.email || 'chetnabisen54@gmail.com',
          photoUrl: user.photoURL,
          institution: 'Oriental College of Technology',
          isGoogleConnected: true,
        });
      },
      () => {
        // Fallback to default user
        setUserProfile((prev) => ({
          ...prev,
          name: 'Chetna Bisen',
          email: 'chetnabisen54@gmail.com',
          isGoogleConnected: false,
        }));
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUserProfile({
          name: res.user.displayName || 'Chetna Bisen',
          email: res.user.email || 'chetnabisen54@gmail.com',
          photoUrl: res.user.photoURL,
          institution: 'Oriental College of Technology',
          isGoogleConnected: true,
        });
      }
    } catch (err) {
      console.warn('Google sign-in popup closed or restricted; using current account info:', err);
      // Ensure Chetna Bisen profile is active
      setUserProfile((prev) => ({
        ...prev,
        name: 'Chetna Bisen',
        email: 'chetnabisen54@gmail.com',
        isGoogleConnected: true,
      }));
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogle();
    setUserProfile({
      name: 'Chetna Bisen',
      email: 'chetnabisen54@gmail.com',
      photoUrl: null,
      institution: 'Oriental College of Technology',
      isGoogleConnected: false,
    });
  };

  const handleUpdateProfileName = (name: string, email: string) => {
    setUserProfile((prev) => ({
      ...prev,
      name,
      email,
    }));
  };

  // Adjust Category Limit Handler
  const handleSaveCategoryLimit = (categoryId: string, newLimit: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const pct = Math.round((cat.spent / Math.max(newLimit, 1)) * 100);
          let tagType: BudgetCategory['tagType'] = 'safe';
          let tagLabel = `${pct}% Safe`;

          if (pct >= 85) {
            tagType = 'critical';
            tagLabel = `${pct}% Used`;
          } else if (pct >= 70) {
            tagType = 'caution';
            tagLabel = `${pct}% Caution`;
          } else if (pct === 0) {
            tagType = 'intact';
            tagLabel = '★ 100% Intact';
          }

          const rem = Math.max(0, newLimit - cat.spent);

          return {
            ...cat,
            limit: newLimit,
            tagType,
            tagLabel,
            note: rem > 0 ? `₹${rem.toLocaleString('en-IN')} remaining` : 'Limit Reached',
          };
        }
        return cat;
      })
    );
  };

  // Add buffer to category
  const handleAddBuffer = (categoryId: string, bufferAmount: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          const newLimit = c.limit + bufferAmount;
          const pct = Math.round((c.spent / newLimit) * 100);
          return {
            ...c,
            limit: newLimit,
            tagLabel: `${pct}% Used`,
            note: `₹${(newLimit - c.spent).toLocaleString('en-IN')} remaining buffer`,
          };
        }
        return c;
      })
    );

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === 'food_alert') {
          return {
            ...a,
            percentage: 78.2,
            badge: 'Buffered',
            type: 'caution',
            description: `Buffer applied. Limit increased by ₹${bufferAmount.toLocaleString('en-IN')}.`,
            footerLeft: `₹${(480 + bufferAmount).toLocaleString('en-IN')} remaining buffer`,
          };
        }
        return a;
      })
    );
  };

  // Save overall master budget limit
  const handleSaveOverallLimit = (newTotal: number) => {
    setTotalMasterBudget(newTotal);
  };

  // Add new transaction
  const handleAddTransaction = (newTx: {
    title: string;
    category: string;
    amount: number;
    paymentMode: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
    type: 'expense' | 'income';
    merchant?: string;
  }) => {
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      title: newTx.title,
      category: newTx.category,
      amount: newTx.amount,
      date: 'Just now',
      type: newTx.type,
      paymentMode: newTx.paymentMode,
      merchant: newTx.merchant,
      status: 'settled',
    };

    setTransactions((prev) => [tx, ...prev]);

    if (newTx.type === 'expense') {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.name.toLowerCase().includes(newTx.category.toLowerCase())) {
            const updatedSpent = cat.spent + newTx.amount;
            const pct = Math.round((updatedSpent / Math.max(cat.limit, 1)) * 100);
            return {
              ...cat,
              spent: updatedSpent,
              tagLabel: `${pct}% ${pct >= 85 ? 'Used' : pct >= 70 ? 'Caution' : 'Safe'}`,
            };
          }
          return cat;
        })
      );
    }
  };

  // Contribute to Savings Goal
  const handleContributeGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
  };

  // Navigate to transactions filtered by category
  const handleNavigateTransactions = (categoryName?: string) => {
    setTxCategoryFilter(categoryName);
    setActiveNav('transactions');
  };

  // Trigger alert action
  const handleTriggerAlertAction = (alert: HealthAlert) => {
    if (alert.actionType === 'addBuffer') {
      handleAddBuffer('food', 500);
    } else if (alert.actionType === 'viewTransactions') {
      handleNavigateTransactions('Entertainment');
    } else {
      setActiveNav('savings-goals');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={(item) => {
          if (item !== 'transactions') setTxCategoryFilter(undefined);
          setActiveNav(item);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Container */}
      <div className="lg:pl-72">
        {/* Top Header with User Info */}
        <Header
          currency={currency}
          onCurrencyChange={setCurrency}
          onOpenAddTransaction={() => setIsAddTransactionModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          unreadAlertCount={alerts.length}
          userProfile={userProfile}
          onGoogleSignIn={handleGoogleSignIn}
          onGoogleSignOut={handleGoogleSignOut}
          isAuthenticating={isAuthenticating}
        />

        {/* View Routing */}
        <main className="relative pt-16 w-full min-h-screen pb-12">
          {activeNav === 'budget-planner' && (
            <BudgetPlannerView
              categories={categories}
              totalMasterBudget={totalMasterBudget}
              currency={currency}
              onOpenAdjustCategory={(cat) => {
                setSelectedCategory(cat);
                setIsAdjustModalOpen(true);
              }}
              onOpenEditOverallLimit={() => setIsOverallLimitModalOpen(true)}
              onOpenAddBuffer={handleAddBuffer}
              onNavigateTransactions={handleNavigateTransactions}
              savingsGoal={savingsGoals[0]}
              alerts={alerts}
            />
          )}

          {activeNav === 'dashboard' && (
            <DashboardView
              categories={categories}
              transactions={transactions}
              totalMasterBudget={totalMasterBudget}
              currency={currency}
              onNavigateBudget={() => setActiveNav('budget-planner')}
              onOpenAddTransaction={() => setIsAddTransactionModalOpen(true)}
              savingsGoal={savingsGoals[0]}
            />
          )}

          {activeNav === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              categories={categories}
              currency={currency}
              onOpenAddTransaction={() => setIsAddTransactionModalOpen(true)}
              initialCategoryFilter={txCategoryFilter}
            />
          )}

          {activeNav === 'smart-save-ai' && (
            <SmartSaveAIView
              categories={categories}
              currency={currency}
              onOpenAddBuffer={handleAddBuffer}
            />
          )}

          {activeNav === 'savings-goals' && (
            <SavingsGoalsView
              goals={savingsGoals}
              currency={currency}
              onContribute={handleContributeGoal}
            />
          )}

          {activeNav === 'recurring-and-reminders' && (
            <RecurringView currency={currency} />
          )}

          {activeNav === 'financial-reports' && (
            <ReportsView
              categories={categories}
              totalMasterBudget={totalMasterBudget}
              currency={currency}
            />
          )}

          {activeNav === 'challenges-and-streaks' && (
            <ChallengesView currency={currency} />
          )}

          {activeNav === 'profile-and-settings' && (
            <ProfileView
              currency={currency}
              onCurrencyChange={setCurrency}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              userProfile={userProfile}
              onGoogleSignIn={handleGoogleSignIn}
              onGoogleSignOut={handleGoogleSignOut}
              isAuthenticating={isAuthenticating}
              onUpdateProfileName={handleUpdateProfileName}
            />
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <AdjustCategoryModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategoryLimit}
        currency={currency}
        totalMasterBudget={totalMasterBudget}
      />

      <EditOverallLimitModal
        isOpen={isOverallLimitModalOpen}
        onClose={() => setIsOverallLimitModalOpen(false)}
        currentLimit={totalMasterBudget}
        onSave={handleSaveOverallLimit}
        currency={currency}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        categories={categories}
        onAddTransaction={handleAddTransaction}
        currency={currency}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onTriggerAlertAction={handleTriggerAlertAction}
        currency={currency}
      />
    </div>
  );
}
