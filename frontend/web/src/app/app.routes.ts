import { Routes } from '@angular/router';
import { Login } from '@pages/auth/login/login';
import { AuthLayout } from '@pages/layouts/auth';
import { MainLayout } from '@pages/layouts/main';
import { DrawerlessLayout } from '@pages/layouts/drawerless';
import { NotFound } from '@pages/shared/not-found/not-found';
import { AuthGuard, GuestGuard } from '@infrastructure/guards';
import { WEB_ROUTES } from '@global/constants/routes.constants';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        title: 'Login | Pocket Pilot',
        path: 'login',
        canMatch: [GuestGuard],
        component: Login,
      },
      {
        title: 'Register | Pocket Pilot',
        path: 'register',
        loadComponent: () => import('@pages/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: WEB_ROUTES.onboarding,
    // canMatch: [AuthGuard],
    component: DrawerlessLayout,
    children: [
      {
        path: '',
        title: 'Onboarding | Pocket Pilot',
        loadComponent: () => import('@pages/main/onboarding/onboarding').then((m) => m.Onboarding),
      },
    ],
  },
  {
    path: '',
    component: MainLayout,
    canMatch: [AuthGuard],
    children: [
      {
        title: 'Dashboard | Pocket Pilot',
        path: WEB_ROUTES.dashboard,
        loadComponent: () => import('@pages/main/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        title: 'Profile | Pocket Pilot',
        path: WEB_ROUTES.profile,
        loadComponent: () => import('@pages/main/profile/profile').then((m) => m.Profile),
      },
      {
        title: 'Accounts | Pocket Pilot',
        path: WEB_ROUTES.accounts,
        loadComponent: () => import('@pages/main/accounts/accounts').then((m) => m.Accounts),
      },
      {
        title: 'Transactions | Pocket Pilot',
        path: WEB_ROUTES.transactions,
        loadComponent: () =>
          import('@pages/main/transactions/transactions').then((m) => m.Transactions),
      },
      {
        title: 'Categories | Pocket Pilot',
        path: WEB_ROUTES.categories,
        loadComponent: () => import('@pages/main/settings_and_categories/categories').then((m) => m.Categories),
      },
      {
        title: 'Goals & Bills | Pocket Pilot',
        path: WEB_ROUTES.goals,
        loadComponent: () => import('@pages/main/goals_and_bills/goals-and-bills').then((m) => m.Goals),
      },
      {
        path: '**',
        component: NotFound,
        title: '404 | Page Not Found',
      },
    ],
  },
  {
    path: '**',
    title: '404 | Page Not Found',
    component: NotFound,
  },
];
