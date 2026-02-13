import {Routes} from '@angular/router';
import {Home} from './pages/home/home';
import {Login} from './pages/auth/login/login';
import {Register} from './pages/auth/register/register';
import {NotFound} from './pages/shared/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'auth',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '**',
    component: NotFound
  }
];
