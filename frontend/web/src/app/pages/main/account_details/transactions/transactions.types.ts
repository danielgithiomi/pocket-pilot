import { TransactionType } from "@global/types";

export interface AccountTransactionRow {
    id: string;
    date: string;
    amount: string;
    category: string;
    description: string;
    type: TransactionType;
}
