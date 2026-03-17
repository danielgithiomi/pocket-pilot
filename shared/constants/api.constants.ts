import { Endpoints } from "../types";

export const CLEAR_SESSION_ERROR_NAME: Record<string, string> = {
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  MISSING_ACCESS_TOKEN: "MISSING_ACCESS_TOKEN",
};

export const API_ENDPOINTS = {
  root: "",
  me: "auth/me",
  register: "users",
  login: "auth/login",
  accounts: "accounts",
  logout: "auth/logout",
} satisfies Endpoints;
