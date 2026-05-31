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

export interface Splittable extends Omit<SplittablePayload, "quantitySplits"> {
    id: string;
    createdAt: string;
    updatedAt: string;
    splitEventId: string;
    quantitySplits: QuantitySplit[];
}

// BILL PAYERS - The people who paid for the order
export interface BillPayerPayload {
    payerName: string;
    payerAmount: number;
}

export interface BillPayer extends BillPayerPayload {
    id: string;
    createdAt: string;
    updatedAt: string;
    splitwiseEventId: string;
}

// QUANTITY SPLITS - How the item was split between the consumers
export interface QuantitySplitPayload {
    consumerName: string;
    consumerQuantity: number;
}

export interface QuantitySplit extends QuantitySplitPayload {
    id: string;
    createdAt: string;
    updatedAt: string;
    splittableId: string;
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

export interface SplitwiseSplittablePayload extends Omit<
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
    billingCurrency: string;
    // TODO: Add settled & settledAt
    billPayers: BillPayerPayload[];
    verificationTotal: number | null;
    billPaymentStrategy: PaymentStrategyVariant;
    eventSplittables: SplitwiseSplittablePayload[];
}

// API RESPONSES
export interface ISplitrEvent {
    id: string;
    settled: boolean;
    creatorId: string;
    eventName: string;
    eventDate: string;
    squadName: string;
    updatedAt: string;
    createdAt: string;
    eventMembers: string[];
    billPayers: BillPayer[];
    billingCurrency: string;
    settledAt: string | null;
    verificationTotal: number;
    eventSplittables: Splittable[];
    billPaymentStrategy: PaymentStrategyVariant;
}
