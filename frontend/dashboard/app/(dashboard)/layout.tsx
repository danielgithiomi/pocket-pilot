import type { ReactNode } from 'react';
import { DashboardShell } from '@/core/components/layout/dashboard/wrapper';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
