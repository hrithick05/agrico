import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Types
interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  type: string;
  amount: number;
}

interface FormData {
  category: string;
  description: string;
  amount: string;
  date: string;
  type: string;
}

// Main App Component
const FarmingExpenseTracker: React.FC = () => {
  const { t } = useLanguage();
  // Default expenses data
const defaultExpenses: Expense[] = [
    {
      id: 1,
      date: '3/10/2024',
      category: 'Seeds',
      description: 'Wheat seeds - Premium variety',
      type: 'Essential',
      amount: 8500
    },
    {
      id: 2,
      date: '3/8/2024',
      category: 'Fertilizer',
      description: 'NPK fertilizer for wheat crop',
      type: 'Essential',
      amount: 12000
    },
    {
      id: 3,
      date: '3/5/2024',
      category: 'Diesel',
      description: 'Fuel for tractor operations',
      type: 'Operational',
      amount: 3200
    },
    {
      id: 4,
      date: '3/3/2024',
      category: 'Tools',
      description: 'Hand tools and small equipment',
      type: 'Equipment',
      amount: 1800
    },
    {
      id: 5,
      date: '3/1/2024',
      category: 'Labor',
      description: 'Planting assistance - 3 workers',
      type: 'Labor',
      amount: 2400
    }
  ];

  // Load expenses from localStorage or use default
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const savedExpenses = localStorage.getItem('farming-expenses');
      if (savedExpenses) {
        return JSON.parse(savedExpenses);
      }
      return defaultExpenses;
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
      return defaultExpenses;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'monthly'>('dashboard');
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  const addExpense = (newExpense: FormData) => {
    const expense: Expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };
    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    
    // Save to localStorage
    try {
      localStorage.setItem('farming-expenses', JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
    
    setIsModalOpen(false);
    setToastMessage(`₹${newExpense.amount} ${t('expenses.expenseRecorded')}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const removeExpense = (expenseId: number) => {
    setExpenseToDelete(expenseId);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseToDelete);
      setExpenses(updatedExpenses);
      
      // Save to localStorage
      try {
        localStorage.setItem('farming-expenses', JSON.stringify(updatedExpenses));
      } catch (error) {
        console.error('Error saving expenses to localStorage:', error);
      }
      
      setToastMessage(t('expenses.expenseRemoved'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setExpenseToDelete(null);
  };

  const cancelDelete = () => {
    setExpenseToDelete(null);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyAverage = Math.round(totalExpenses / 3);
  const largestCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  const largestCategoryName = Object.keys(largestCategory).reduce((a, b) => 
    largestCategory[a] > largestCategory[b] ? a : b
  );
  const largestCategoryAmount = largestCategory[largestCategoryName];

  if (currentView === 'monthly') {
    return (
      <MonthlyExpenses 
        expenses={expenses}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 bg-farm-pattern bg-opacity-20">
      <div className="container mx-auto px-4 py-8">
        <Header onViewMonthly={() => setCurrentView('monthly')} />
        <SummaryCards 
          totalExpenses={totalExpenses}
          monthlyAverage={monthlyAverage}
          largestCategory={largestCategoryName}
          largestCategoryAmount={largestCategoryAmount}
        />
        <SmartSuggestions />
        <RecentExpenses 
          expenses={expenses}
          onAddExpense={() => setIsModalOpen(true)}
          onRemoveExpense={removeExpense}
        />
        
        {isModalOpen && (
          <AddExpenseModal
            onClose={() => setIsModalOpen(false)}
            onAddExpense={addExpense}
          />
        )}
        
        {showToast && (
          <Toast message={toastMessage} onClose={() => setShowToast(false)} />
        )}

        {/* Delete Confirmation Dialog */}
        {expenseToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('expenses.confirmDelete')}</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {t('expenses.deleteConfirmMessage')}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
{t('common.cancel')}
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
{t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Header Component
const Header: React.FC<{ onViewMonthly: () => void }> = ({ onViewMonthly }) => {
  const { t } = useLanguage();
  return (
  <div className="mb-8 animate-fade-in-up">
      <div className="gradient-yellow rounded-t-2xl px-8 py-8 mb-4 shadow-glow-yellow relative overflow-hidden">
        {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full animate-float"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        <div>
            <h1 className="text-5xl font-bold text-white mb-3 animate-bounce-in">
              🌾 {t('expenses.title')}
            </h1>
          <p className="text-white text-xl opacity-90 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            {t('expenses.subtitle')}
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">💰 {t('expenses.smartSavings')}</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">📊 {t('expenses.realTimeAnalytics')}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onViewMonthly} 
            className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-xl hover:bg-opacity-30 transition-all duration-300 flex items-center font-semibold hover-lift backdrop-blur-sm border border-white border-opacity-30 animate-bounce-in"
          style={{animationDelay: '0.6s'}}
        >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
{t('expenses.monthlyView')}
        </button>
      </div>
    </div>
  </div>
);
};

// SummaryCards Component
const SummaryCards: React.FC<{
  totalExpenses: number;
  monthlyAverage: number;
  largestCategory: string;
  largestCategoryAmount: number;
}> = ({ totalExpenses, monthlyAverage, largestCategory, largestCategoryAmount }) => {
  const { t } = useLanguage();
  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Expenses Card */}
      <div className="bg-white rounded-xl p-6 shadow-glow hover-lift animate-fade-in-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50"></div>
        <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                💰 {t('expenses.totalExpenses')}
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-1 animate-bounce-in" style={{animationDelay: '0.2s'}}>
              ₹{totalExpenses.toLocaleString()}
            </p>
              <p className="text-sm text-gray-500">{t('expenses.lastMonths')}</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className="progress-bar h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div className="gradient-green w-16 h-16 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Average Card */}
      <div className="bg-white rounded-xl p-6 shadow-glow hover-lift animate-fade-in-up relative overflow-hidden" style={{animationDelay: '0.1s'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-50"></div>
        <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                📅 {t('expenses.monthlyAverage')}
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-1 animate-bounce-in" style={{animationDelay: '0.4s'}}>
              ₹{monthlyAverage.toLocaleString()}
            </p>
              <p className="text-sm text-gray-500">{t('expenses.basedOnRecentData')}</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className="progress-bar h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" style={{width: '70%'}}></div>
              </div>
            </div>
            <div className="gradient-orange w-16 h-16 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Largest Category Card */}
      <div className="bg-white rounded-xl p-6 shadow-glow hover-lift animate-fade-in-up relative overflow-hidden" style={{animationDelay: '0.2s'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50"></div>
        <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                🏆 {t('expenses.largestCategory')}
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-1 animate-bounce-in" style={{animationDelay: '0.6s'}}>
              {largestCategory}
            </p>
              <p className="text-sm text-gray-500">₹{largestCategoryAmount.toLocaleString()}</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className="progress-bar h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
            <div className="gradient-green w-16 h-16 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
  </div>
);
};

// SmartSuggestions Component
const SmartSuggestions: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl p-6 shadow-glow mb-8 hover-lift animate-fade-in-up relative overflow-hidden" style={{animationDelay: '0.3s'}}>
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-30"></div>
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="achievement-badge w-12 h-12 rounded-xl flex items-center justify-center mr-4 animate-pulse-glow">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        </div>
          <h2 className="text-3xl font-bold text-gray-900 animate-bounce-in" style={{animationDelay: '0.5s'}}>
          💡 {t('expenses.smartSuggestions')}
        </h2>
        </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diesel Cost Optimization */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover-lift animate-bounce-in relative overflow-hidden" style={{animationDelay: '0.7s'}}>
          <div className="absolute top-2 right-2 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-float"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
                <div className="gradient-green w-12 h-12 rounded-xl flex items-center justify-center mr-4 animate-pulse-glow shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">🚛 {t('expenses.dieselOptimization')}</h3>
              </div>
              <p className="text-gray-700 mb-4 text-lg">{t('expenses.groupFuelPurchases')}</p>
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full text-lg font-bold inline-block shadow-lg animate-shimmer">
              💰 {t('expenses.saveAmount')}
            </div>
          </div>
        </div>

          {/* Fertilizer Bulk Buying */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover-lift animate-bounce-in relative overflow-hidden" style={{animationDelay: '0.9s'}}>
          <div className="absolute top-2 right-2 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
                <div className="gradient-orange w-12 h-12 rounded-xl flex items-center justify-center mr-4 animate-pulse-glow shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">🌱 {t('expenses.fertilizerBulk')}</h3>
              </div>
              <p className="text-gray-700 mb-4 text-lg">{t('expenses.collectiveOrders')}</p>
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-full text-lg font-bold inline-block shadow-lg animate-shimmer">
                💰 {t('expenses.fertilizerSavings')}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
};

// RecentExpenses Component
const RecentExpenses: React.FC<{
  expenses: Expense[];
  onAddExpense: () => void;
  onRemoveExpense: (expenseId: number) => void;
}> = ({ expenses, onAddExpense, onRemoveExpense }) => {
  const { t } = useLanguage();
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Essential':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg';
      case 'Operational':
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg';
      case 'Equipment':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg';
      case 'Labor':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-glow hover-lift animate-fade-in-up relative overflow-hidden" style={{animationDelay: '0.4s'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 animate-bounce-in" style={{animationDelay: '0.6s'}}>
            📊 {t('expenses.recentExpenses')}
          </h2>
          <button
            onClick={onAddExpense} 
            className="gradient-green text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center font-semibold hover-lift animate-bounce-in shadow-lg"
            style={{animationDelay: '0.8s'}}
          >
            {t('expenses.addExpense')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.date')}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.category')}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.description')}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.amount')}</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${1 + index * 0.1}s`}}>
                  <td className="py-4 px-4 text-gray-600 font-medium">{expense.date}</td>
                  <td className="py-4 px-4 font-bold text-gray-900 text-lg">{expense.category}</td>
                  <td className="py-4 px-4 text-gray-600">{expense.description}</td>
                  <td className="py-4 px-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getTypeColor(expense.type)} animate-bounce-in`} style={{animationDelay: `${1.2 + index * 0.1}s`}}>
                      {expense.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900 text-xl">₹{expense.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onRemoveExpense(expense.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-lg animate-bounce-in"
                      style={{animationDelay: `${1.4 + index * 0.1}s`}}
                      title="Remove expense"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// AddExpenseModal Component
const AddExpenseModal: React.FC<{
  onClose: () => void;
  onAddExpense: (expense: FormData) => void;
}> = ({ onClose, onAddExpense }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    category: '',
    description: '',
    amount: '',
    date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
    type: 'Essential'
  });

  const categories = [
    t('expenses.seeds'), t('expenses.fertilizer'), t('expenses.diesel'), t('expenses.tools'), t('expenses.labor'), t('expenses.pesticides'), t('expenses.irrigation'), t('expenses.machinery'), t('expenses.other')
  ];

  const types = [t('expenses.essential'), t('expenses.operational'), t('expenses.equipment'), t('expenses.labor')];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.description && formData.amount) {
      onAddExpense(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{t('expenses.addNewExpense')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('expenses.category')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green focus:border-farm-green"
              required
            >
              <option value="">{t('expenses.selectCategory')}</option>
                {categories.map(category => (
                <option key={category} value={category}>{category}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('expenses.description')}</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('expenses.enterDescription')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green focus:border-farm-green"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('expenses.amount')} (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder={t('expenses.enterAmount')}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green focus:border-farm-green"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('expenses.date')}</label>
            <input
              type="date"
              name="date"
              value={formData.date.includes('/') ? 
                formData.date.split('/').reverse().join('-') : 
                formData.date
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const dateValue = e.target.value;
                // Convert YYYY-MM-DD to DD/MM/YYYY
                const [year, month, day] = dateValue.split('-');
                const formattedDate = `${day}/${month}/${year}`;
                setFormData(prev => ({ ...prev, date: formattedDate }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green focus:border-farm-green"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green focus:border-farm-green"
            >
                {types.map(type => (
                <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-farm-green text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
{t('expenses.addExpense')}
          </button>
        </form>
    </div>
  </div>
);
};

// MonthlyExpenses Component
const MonthlyExpenses: React.FC<{
  expenses: Expense[];
  onBack: () => void;
}> = ({ expenses, onBack }) => {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  // Filter expenses by selected month
  const monthlyExpenses = expenses.filter(expense => {
    // Convert DD/MM/YYYY to YYYY-MM-DD format
    const [day, month, year] = expense.date.split('/');
    const expenseDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    const expenseMonth = expenseDate.toISOString().slice(0, 7);
    return expenseMonth === selectedMonth;
  });

  // Calculate monthly totals
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory = monthlyExpenses.reduce((acc: Record<string, Expense[]>, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {});

  // Calculate category totals
  const categoryTotals = Object.keys(expensesByCategory).map(category => ({
    category,
    total: expensesByCategory[category].reduce((sum, expense) => sum + expense.amount, 0),
    count: expensesByCategory[category].length
  })).sort((a, b) => b.total - a.total);

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Essential':
        return 'bg-green-100 text-green-800';
      case 'Operational':
        return 'bg-orange-100 text-orange-800';
      case 'Equipment':
        return 'bg-yellow-100 text-yellow-800';
      case 'Labor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMonthYear = (monthYear: string): string => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-farm-pattern bg-opacity-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-farm-yellow rounded-t-2xl px-8 py-6 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{t('expenses.monthlyView')}</h1>
                <p className="text-white text-lg">{t('expenses.subtitle')}</p>
              </div>
              <button
                onClick={onBack}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
{t('expenses.backToDashboard')}
              </button>
            </div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('expenses.selectMonth')}</h2>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green focus:border-farm-green"
            />
          </div>
          
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('expenses.totalForMonth')} {formatMonthYear(selectedMonth)}</h3>
              <p className="text-3xl font-bold text-gray-900">₹{monthlyTotal.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('expenses.numberOfExpenses')}</h3>
              <p className="text-3xl font-bold text-gray-900">{monthlyExpenses.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('expenses.averagePerExpense')}</h3>
              <p className="text-3xl font-bold text-gray-900">
                ₹{monthlyExpenses.length > 0 ? Math.round(monthlyTotal / monthlyExpenses.length).toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryTotals.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('expenses.expensesByCategory')}</h2>
            <div className="space-y-4">
              {categoryTotals.map(({ category, total, count }) => (
                <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-farm-green w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-sm">{category.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-600">{count} expense{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      {monthlyTotal > 0 ? Math.round((total / monthlyTotal) * 100) : 0}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Expenses List */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('expenses.expenseDetails')}</h2>
          {monthlyExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.date')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.category')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.description')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('expenses.amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-600">{expense.date}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">{expense.category}</td>
                      <td className="py-4 px-4 text-gray-600">{expense.description}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(expense.type)}`}>
                          {expense.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900">₹{expense.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm2 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('expenses.noExpensesFound')}</h3>
              <p className="text-gray-600">{t('expenses.noExpensesForMonth')} {formatMonthYear(selectedMonth)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-glow border border-gray-200 p-6 z-50 animate-slide-up hover-lift">
      <div className="flex items-center">
        <div className="gradient-green rounded-full p-3 mr-4 animate-celebration shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-lg animate-bounce-in">🎉 {t('expenses.expenseAdded')}</p>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FarmingExpenseTracker;
