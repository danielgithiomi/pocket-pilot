import { App } from './app/app';
import type { User } from '@global/types';
import { enableProdMode } from '@angular/core';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppConfig as config } from './app/app.config';
import { environment } from '@environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import type { Theme } from './app/infrastructure/services/theme.service';
import { STORED_AUTH_USER_KEY } from './app/libs/constants/auth.constants';

function initializeTheme(): void {
  const storedUser = localStorage.getItem(STORED_AUTH_USER_KEY);
  let theme: Theme | null = null;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as User;
      const storedTheme = user.userPreferences?.preferredTheme;
      if (storedTheme && ['SYSTEM', 'LIGHT', 'DARK'].includes(storedTheme)) {
        theme = storedTheme as Theme;
      }
    } catch {}
  }

  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'DARK') {
    root.classList.add('dark');
  } else if (theme === 'LIGHT') {
    root.classList.add('light');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
  }
}

initializeTheme();

// Register Syncfusion license
registerLicense(environment.syncfusionLicenseKey);

// Enable Production Mode
if (environment.production) enableProdMode();

bootstrapApplication(App, config).catch((err) => console.error(err));
