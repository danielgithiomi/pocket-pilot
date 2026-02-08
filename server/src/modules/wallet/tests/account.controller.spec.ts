import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../controllers/account.controller';
import { AccountService } from '../services/account.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { describe, beforeEach, it, expect } from '@jest/globals';

describe('AccountController', () => {
    let controller: AccountController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [AccountService],
            controllers: [AccountController],
        }).compile();

        controller = module.get<AccountController>(AccountController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
