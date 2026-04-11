import { BillTypeEnum } from "@global/enums";

export type BillType = BillTypeEnum;

export interface CreateBillPayload {
  name: string;
  dueDate: Date;
  amount: number;
  type: BillType;
}

export interface Bill {
  id: string;
  name: string;
  type: string;
  amount: number;
  userId: string;
  dueDate: string;
  currency: string;
}
