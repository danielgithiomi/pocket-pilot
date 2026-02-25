export const WEB_ROUTES = {
  root: '',
  home: 'home',
  profile: 'profile',
  login: 'auth/login',
  dashboard: 'dashboard',
  register: 'auth/register',
} satisfies WebRoutes;

export interface WebRoutes {
    root: string;
    home: string;
    login: string;
    profile: string;
    register: string;
    dashboard: string;
}