import { JwtService } from '@nestjs/jwt';
import { CookiesAuthGuard } from '@common/guards';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, beforeEach, expect } from '@jest/globals';
import { TransactionService } from '../services/transaction.service';
import { UserService } from '@modules/identity/services/user.service';
import { DatabaseService } from '@infrastructure/database/database.service';
import { TransactionController } from '../controllers/transaction.controller';

describe('TransactionController', () => {
    let controller: TransactionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [TransactionService, DatabaseService, JwtService, CookiesAuthGuard, UserService],
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
