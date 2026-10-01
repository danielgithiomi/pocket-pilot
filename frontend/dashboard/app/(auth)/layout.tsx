import { Metadata } from 'next';
import { ReactNode } from 'react';
import { PPDRoutes } from '@config/routes';
import { AuthNavigation } from '@features/auth';

export const metadata: Metadata = {
    title: {
        default: 'Pocket Pilot Dashboard Auth',
        template: '%s | Pocket Pilot Dashboard'
    },
    description: 'This is the Auth Layout'
};

export default function AuthLayout({ children }: { children: ReactNode }) {
    const authNavigationLinks = [
        { name: 'Login', href: PPDRoutes.login },
        { name: 'Register', href: PPDRoutes.register }
    ];

    return (
        <section id="section-auth" className="flex flex-col flex-1 bg-inverted-background/3 m-8 p-8">
            <h1>This is the Auth Layout</h1>

            <div id="auth-navigation" className="flex gap-6 bg-white/5 mb-6">
                <AuthNavigation navigationLinks={authNavigationLinks} />
            </div>

            <div className="flex flex-col flex-1">{children}</div>
        </section>
    );
}
