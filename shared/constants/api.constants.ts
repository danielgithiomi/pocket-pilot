import { Endpoints } from "../types";

export const CLEAR_SESSION_ERROR_NAME: string[] = [
  "TOKEN_EXPIRED",
  "MISSING_ACCESS_TOKEN",
];

export const API_ENDPOINTS = {
  root: "",
  me: "auth/me",
  register: "users",
  login: "auth/login",
  logout: "auth/logout",
} satisfies Endpoints;
