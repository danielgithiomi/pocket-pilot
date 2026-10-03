import styles from './wrapper.module.css';
import { NavigationIcon } from './icon';

type DashboardHeaderProps = {
    title: string;
    pathname: string;
    mobileOpen: boolean;
    onOpenNavigation: () => void;
};

export function DashboardHeader({ title, pathname, mobileOpen, onOpenNavigation }: DashboardHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerTitle}>
                <button type="button" className={styles.menuButton} onClick={onOpenNavigation}
                    aria-label="Open navigation" aria-controls="mobile-navigation" aria-expanded={mobileOpen}>
                    <NavigationIcon name="menu" size={22} />
                </button>
                <h1 className={styles.srOnly}>{title}</h1>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <span className={styles.breadcrumbLabel}>Workspace</span>
                    <span className={styles.breadcrumbPath}>{pathname}</span>
                </nav>
            </div>
            <span className={styles.headerLabel}>Admin workspace</span>
        </header>
    );
}
