import { Routes } from '@angular/router';
import { Login } from '@pages/auth/login/login';
import { AuthLayout } from '@pages/layouts/auth';
import { MainLayout } from '@pages/layouts/main';
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
    ],
  },
  {
    path: '**',
    title: '404 | Page Not Found',
    component: NotFound,
  },
];
