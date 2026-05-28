import { ColorPalette, DrawerNavigationLink } from '@libs/types';

export const DrawerNavigationLinks: DrawerNavigationLink[] = [
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
    icon: 'splitwise',
    name: 'Splitwise',
    path: '/splitwise',
  },
  {
    icon: 'goals',
    name: 'Goals_Bills',
    path: '/goals',
  },
  {
    icon: 'settings',
    name: 'Settings',
    path: '/settings',
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

export const QUANTITIES: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const COLOR_PALETTE: ColorPalette[] = [
    { bg: 'bg-sky-300', fg: 'text-sky-900' },
    { bg: 'bg-pink-300', fg: 'text-pink-900' },
    { bg: 'bg-lime-300', fg: 'text-lime-900' },
    { bg: 'bg-amber-300', fg: 'text-amber-900' },
    { bg: 'bg-violet-300', fg: 'text-violet-900' },
    { bg: 'bg-teal-300', fg: 'text-teal-900' },
    { bg: 'bg-rose-300', fg: 'text-rose-900' },
    { bg: 'bg-indigo-300', fg: 'text-indigo-900' },
];