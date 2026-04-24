import { Routes } from '@angular/router';
import { Login } from '@pages/auth/login/login';
import { AuthLayout } from '@pages/layouts/auth';
import { MainLayout } from '@pages/layouts/main';
import { DrawerlessLayout } from '@pages/layouts/drawerless';
import { NotFound } from '@pages/shared/not-found/not-found';
import { WEB_ROUTES } from '@global/constants/routes.constants';
import { AuthGuard, GuestGuard, OnboardedGuard, OnboardingGuard } from '@infrastructure/guards';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login,
        canMatch: [GuestGuard],
        title: 'Login | Pocket Pilot',
      },
      {
        path: 'register',
        title: 'Register | Pocket Pilot',
        loadComponent: () => import('@pages/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: WEB_ROUTES.onboarding,
    canMatch: [OnboardingGuard],
    component: DrawerlessLayout,
    loadChildren: () => [
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
    canMatch: [AuthGuard, OnboardedGuard],
    loadChildren: () => [
      // {
      //   path: WEB_ROUTES.home,
      //   title: 'Home | Pocket Pilot',
      //   component: NotFound,
      // },
      {
        path: WEB_ROUTES.dashboard,
        title: 'Dashboard | Pocket Pilot',
        loadComponent: () => import('@pages/main/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: WEB_ROUTES.profile,
        title: 'Profile | Pocket Pilot',
        loadComponent: () => import('@pages/main/profile/profile').then((m) => m.Profile),
      },
      {
        title: 'Accounts | Pocket Pilot',
        path: WEB_ROUTES.accounts,
        loadComponent: () => import('@pages/main/accounts/accounts').then((m) => m.Accounts),
      },
      {
        title: 'Account Details | Pocket Pilot',
        path: WEB_ROUTES.accountDetails,
        loadComponent: () =>
          import('@pages/main/account_details/account-details').then((m) => m.AccountDetails),
      },
      {
        title: 'Transactions | Pocket Pilot',
        path: WEB_ROUTES.transactions,
        loadComponent: () =>
          import('@pages/main/transactions/transactions').then((m) => m.Transactions),
      },
      {
        title: 'Settings | Pocket Pilot',
        path: WEB_ROUTES.settings,
        loadComponent: () =>
          import('@pages/main/settings_and_categories/settings-and-categories').then(
            (m) => m.SettingsAndCategories,
          ),
      },
      {
        title: 'Goals & Bills | Pocket Pilot',
        path: WEB_ROUTES.goals,
        loadComponent: () =>
          import('@pages/main/goals_and_bills/goals-and-bills').then((m) => m.Goals),
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
