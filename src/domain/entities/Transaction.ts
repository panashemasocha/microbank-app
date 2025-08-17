export interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL';
    amount: number;
    balanceAfter: number;
    description?: string;
    createdAt: string;
}