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
  consumers: string[];
  categoryTag: string;
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