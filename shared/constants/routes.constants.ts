export const WEB_ROUTES = {
  root: "",
  // home: "home",
  goals: "goals",
  splitr: "splitr",
  profile: "profile",
  support: "support",
  login: "auth/login",
  accounts: "accounts",
  settings: "settings",
  dashboard: "dashboard",
  onboarding: "onboarding",
  register: "auth/register",
  transactions: "transactions",

  // dynamic routes
  accountDetails: "accounts/:id",
  splitrDetails: "splitr/:eventId",
} satisfies WebRoutes;

export interface WebRoutes {
  root: string;
  goals: string;
  login: string;
  splitr: string;
  profile: string;
  support: string;
  register: string;
  settings: string;
  accounts: string;
  dashboard: string;
  onboarding: string;
  transactions: string;

  // dynamic routes
  splitrDetails: string;
  accountDetails: string;
}
