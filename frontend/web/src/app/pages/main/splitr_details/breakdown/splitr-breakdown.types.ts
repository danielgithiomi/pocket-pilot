export interface Avatar {
    bg: string;
    fg: string;
}

export interface EventPayer {
    id: string;
    avatar: Avatar;
    payerName: string;
    paidAmount: string;
    percentageContribution: number;
}

export interface QuantitySplit {
    id: string;
    consumerName: string;
    consumerTotal: string;
    consumerQuantity: number;
}

export interface OrderedItem {
    id: string;
    unitPrice: string;
    orderName: string;
    orderTotal: string;
    orderQuantity: number;
    splitStrategy: string;
    orderQuantitySplits: QuantitySplit[];
}

export interface Participant {
    id: string;
    name: string;
    totalOwed: number;
    totalPaid: number;
}

export type SettlementVariant = 'pay' | 'receive' | 'settled';

export interface Settlement {
    id: string;
    toParticipant: string;
    kind: SettlementVariant;
    fromParticipant: string;
    settlementAmount: string;
    toParticipantAvatar: Avatar;
    fromParticipantAvatar: Avatar;
}
