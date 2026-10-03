import { PPDRoutes } from './routes';

export type DashboardIconName =
    | 'overview'
    | 'traffic'
    | 'users'
    | 'accounts'
    | 'transactions'
    | 'goals'
    | 'splitr'
    | 'feedback'
    | 'notifications'
    | 'health';

type NavigationItem = {
    label: string;
    href: string;
    icon: DashboardIconName;
};

type NavigationGroup = {
    label: string;
    items: readonly NavigationItem[];
};

// These are planned destinations. Their pages can be added under app/(dashboard) later.
export const dashboardNavigation: readonly NavigationGroup[] = [
    {
        label: 'Workspace',
        items: [
            { label: 'Overview', href: PPDRoutes.overview, icon: 'overview' },
            { label: 'Traffic & engagement', href: PPDRoutes.traffic, icon: 'traffic' },
            { label: 'Users', href: PPDRoutes.users, icon: 'users' },
            { label: 'Financial accounts', href: PPDRoutes.accounts, icon: 'accounts' },
            { label: 'Transactions', href: PPDRoutes.transactions, icon: 'transactions' },
            { label: 'Goals & bills', href: PPDRoutes.goals, icon: 'goals' },
            { label: 'Splitr', href: PPDRoutes.splitr, icon: 'splitr' }
        ]
    },
    {
        label: 'Operations',
        items: [
            { label: 'Feedback', href: PPDRoutes.feedback, icon: 'feedback' },
            { label: 'Notifications', href: PPDRoutes.notifications, icon: 'notifications' },
            { label: 'System health', href: PPDRoutes.systemHealth, icon: 'health' }
        ]
    }
];

export function isNavigationItemActive(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}
