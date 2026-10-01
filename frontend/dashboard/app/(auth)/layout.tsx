import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <section id="section-auth" className="flex flex-col flex-1 bg-inverted-background/3 m-8 p-8">
            <h1>This is the Auth Layout</h1>
            <div className="flex flex-col flex-1">{children}</div>
        </section>
    );
}
