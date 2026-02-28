import { Routes } from '@angular/router';
import { MainLayout } from '@pages/layouts';
import { Login } from '@pages/auth/login/login';
import { AuthLayout } from '@pages/layouts/auth';
import { NotFound } from '@pages/shared/not-found/not-found';
import { WEB_ROUTES } from '@global/constants/routes.constants';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        title: 'Dashboard | Pocket Pilot',
        path: WEB_ROUTES.dashboard,
        loadComponent: () => import('@pages/main/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        title: 'Profile | Pocket Pilot',
        path: WEB_ROUTES.profile,
        loadComponent: () => import('@pages/main/profile/profile').then((m) => m.Profile)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        title: 'Login | Pocket Pilot',
        path: 'login',
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
    pathMatch: 'full',
    path: WEB_ROUTES.root,
    redirectTo: WEB_ROUTES.dashboard,
  },
  {
    path: '**',
    title: '404 | Page Not Found',
    component: NotFound,
  },
];
