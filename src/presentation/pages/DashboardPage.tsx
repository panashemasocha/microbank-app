import React, { useEffect, useState } from 'react';
import { PlusCircle, MinusCircle, CreditCard, TrendingUp, Users, ShieldOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/presentation/store/hooks';
import { 
  getBalanceAsync, 
  getTransactionsAsync, 
  depositAsync, 
  withdrawAsync,
  clearError 
} from '@/presentation/store/slices/bankingSlice';
import { getClientsAsync } from '@/presentation/store/slices/adminSlice';
import { TRANSACTION_TYPES } from '@/shared/constants/appConstants';
import { Transaction } from '@/domain/entities/Transaction';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TransactionFormData, TransactionForm } from '@/presentation/forms/TransactionForm';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { account, transactions, loading, transactionLoading, error } = useAppSelector((state) => state.banking);
  const { clients } = useAppSelector((state) => state.admin);
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      dispatch(getClientsAsync());
    } else {
      dispatch(getBalanceAsync());
      dispatch(getTransactionsAsync({ limit: 5 }));
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (error) {
      console.error('Banking error:', error);
    }
  }, [error]);

  const handleDeposit = async (data: TransactionFormData) => {
    const result = await dispatch(depositAsync(data));
    if (depositAsync.fulfilled.match(result)) {
      setShowDepositModal(false);
      dispatch(clearError());
      // Refresh recent transactions to update list and count immediately
      dispatch(getTransactionsAsync({ limit: 5 }));
    }
  };

  const handleWithdraw = async (data: TransactionFormData) => {
    const result = await dispatch(withdrawAsync(data));
    if (withdrawAsync.fulfilled.match(result)) {
      setShowWithdrawModal(false);
      dispatch(clearError());
      // Refresh recent transactions to update list and count immediately
      dispatch(getTransactionsAsync({ limit: 5 }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (user?.role !== 'ADMIN' && user?.isBlacklisted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800 mb-2">Account Restricted</h1>
          <p className="text-red-700">
            Your account has been temporarily restricted. Please contact customer support for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Admin-specific dashboard: show total clients and total blacklisted
  if (user?.role === 'ADMIN') {
    const totalClients = clients.length;
    const totalBlacklisted = clients.filter(c => c.isBlacklisted).length;
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Clients</p>
                <p className="text-3xl font-bold text-secondary-900">{totalClients}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Blacklisted</p>
                <p className="text-3xl font-bold text-secondary-900">{totalBlacklisted}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ShieldOff className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Button
            icon={PlusCircle}
            onClick={() => setShowDepositModal(true)}
            disabled={loading}
          >
            Deposit
          </Button>
          <Button
            variant="secondary"
            icon={MinusCircle}
            onClick={() => setShowWithdrawModal(true)}
            disabled={loading}
          >
            Withdraw
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Account Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Available Balance</p>
              {loading ? (
                <LoadingSpinner className="mt-2" />
              ) : (
                <p className="text-3xl font-bold text-secondary-900">
                  {formatCurrency(account?.balance || 0)}
                </p>
              )}
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <CreditCard className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Transactions</p>
              <p className="text-2xl font-bold text-secondary-900">
                {transactions.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Transactions</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-secondary-500 text-center py-8">
            No transactions yet. Start by making your first deposit!
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === TRANSACTION_TYPES.DEPOSIT
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === TRANSACTION_TYPES.DEPOSIT ? (
                      <PlusCircle className="w-4 h-4" />
                    ) : (
                      <MinusCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">
                      {transaction.type}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-secondary-600">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-secondary-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === TRANSACTION_TYPES.DEPOSIT
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === TRANSACTION_TYPES.DEPOSIT ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Balance: {formatCurrency(transaction.balanceAfter)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Make a Deposit"
      >
        <TransactionForm
          type={TRANSACTION_TYPES.DEPOSIT}
          onSubmit={handleDeposit}
          loading={transactionLoading}
          error={error || undefined}
        />
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Make a Withdrawal"
      >
        <TransactionForm
          type={TRANSACTION_TYPES.WITHDRAWAL}
          onSubmit={handleWithdraw}
          loading={transactionLoading}
          error={error || undefined}
          currentBalance={account?.balance || 0}
        />
      </Modal>
    </div>
  );
};
