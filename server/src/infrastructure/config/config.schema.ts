import { z } from 'zod';

export const PPConfigSchema = z.object({
    // Application
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3005),
    BASE_URL: z.string().default('http://localhost:3005'),

    // Database
    DATABASE_URL: z.string().url(),
    DATABASE_POOL_SIZE: z.coerce.number().default(10),

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_DEFAULT_TTL_SECONDS: z.coerce.number().int().positive().default(15), // 15 seconds

    // AWS
    AWS_MAX_ATTEMPTS: z.coerce.number().default(5),
    AWS_S3_REGION: z.string().default('AWS_S3_REGION'),
    AWS_MAX_SOCKET_TIMEOUT: z.coerce.number().default(5000),
    AWS_ACCESS_KEY_ID: z.string().default('AWS_ACCESS_KEY_ID'),
    AWS_MAX_CONNECTION_TIMEOUT: z.coerce.number().default(5000),
    AWS_S3_BUCKET_NAME: z.string().default('AWS_S3_BUCKET_NAME'),
    AWS_SECRET_ACCESS_KEY: z.string().default('AWS_SECRET_ACCESS_KEY'),
    AWS_PRESIGNED_URL_EXPIRATION_IN_SECONDS: z.coerce.number().default(300),
});

export type PPCustomConfig = z.infer<typeof PPConfigSchema>;
