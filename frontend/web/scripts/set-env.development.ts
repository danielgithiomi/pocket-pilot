import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const devTargetPath = './src/environments/environment.development.ts';
const syncfusionLicenseKey = process.env['SYNCFUSION_LICENSE_KEY'] || '';
const devBaseApiUrl = process.env['DEV_API_BASE_URL'] || 'http://dummy:localhost/api/v1/';

const devFileContent = `export const environment = {
  production: false,
  API_BASE_URL: '${devBaseApiUrl}',
  syncfusionLicenseKey: '${syncfusionLicenseKey}',
};
`;

fs.writeFileSync(devTargetPath, devFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${devTargetPath}`);
