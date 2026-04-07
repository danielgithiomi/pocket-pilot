import { App } from './app/app';
import { AppConfig as config } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(App, config).catch((err) => console.error(err));
