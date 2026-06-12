import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

const withUtcDatabaseTimezone = (connectionString: string): string => {
    try {
        const url = new URL(connectionString);
        const options = url.searchParams.get('options') ?? '';

        if (!/timezone\s*=\s*utc/i.test(options)) {
            const utcOption = '-c timezone=UTC';
            url.searchParams.set('options', options ? `${options} ${utcOption}` : utcOption);
        }

        return url.toString();
    } catch {
        return connectionString;
    }
};

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger('DATABASE');

    constructor() {
        const adapter = new PrismaPg({
            connectionString: withUtcDatabaseTimezone(process.env.DATABASE_URL ?? '')
        });

        super({ adapter });
    }

    onModuleInit(): void {
        this.$connect()
            .then(() => this.logger.log('⚙️  Database connection established'))
            .catch((err: any) => this.logger.error('‼️ Database connection error:', err));
    }

    onModuleDestroy(): void {
        this.$disconnect()
            .then(() => this.logger.log('⚙️  Database connection closed'))
            .catch((err: any) => this.logger.error('‼️ Database disconnection error:', err));
    }
}
