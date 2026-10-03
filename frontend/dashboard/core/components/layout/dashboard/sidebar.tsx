import Image from 'next/image';
import Link from 'next/link';
import { PPDRoutes } from '@config/routes';
import { dashboardNavigation, isNavigationItemActive } from '@config/navigation';
import { NavigationIcon } from './icon';
import styles from './wrapper.module.css';

type DashboardSidebarProps = {
    pathname: string;
    collapsed?: boolean;
    onNavigate?: () => void;
    onClose?: () => void;
};

export function DashboardSidebar({ pathname, collapsed = false, onNavigate, onClose }: DashboardSidebarProps) {
    return (
        <div className={styles.sidebar} data-collapsed={collapsed}>
            <div className={styles.sidebarHeader}>
                <Link href={PPDRoutes.root} className={styles.brand} aria-label="Pocket Pilot dashboard home" onNavigate={onNavigate}>
                    <span className={styles.brandMark}>
                        <Image src="/images/branding/logo.png" alt="" width={28} height={28} className={styles.logo} preload />
                    </span>
                    <span className={styles.brandText}>Pocket Pilot</span>
                </Link>
                {onClose && (
                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close navigation">
                        <NavigationIcon name="close" size={20} />
                    </button>
                )}
            </div>

            <div className={styles.navigation}>
                {dashboardNavigation.map((group) => (
                    <nav key={group.label} className={styles.navigationGroup} aria-label={group.label}>
                        <p className={styles.groupLabel}>{group.label}</p>
                        <ul className={styles.linkList}>
                            {group.items.map((item) => {
                                const active = isNavigationItemActive(pathname, item.href);

                                return (
                                    <li key={item.href}>
                                        <Link href={item.href} className={styles.navigationLink}
                                            aria-label={item.label} aria-current={active ? 'page' : undefined}
                                            title={collapsed ? item.label : undefined} onNavigate={onNavigate} prefetch={false}>
                                            <span className={styles.navigationIcon}><NavigationIcon name={item.icon} size={20} /></span>
                                            <span className={styles.linkText}>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className={styles.sidebarFooter}>
                <div className={styles.workspaceLabel} title={collapsed ? 'Admin workspace' : undefined}>
                    <span className={styles.workspaceAvatar}><NavigationIcon name="shield" size={18} /></span>
                    <span className={styles.footerText}>Admin workspace<small>Pocket Pilot</small></span>
                </div>
            </div>
        </div>
    );
}
