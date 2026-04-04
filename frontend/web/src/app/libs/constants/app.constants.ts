import { DrawerNavigationLink } from '@libs/types';

export const DrawerNavigationLinks: DrawerNavigationLink[] = [
  {
    icon: 'home',
    name: 'Home',
    path: '/',
  },
  {
    icon: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: 'accounts',
    name: 'Accounts',
    path: '/accounts',
  },
  {
    icon: 'transactions',
    name: 'Transactions',
    path: '/transactions',
  },
  {
    icon: 'categories',
    name: 'Categories',
    path: '/categories',
  },
  {
    icon: 'goals',
    name: 'Goals_Bills',
    path: '/goals',
  },
  {
    icon: 'profile',
    name: 'Profile',
    path: '/profile',
  },
];

export const AdditionalDrawerNavigationLinks: DrawerNavigationLink[] = [
  {
    icon: 'support',
    name: 'Support',
    path: '/support',
  },
];
