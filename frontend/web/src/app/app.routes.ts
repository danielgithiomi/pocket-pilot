import { Routes } from '@angular/router';
import { Auth } from '@pages/auth/auth/auth';
import { Login } from '@pages/auth/login/login';
import { Register } from '@pages/auth/register/register';
import { NotFound } from '@pages/shared/not-found/not-found';
import { WEB_ROUTES } from '@global/constants/routes.constants';

export const routes: Routes = [
  {
    path: WEB_ROUTES.dashboard,
    loadComponent: () => import('@pages/home/home').then((m) => m.Home)
  },
  {
    pathMatch: 'full',
    path: WEB_ROUTES.root,
    redirectTo: WEB_ROUTES.dashboard,
  },
  {
    path: 'auth',
    component: Auth,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
    ],
  },
  {
    path: '**',
    component: NotFound,
  },
];
