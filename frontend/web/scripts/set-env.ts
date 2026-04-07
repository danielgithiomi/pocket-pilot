import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const devTargetPath = './../src/environments/environment.development.ts';
const prodTargetPath = './../src/environments/environment.production.ts';

const devFileContent = `export const environment = {
  production: false,
  syncfusionLicenseKey: '${process.env.SYNCFUSION_LICENSE_KEY || ''}',
};
`;

const prodFileContent = `export const environment = {
  production: true,
  syncfusionLicenseKey: '${process.env.SYNCFUSION_LICENSE_KEY || ''}',
};
`;

fs.writeFileSync(devTargetPath, devFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${devTargetPath}`);

fs.writeFileSync(prodTargetPath, prodFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${prodTargetPath}`);
