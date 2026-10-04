'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { dashboardNavigation, isNavigationItemActive } from '@config/navigation';
import { DashboardHeader } from './header';
import { DashboardSidebar } from './sidebar';
import { NavigationIcon } from './icon';
import styles from './wrapper.module.css';

export function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const mobileDrawer = useRef<HTMLDialogElement>(null);
    const activeItem = dashboardNavigation.flatMap((group) => group.items)
        .find((item) => isNavigationItemActive(pathname, item.href));
    const title = activeItem?.label ?? (pathname === '/' ? 'Dashboard' : 'Page not found');

    // Also dismiss the mobile drawer after browser back/forward navigation.
    useEffect(() => {
        mobileDrawer.current?.close();
    }, [pathname]);

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 768px)');
        const onResize = () => {
            if (desktop.matches) mobileDrawer.current?.close();
        };
        desktop.addEventListener('change', onResize);
        return () => desktop.removeEventListener('change', onResize);
    }, []);

    function openMobileDrawer() {
        mobileDrawer.current?.showModal();
        mobileDrawer.current?.querySelector('button')?.focus();
        setMobileOpen(true);
    }

    function closeMobileDrawer() {
        mobileDrawer.current?.close();
    }

    function handleDrawerKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
        if (event.key !== 'Tab') return;

        const controls = event.currentTarget.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>('a[href], button:not([disabled])');
        const first = controls[0];
        const last = controls[controls.length - 1];

        // Keep Tab cycling through the drawer, including at either end of its links.
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }

    return (
        <div className={styles.shell}>
            <a href="#dashboard-content" className={styles.skipLink}>Skip to content</a>

            <aside id="desktop-navigation" aria-label="Dashboard navigation" className={styles.desktopSidebar} data-collapsed={collapsed}>
                <DashboardSidebar pathname={pathname} collapsed={collapsed} />
                <button type="button" className={styles.collapseButton} onClick={() => setCollapsed((value) => !value)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}
                    aria-controls="desktop-navigation" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                    <NavigationIcon name={collapsed ? 'chevron-right' : 'chevron-left'} size={14} />
                </button>
            </aside>

            {/* Native dialog makes the background inert and handles Escape and focus restoration. */}
            <dialog id="mobile-navigation" ref={mobileDrawer} className={styles.mobileDrawer} aria-label="Dashboard navigation"
                onClose={() => setMobileOpen(false)} onKeyDown={handleDrawerKeyDown} onClick={(event) => {
                    if (event.target === event.currentTarget) closeMobileDrawer();
                }}>
                <DashboardSidebar pathname={pathname} onClose={closeMobileDrawer} onNavigate={closeMobileDrawer} />
            </dialog>

            <div className={styles.mainColumn}>
                <DashboardHeader title={title} pathname={pathname} mobileOpen={mobileOpen} onOpenNavigation={openMobileDrawer} />
                <main id="dashboard-content" className={styles.content} tabIndex={-1} aria-label={title}>
                    {children}
                </main>
            </div>
        </div>
    );
}
