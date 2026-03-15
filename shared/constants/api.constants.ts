import { Endpoints } from "../types";

export const API_ENDPOINTS = {
  root: "",
  me: "auth/me",
  register: "users",
  login: "auth/login",
  logout: "auth/logout",
} satisfies Endpoints;
