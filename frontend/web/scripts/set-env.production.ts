import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const awsRegion = process.env['AWS_REGION'] || 'us-east-1';
const awsS3BucketName = process.env['AWS_S3_BUCKET_NAME'] || '';
const prodTargetPath = './src/environments/environment.production.ts';
const syncfusionLicenseKey = process.env['SYNCFUSION_LICENSE_KEY'] || '';
const prodBaseApiUrl = process.env['PROD_API_BASE_URL'] || 'https://prod-dummy/api/v1/';

const prodFileContent = `export const environment = {
    production: true,
    awsRegion: '${awsRegion}',
    awsS3BucketName: '${awsS3BucketName}',
    API_BASE_URL: '${prodBaseApiUrl}',
    syncfusionLicenseKey: '${syncfusionLicenseKey}',
};
`;

fs.writeFileSync(prodTargetPath, prodFileContent, { encoding: 'utf8' });
console.log(`Environment file generated at ${prodTargetPath}`);
