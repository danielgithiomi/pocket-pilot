import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger('DATABASE');

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
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
