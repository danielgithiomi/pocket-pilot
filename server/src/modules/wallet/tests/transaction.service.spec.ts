import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, beforeEach, expect } from '@jest/globals';
import { TransactionService } from '../services/transaction.service';
import { DatabaseService } from '@infrastructure/database/database.service';

describe('TransactionService', () => {
    let service: TransactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TransactionService, DatabaseService],
        }).compile();

        service = module.get<TransactionService>(TransactionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
