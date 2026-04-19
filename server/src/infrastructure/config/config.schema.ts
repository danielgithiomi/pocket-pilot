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
    REDIS_DEFAULT_TTL_SECONDS: z.number().default(15), // 15 seconds
});

export type PPCustomConfig = z.infer<typeof PPConfigSchema>;
