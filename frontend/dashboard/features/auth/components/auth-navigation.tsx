'use client';

import { ReactNode } from 'react';
import { cn } from '@/core/libs/cn';
import Link from 'next/dist/client/link';
import { usePathname } from 'next/navigation';

interface AuthNavigationProps {
    navigationLinks: { name: string; href: string }[];
}

export const AuthNavigation = ({ navigationLinks }: AuthNavigationProps): ReactNode => {
    const pathname = usePathname();

    const isPathActive = (path: string): boolean => {
        return pathname === path;
    };

    return (
        <>
            {navigationLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className={cn(isPathActive(link.href) ? 'text-quaternary' : 'text-primary')}>
                    {link.name}
                </Link>
            ))}
        </>
    );
};
