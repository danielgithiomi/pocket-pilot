// SPLIT STRATEGY - How the consumed order items were split
export const SPLIT_STRATEGY_OPTIONS = ["EQUAL", "SOLE", "QUANTITY"] as const;
export type SplitStrategyVariant = (typeof SPLIT_STRATEGY_OPTIONS)[number];

export const SPLIT_STRATEGY_MAP: Record<SplitStrategyVariant, string> = {
    EQUAL: "Equal Split",
    SOLE: "Consumed By One",
    QUANTITY: "Quantity Per Person",
};

// PAYMENT OPTION - How the payment was split
export const PAYMENT_OPTIONS = ["ONE", "EQUAL", "CUSTOM"] as const;
export type PaymentStrategyVariant = (typeof PAYMENT_OPTIONS)[number];

export const PAYMENT_OPTIONS_MAP: Record<PaymentStrategyVariant, string> = {
    ONE: "Paid by one",
    EQUAL: "Split equally",
    CUSTOM: "Custom payment",
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

// SPLITTABLES - The items in the order that were split
export interface SplittablePayload {
    name: string;
    total: number;
    settled: boolean;
    quantity: number;
    unitPrice: number;
    splitStrategy: SplitStrategyVariant;
    quantitySplits: LocalQuantitySplit[];
}

// BILL PAYERS - The people who paid for the order
export interface BillPayer {
    payerName: string;
    payerAmount: number;
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

export interface SplitwiseSplittable extends Omit<
    SplittableOrder,
    "id" | "quantitySplits"
> {
    quantitySplits: QuantitySplitPayload[];
}

export interface SplitwiseEventPayload {
    eventDate: string;
    squadName: string;
    eventName: string;
    eventMembers: string[];
    billPayers: BillPayer[];
    billingCurrency: string;
    verificationTotal: number | null;
    splittables: SplitwiseSplittable[];
    billPaymentStrategy: PaymentStrategyVariant;
}
