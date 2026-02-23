export const WEB_ROUTES = {
  root: '',
  home: 'home',
  login: 'auth/login',
  dashboard: 'dashboard',
  register: 'auth/register',
} satisfies WebRoutes;

export interface WebRoutes {
    root: string;
    home: string;
    login: string;
    register: string;
    dashboard: string;
}