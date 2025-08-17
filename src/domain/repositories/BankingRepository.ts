import { Account } from "../entities/Account";
import { Transaction } from "../entities/Transaction";

export interface TransactionRequest {
    amount: number;
    description?: string;
  }
  
  export interface BankingRepository {
    getBalance(): Promise<Account>;
    deposit(request: TransactionRequest): Promise<Account>;
    withdraw(request: TransactionRequest): Promise<Account>;
    getTransactions(page?: number, limit?: number): Promise<Transaction[]>;
  }