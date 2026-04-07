import { App } from './app/app';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppConfig as config } from './app/app.config';
import { environment } from '@environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';

// Register Syncfusion license
registerLicense(environment.syncfusionLicenseKey);

bootstrapApplication(App, config).catch((err) => console.error(err));
