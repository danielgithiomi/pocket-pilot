import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const prodTargetPath = './src/environments/environment.production.ts';
const syncfusionLicenseKey = process.env['SYNCFUSION_LICENSE_KEY'] || '';
const prodBaseApiUrl = process.env['PROD_API_BASE_URL'] || 'https://prod-dummy/api/v1/';

const prodFileContent = `export const environment = {
  production: true,
  API_BASE_URL: '${prodBaseApiUrl}',
  syncfusionLicenseKey: '${syncfusionLicenseKey}',
};
`;

fs.writeFileSync(prodTargetPath, prodFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${prodTargetPath}`);
