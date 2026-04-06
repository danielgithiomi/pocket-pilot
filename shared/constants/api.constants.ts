import { Endpoints } from "../types";

export const CLEAR_SESSION_ERROR_NAME: Record<string, string> = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  MISSING_ACCESS_TOKEN: "MISSING_ACCESS_TOKEN",
};

export const API_ENDPOINTS = {
  root: "",

  // users
  register: "users",

  // auth
  me: "auth/me",
  login: "auth/login",
  logout: "auth/logout",

  // goals
  goals: "goals",
  goal_categories: "goals/categories",

  // accounts
  accounts: "accounts",
  account_types: "accounts/types",

  // categories
  categories: "categories",

  // transactions
  all_transactions: "accounts/transactions/all",
  user_transactions: "accounts/transactions/user",
  transaction_types: "accounts/transactions/types",
} satisfies Endpoints;
