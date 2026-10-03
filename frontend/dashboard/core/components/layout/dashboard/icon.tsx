import type { ReactNode } from 'react';
import type { DashboardIconName } from '@config/navigation';

type IconName = DashboardIconName | 'chevron-left' | 'chevron-right' | 'menu' | 'close' | 'shield';

const paths: Record<IconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
    traffic: <><path d="M3 3v18h18M7 14l4-4 4 3 6-8M16 5h5v5" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5.65" /></>,
    accounts: <><path d="M20 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" /><path d="M21 11h-5v6h5M17 14h.01" /></>,
    transactions: <><path d="m16 3 4 4-4 4M4 7h16M8 13l-4 4 4 4M4 17h16" /></>,
    goals: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    splitr: <><path d="M12 21v-8a6 6 0 0 0-6-6H3m0 0 4-4M3 7l4 4M12 17v-4a6 6 0 0 1 6-6h3m0 0-4-4m4 4-4 4" /></>,
    feedback: <><path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3zM7 8h10M7 12h6" /></>,
    notifications: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    health: <path d="M2 12h5l3-9 4 18 3-9h5" />,
    'chevron-left': <path d="m14 7-5 5 5 5" />,
    'chevron-right': <path d="m10 7 5 5-5 5" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    shield: <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
};

export function NavigationIcon({ name, size = 18 }: { name: IconName; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {paths[name]}
        </svg>
    );
}
