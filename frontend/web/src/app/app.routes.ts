import { Routes } from '@angular/router';
import { MainLayout } from '@pages/layouts';
import { Auth } from '@pages/auth/auth/auth';
import { Login } from '@pages/auth/login/login';
import { Register } from '@pages/auth/register/register';
import { NotFound } from '@pages/shared/not-found/not-found';
import { WEB_ROUTES } from '@global/constants/routes.constants';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        title: 'Home | Pocket Pilot',
        path: WEB_ROUTES.home,
        loadComponent: () => import('@pages/home/home').then((m) => m.Home)
      },
      {
        title: 'Dashboard | Pocket Pilot',
        path: WEB_ROUTES.dashboard,
        loadComponent: () => import('@pages/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        title: 'Profile | Pocket Pilot',
        path: WEB_ROUTES.profile,
        loadComponent: () => import('@pages/profile/profile').then((m) => m.Profile)
      }
    ]
  },
  {
    path: 'auth',
    component: Auth,
    children: [
      {
        title: 'Login | Pocket Pilot',
        path: 'login',
        component: Login,
      },
      {
        title: 'Register | Pocket Pilot',
        path: 'register',
        component: Register,
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
