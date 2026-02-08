import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../services/account.service';
import { DatabaseModule } from '@infrastructure/database/database.module';

describe('AccountService', () => {
    let service: AccountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [AccountService],
        }).compile();

        service = module.get<AccountService>(AccountService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
