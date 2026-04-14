export const WEB_ROUTES = {
  root: "",
  home: "home",
  goals: "goals",
  profile: "profile",
  login: "auth/login",
  accounts: "accounts",
  settings: "settings",
  dashboard: "dashboard",
  onboarding: "onboarding",
  register: "auth/register",
  transactions: "transactions",
} satisfies WebRoutes;

export interface WebRoutes {
  root: string;
  home: string;
  goals: string;
  login: string;
  profile: string;
  register: string;
  settings: string;
  accounts: string;
  dashboard: string;
  onboarding: string;
  transactions: string;
}
