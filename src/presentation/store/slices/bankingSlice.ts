import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from '@/domain/entities/Account';
import { Transaction } from '@/domain/entities/Transaction';
import { BankingRepositoryImpl } from '@/infrastructure/repositories/BankingRepositoryImpl';
import { TransactionRequest } from '@/domain/repositories/BankingRepository';
import { getErrorMessage } from '@/shared/utils/errors';

interface BankingState {
  account: Account | null;
  transactions: Transaction[];
  loading: boolean;
  transactionLoading: boolean;
  error: string | null;
}

const initialState: BankingState = {
  account: null,
  transactions: [],
  loading: false,
  transactionLoading: false,
  error: null,
};

const bankingRepository = new BankingRepositoryImpl();

export const getBalanceAsync = createAsyncThunk<
  Account,
  void,
  { rejectValue: string }
>('banking/getBalance', async (_, { rejectWithValue }) => {
  try {
    return await bankingRepository.getBalance();
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Failed to get balance'));
  }
});

export const depositAsync = createAsyncThunk<
  Account,
  TransactionRequest,
  { rejectValue: string }
>('banking/deposit', async (request: TransactionRequest, { rejectWithValue }) => {
  try {
    return await bankingRepository.deposit(request);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Deposit failed'));
  }
});

export const withdrawAsync = createAsyncThunk<
  Account,
  TransactionRequest,
  { rejectValue: string }
>('banking/withdraw', async (request: TransactionRequest, { rejectWithValue }) => {
  try {
    return await bankingRepository.withdraw(request);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Withdrawal failed'));
  }
});

export const getTransactionsAsync = createAsyncThunk<
  Transaction[],
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>('banking/getTransactions', async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
  try {
    return await bankingRepository.getTransactions(page, limit);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, 'Failed to get transactions'));
  }
});

const bankingSlice = createSlice({
  name: 'banking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Balance
      .addCase(getBalanceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBalanceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
      })
      .addCase(getBalanceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Deposit
      .addCase(depositAsync.pending, (state) => {
        state.transactionLoading = true;
        state.error = null;
      })
      .addCase(depositAsync.fulfilled, (state, action) => {
        state.transactionLoading = false;
        // API returns updated account balance
        state.account = action.payload;
      })
      .addCase(depositAsync.rejected, (state, action) => {
        state.transactionLoading = false;
        state.error = action.payload as string;
      })
      // Withdraw
      .addCase(withdrawAsync.pending, (state) => {
        state.transactionLoading = true;
        state.error = null;
      })
      .addCase(withdrawAsync.fulfilled, (state, action) => {
        state.transactionLoading = false;
        // API returns updated account balance
        state.account = action.payload;
      })
      .addCase(withdrawAsync.rejected, (state, action) => {
        state.transactionLoading = false;
        state.error = action.payload as string;
      })
      // Get Transactions
      .addCase(getTransactionsAsync.fulfilled, (state, action) => {
        state.transactions = action.payload;
      });
  },
});

export const { clearError } = bankingSlice.actions;
export default bankingSlice.reducer;