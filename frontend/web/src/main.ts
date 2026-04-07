import { App } from './app/app';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppConfig as config } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

// Register Syncfusion license
registerLicense('');

bootstrapApplication(App, config).catch((err) => console.error(err));
