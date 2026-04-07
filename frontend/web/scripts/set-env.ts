import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const devTargetPath = './src/environments/environment.development.ts';
const prodTargetPath = './src/environments/environment.production.ts';

const prodBaseApiUrl = process.env['PROD_API_BASE_URL'] || 'https://prod-dummy/api/v1/';
const devBaseApiUrl = process.env['DEV_API_BASE_URL'] || 'http://dummy:localhost/api/v1/';

const syncfusionLicenseKey = process.env['SYNCFUSION_LICENSE_KEY'] || '';

const devFileContent = `export const environment = {
  production: false,
  API_BASE_URL: '${devBaseApiUrl}',
  syncfusionLicenseKey: '${syncfusionLicenseKey}',
};
`;

const prodFileContent = `export const environment = {
  production: true,
  API_BASE_URL: '${prodBaseApiUrl}',
  syncfusionLicenseKey: '${syncfusionLicenseKey}',
};
`;

fs.writeFileSync(devTargetPath, devFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${devTargetPath}`);

fs.writeFileSync(prodTargetPath, prodFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${prodTargetPath}`);
