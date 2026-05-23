// SPLIT STRATEGY - How the consumed order items were split
export const SPLIT_STRATEGY_OPTIONS = ["equal", "sole", "quantity"] as const;
export type SplitStrategyVariant = (typeof SPLIT_STRATEGY_OPTIONS)[number];

export const SPLIT_STRATEGY_MAP: Record<SplitStrategyVariant, string> = {
    equal: "Equal Split",
    sole: "Consumed By One",
    quantity: "Quantity Per Person",
};

// PAYMENT OPTION - How the payment was split
export const PAYMENT_OPTIONS = ["one", "equal", "custom"] as const;
export type PaymentOption = (typeof PAYMENT_OPTIONS)[number];

export const PAYMENT_OPTIONS_MAP: Record<PaymentOption, string> = {
    one: "Paid by one",
    equal: "Split equally",
    custom: "Custom payment",
};

// SQUADS
export interface SplitwiseSquadPayload {
    squadName: string;
    squadMembers: string[];
    squadImageKey?: string;
}

export interface SplitwiseSquad {
    id: string;
    creatorId: string;
    squadName: string;
    createdAt: string;
    updatedAt: string;
    squadImageKey: string;
    squadMembers: string[];
}

export interface SplittablePayload {
    name: string;
    total: number;
    settled: boolean;
    quantity: number;
    unitPrice: number;
    splitStrategy: SplitStrategyVariant;
    quantitySplits: LocalQuantitySplit[];
}

export interface BillPayer {
    name: string;
    amount: number;
}

export interface Splittable extends SplittablePayload {
    id: string;
}

export interface SplittableOrder extends SplittablePayload {
    id: number;
}

export interface QuantitySplitPayload {
    consumerName: string;
    consumerQuantity: number;
}

export interface LocalQuantitySplit extends QuantitySplitPayload {
    id: string;
}

export interface SplitPayload {
    eventDate: string;
    squadName: string;
    eventName: string;
    eventMembers: string[];
    billPayers: BillPayer[];
    billingCurrency: string;
    splittables: SplittableOrder[];
    verificationTotal: number | null;
    billPayerStrategy: PaymentOption;
}
