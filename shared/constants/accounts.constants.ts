import { Account } from "../types/accounts.types";

export const DummyAccountData: Account = {
  id: "",
  name: "",
  balance: 0,
  holderId: "",
  type: "CURRENT",
  currency: "USD",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
