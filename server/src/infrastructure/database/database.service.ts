import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  onModuleInit(): void {
    this.$connect()
      .then(() => console.log('Database connection established'))
      .catch((err: any) => console.error('Database connection error:', err));
  }

  onModuleDestroy(): void {
    this.$disconnect()
      .then(() => console.log('Database connection closed'))
      .catch((err: any) => console.error('Database disconnection error:', err));
  }
}
