import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../controllers/account.controller';
import { AccountService } from '../services/account.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CookiesAuthGuard } from '@common/guards';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/identity/services/user.service';

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
