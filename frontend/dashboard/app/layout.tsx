import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: {
        default: 'Pocket Pilot Dashboard',
        template: '%s | Pocket Pilot Dashboard'
    },
    icons: {
        icon: [
            {
                url: '/images/branding/dark_logo.png',
                media: '(prefers-color-scheme: light)'
            },
            {
                url: '/images/branding/logo.png',
                media: '(prefers-color-scheme: dark)'
            }
        ]
    },
    description: 'Dashboard application to monitor the Pocket Pilot system and manage users, settings, and more.'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="flex flex-col min-h-full">{children}</body>
        </html>
    );
}
