import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../services/account.service';
import { AccountController } from '../controllers/account.controller';

describe('AccountController', () => {
    let controller: AccountController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountController],
            providers: [AccountService],
        }).compile();

        controller = module.get<AccountController>(AccountController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
