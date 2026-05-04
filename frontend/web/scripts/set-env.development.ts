import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const awsRegion = process.env['AWS_REGION'] || 'us-east-1';
const awsS3BucketName = process.env['AWS_S3_BUCKET_NAME'] || '';
const devTargetPath = './src/environments/environment.development.ts';
const syncfusionLicenseKey = process.env['SYNCFUSION_LICENSE_KEY'] || '';
const devBaseApiUrl = process.env['DEV_API_BASE_URL'] || 'http://dummy:localhost/api/v1/';

const devFileContent = `export const environment = {
  production: false,
  awsRegion: '${awsRegion}',
  API_BASE_URL: '${devBaseApiUrl}',
  awsS3BucketName: '${awsS3BucketName}',
  syncfusionLicenseKey: '${syncfusionLicenseKey}',
};
`;

fs.writeFileSync(devTargetPath, devFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${devTargetPath}`);
