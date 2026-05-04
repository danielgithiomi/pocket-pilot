/**
 * @fileoverview
 * This file is used to configure the application for different environments.
 * For local development, use environment.ts
 * For production, use environment.production.ts
 *
 * Please note that this file should not be edited or used in production.
 * Instead, use environment.production.ts for production.
 *
 * A build script will automatically replace this file with environment.production.ts
 * when building for production. Ensure that you have a .env file with the necessary
 * environment variables for production.
 */

/**
 * Development environment configuration
 * This file is used for local development
 * For production, use environment.production.ts
 */
export const environment = {
  production: false,
  awsRegion: 'aws-region-goes-here',
  API_BASE_URL: 'api-base-url-goes-here',
  awsS3BucketName: 'aws-s3-bucket-name-goes-here',
  syncfusionLicenseKey: 'syncfusion-license-key-goes-here',
};
