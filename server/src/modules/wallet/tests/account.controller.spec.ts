import { JwtService } from '@nestjs/jwt';
import { CookiesAuthGuard } from '@common/guards';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../services/account.service';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { UserService } from '@modules/identity/services/user.service';
import { AccountController } from '../controllers/account.controller';
import { DatabaseModule } from '@infrastructure/database/database.module';

describe('AccountController', () => {
    let controller: AccountController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            controllers: [AccountController],
            providers: [AccountService, JwtService, UserService, CookiesAuthGuard],
        }).compile();

        controller = module.get<AccountController>(AccountController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
