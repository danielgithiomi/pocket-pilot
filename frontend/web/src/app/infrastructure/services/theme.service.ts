import type { User } from '@shared/types';
import { AuthService } from '@api/auth.service';
import { STORED_AUTH_USER_KEY } from '@libs/constants';
import { Injectable, signal, computed, effect, DestroyRef, inject } from '@angular/core';
import {
    type ResolvedTheme,
    type ThemePreference,
    applyThemeToDocument,
    normalizeThemePreference,
    readStoredThemePreference
} from './theme.utils';

/** @deprecated Use ThemePreference instead */
export type Theme = ThemePreference;

export type { ThemePreference, ResolvedTheme };

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly destroyRef = inject(DestroyRef);
    private readonly authService = inject(AuthService);

    private systemMediaQuery: MediaQueryList | null = null;
    private readonly preference = signal<ThemePreference>(readStoredThemePreference());
    private readonly resolvedTheme = signal<ResolvedTheme>(applyThemeToDocument(readStoredThemePreference()));

    /** User preference: SYSTEM, LIGHT, or DARK */
    readonly theme = computed(() => this.preference());

    /** Resolved visual theme currently applied to the document */
    readonly activeTheme = computed(() => this.resolvedTheme());

    constructor() {
        effect(() => {
            this.applyPreference(this.preference());
        });

        effect(() => {
            const userTheme = this.authService.user()?.userPreferences?.preferredTheme;
            const normalized = normalizeThemePreference(userTheme);
            if (normalized && normalized !== this.preference()) {
                this.preference.set(normalized);
            }
        });

        this.destroyRef.onDestroy(() => this.cleanupSystemListener());
    }

    setTheme(theme: ThemePreference | string): void {
        const normalized = normalizeThemePreference(theme) ?? 'SYSTEM';
        this.preference.set(normalized);
        this.persistPreference(normalized);
    }

    /** Apply theme visually without persisting — used while editing settings. */
    previewTheme(theme: ThemePreference | string): void {
        const normalized = normalizeThemePreference(theme) ?? 'SYSTEM';
        this.preference.set(normalized);
    }

    initializeTheme(backendTheme?: ThemePreference | string): void {
        const normalized = normalizeThemePreference(backendTheme);
        if (normalized) {
            this.setTheme(normalized);
        }
    }

    private applyPreference(preference: ThemePreference): void {
        this.cleanupSystemListener();

        const resolved = applyThemeToDocument(preference);
        this.resolvedTheme.set(resolved);

        if (preference === 'SYSTEM') {
            this.setupSystemListener();
        }
    }

    private setupSystemListener(): void {
        this.systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemMediaQuery.addEventListener('change', this.handleSystemChange);
    }

    private cleanupSystemListener(): void {
        if (this.systemMediaQuery) {
            this.systemMediaQuery.removeEventListener('change', this.handleSystemChange);
            this.systemMediaQuery = null;
        }
    }

    private handleSystemChange = (event: MediaQueryListEvent): void => {
        if (this.preference() !== 'SYSTEM') return;

        const resolved: ResolvedTheme = event.matches ? 'dark' : 'light';
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        this.resolvedTheme.set(resolved);
    };

    private persistPreference(theme: ThemePreference): void {
        try {
            const storedUser = localStorage.getItem(STORED_AUTH_USER_KEY);
            if (!storedUser) return;

            const user = JSON.parse(storedUser) as User;
            user.userPreferences = {
                ...user.userPreferences,
                preferredTheme: theme
            };
            localStorage.setItem(STORED_AUTH_USER_KEY, JSON.stringify(user));
        } catch {
            // Ignore malformed storage payloads
        }
    }
}
