import type { User } from '@global/types';
import { AuthService } from '@api/auth.service';
import { STORED_AUTH_USER_KEY } from '@libs/constants/auth.constants';
import { Injectable, signal, computed, effect, DestroyRef, inject } from '@angular/core';

export type Theme = 'SYSTEM' | 'LIGHT' | 'DARK';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  private systemMediaQuery: MediaQueryList | null = null;
  private readonly currentTheme = signal<Theme>(
    (this.authService.user()?.userPreferences?.preferredTheme as Theme) || 'system',
  );

  readonly theme = computed(() => this.currentTheme());

  constructor() {
    this.loadThemeFromStorage();

    effect(() => {
      this.applyTheme(this.currentTheme());
    });

    this.setupStorageListener();

    this.destroyRef.onDestroy(() => {
      this.cleanupSystemListener();
      this.cleanupStorageListener();
    });
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.updateThemeInUser(theme);
  }

  private updateThemeInUser(theme: Theme): void {
    const storedUser = localStorage.getItem(STORED_AUTH_USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      user.userPreferences = {
        ...user.userPreferences,
        preferredTheme: theme,
      };
      localStorage.setItem(STORED_AUTH_USER_KEY, JSON.stringify(user));
    }
  }

  /** Call this after fetching user preferences from your backend */
  initializeTheme(backendTheme?: Theme): void {
    if (backendTheme && ['SYSTEM', 'LIGHT', 'DARK'].includes(backendTheme)) {
      const stored = this.getThemeFromUser();
      // Only override localStorage if it's different from what we have
      if (stored !== backendTheme) {
        this.setTheme(backendTheme);
      }
    }
  }

  private getThemeFromUser(): Theme | null {
    const storedUser = localStorage.getItem(STORED_AUTH_USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      const theme = user.userPreferences?.preferredTheme;
      if (theme && ['SYSTEM', 'LIGHT', 'DARK'].includes(theme)) {
        return theme as Theme;
      }
    }
    return null;
  }

  private loadThemeFromStorage(): void {
    const stored = this.getThemeFromUser();
    if (stored) {
      this.currentTheme.set(stored);
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    this.cleanupSystemListener();

    if (theme === 'SYSTEM') {
      this.setupSystemListener();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme?.toLowerCase() || 'system');
    }
  }

  private setupSystemListener(): void {
    this.systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.handleSystemChange(this.systemMediaQuery);
    this.systemMediaQuery.addEventListener('change', this.handleSystemChange);
  }

  private cleanupSystemListener(): void {
    if (this.systemMediaQuery) {
      this.systemMediaQuery.removeEventListener('change', this.handleSystemChange);
      this.systemMediaQuery = null;
    }
  }

  private handleSystemChange = (e: MediaQueryListEvent | MediaQueryList): void => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(e.matches ? 'dark' : 'light');
  };

  private setupStorageListener(): void {
    window.addEventListener('storage', this.handleStorageChange);
  }

  private cleanupStorageListener(): void {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === STORED_AUTH_USER_KEY && event.newValue) {
      const theme = this.getThemeFromUser();
      if (theme && theme !== this.currentTheme()) {
        this.currentTheme.set(theme);
      }
    }
  };
}
