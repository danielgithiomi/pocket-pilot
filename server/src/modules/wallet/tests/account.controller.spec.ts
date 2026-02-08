import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from '../controllers/account.controller';
import { WalletService } from '../services/account.service';

describe('WalletController', () => {
    let controller: WalletController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WalletController],
            providers: [WalletService],
        }).compile();

        controller = module.get<WalletController>(WalletController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
