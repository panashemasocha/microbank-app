import { BankingRepository, TransactionRequest } from '@/domain/repositories/BankingRepository';
import { Account } from '@/domain/entities/Account';
import { Transaction } from '@/domain/entities/Transaction';
import { apiClient, handleResponse } from '../http/client';
import { API_ENDPOINTS } from '@/shared/constants/apiConstants';

export class BankingRepositoryImpl implements BankingRepository {
  async getBalance(): Promise<Account> {
    const response = await apiClient.get(API_ENDPOINTS.BANKING.BALANCE);
    return handleResponse<Account>(response);
  }

  async deposit(request: TransactionRequest): Promise<Account> {
    const response = await apiClient.post(API_ENDPOINTS.BANKING.DEPOSIT, request);
    return handleResponse<Account>(response);
  }

  async withdraw(request: TransactionRequest): Promise<Account> {
    const response = await apiClient.post(API_ENDPOINTS.BANKING.WITHDRAW, request);
    return handleResponse<Account>(response);
  }

  async getTransactions(page = 1, limit = 10): Promise<Transaction[]> {
    const response = await apiClient.get(API_ENDPOINTS.BANKING.TRANSACTIONS, {
      params: { page, limit }
    });
    return handleResponse<Transaction[]>(response);
  }
}
