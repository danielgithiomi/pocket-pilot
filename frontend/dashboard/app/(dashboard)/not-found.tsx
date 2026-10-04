import Link from 'next/link';
import { PPDRoutes } from '@config/routes';
import { NavigationIcon } from '@layout/shell';
import styles from '@layout/shell/wrapper.module.css';

export default function DashboardNotFound() {
    return (
        <div className={styles.notFound}>
            <span className={styles.notFoundCode}>404</span>
            <h2>Page not found</h2>
            <p>This page isn’t available yet. Use the navigation to return to your workspace.</p>
            <Link href={PPDRoutes.root} className={styles.homeLink}>
                <NavigationIcon name="chevron-left" size={16} />
                Back to dashboard
            </Link>
        </div>
    );
}
