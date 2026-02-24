import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CookiesService } from '@modules/identity/services/cookies.service';
import { DatabaseService } from '@infrastructure/database/database.service';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, DatabaseService, CookiesService, JwtService],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
