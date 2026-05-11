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
  paidFor: string[];
  unitPrice: number;
  consumers: string[];
  categoryTag: string;
  // paidBy: string;
}
