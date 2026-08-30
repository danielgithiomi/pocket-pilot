import { App } from './app/app';
import { enableProdMode } from '@angular/core';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppConfig as config } from './app/app.config';
import { environment } from '@environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { applyThemeToDocument, readStoredThemePreference } from '@infrastructure/services/theme.utils';

applyThemeToDocument(readStoredThemePreference());

registerLicense(environment.syncfusionLicenseKey);

if (environment.production) enableProdMode();

bootstrapApplication(App, config).catch((err) => console.error(err));
