export interface AccountTransactionRow {
    id: string;
    type: string;
    date: string;
    amount: string;
    currency: string;
    category: string;
    rawAmount: number;
    description: string;
    sourceAccountId: string;
    convertedAmount?: string;
    showConvertedAmount: boolean;
    targetAccountId?: string | null;
}
