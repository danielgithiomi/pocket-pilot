import { Auth_Feature } from './../types/auth.types';

export const STORED_AUTH_USER_KEY: string = 'PP_AUTH_USER';
export const STORED_ONBOARDING_USER_KEY: string = 'PP_ONBOARDING_USER';

export type AuthError = 'email' | 'password';
export const INVALID_EMAIL_IDENTIFIER: string = 'USER_NOT_FOUND';
export const INVALID_PASSWORD_IDENTIFIER: string = 'INVALID_CREDENTIALS';

export const APP_FEATURES: Auth_Feature[] = [
    {
        id: 1,
        name: 'Expense & Revenue Tracking'
    },
    {
        id: 2,
        name: 'Real-time Account Balances'
    },
    {
        id: 3,
        name: 'Smart Insights & Analytics'
    },
    {
        id: 4,
        name: 'Secure Authentication'
    }
];
