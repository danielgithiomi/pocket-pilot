import type { User } from '@global/types';
import { STORED_AUTH_USER_KEY } from '@libs/constants';

export type ThemePreference = 'SYSTEM' | 'LIGHT' | 'DARK';
export type ResolvedTheme = 'light' | 'dark';

export function normalizeThemePreference(value: string | null | undefined): ThemePreference | null {
    const upper = value?.trim().toUpperCase();
    if (upper === 'SYSTEM' || upper === 'LIGHT' || upper === 'DARK') {
        return upper;
    }
    return null;
}

export function readStoredThemePreference(): ThemePreference {
    try {
        const storedUser = localStorage.getItem(STORED_AUTH_USER_KEY);
        if (!storedUser) return 'SYSTEM';

        const user = JSON.parse(storedUser) as User;
        return normalizeThemePreference(user.userPreferences?.preferredTheme) ?? 'SYSTEM';
    } catch {
        return 'SYSTEM';
    }
}

export function resolveThemePreference(preference: ThemePreference): ResolvedTheme {
    if (preference === 'LIGHT') return 'light';
    if (preference === 'DARK') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyThemeToDocument(preference: ThemePreference): ResolvedTheme {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    const resolved = resolveThemePreference(preference);
    root.classList.add(resolved);
    return resolved;
}
