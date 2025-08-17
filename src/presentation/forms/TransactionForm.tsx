import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TRANSACTION_TYPES } from '@/shared/constants/appConstants';
import { transactionSchema } from '@/shared/utils/validation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export interface TransactionFormData {
  amount: number;
  description?: string;
}

interface TransactionFormProps {
  type: keyof typeof TRANSACTION_TYPES;
  onSubmit: (data: TransactionFormData) => void;
  loading: boolean;
  error?: string;
  currentBalance?: number;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  type, 
  onSubmit, 
  loading, 
  error,
  currentBalance = 0
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TransactionFormData>({
    resolver: yupResolver(transactionSchema),
  });

  const amount = watch('amount');
  const isWithdrawal = type === TRANSACTION_TYPES.WITHDRAWAL;
  const willOverdraft = isWithdrawal && amount > currentBalance;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isWithdrawal && (
        <div className="bg-secondary-50 border border-secondary-200 p-3 rounded">
          <p className="text-sm text-secondary-600">
            Available Balance: <span className="font-semibold">${currentBalance.toFixed(2)}</span>
          </p>
        </div>
      )}
      
      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0.01"
        {...register('amount', { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      {willOverdraft && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          Insufficient funds. This transaction would exceed your available balance.
        </div>
      )}
      
      <Input
        label="Description (Optional)"
        {...register('description')}
        error={errors.description?.message}
      />
      
      <Button 
        type="submit" 
        fullWidth 
        loading={loading}
        disabled={willOverdraft}
        variant={isWithdrawal ? 'danger' : 'primary'}
      >
        {isWithdrawal ? 'Withdraw' : 'Deposit'} ${amount ? amount.toFixed(2) : '0.00'}
      </Button>
    </form>
  );
};