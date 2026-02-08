import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { describe, beforeEach, it, expect } from '@jest/globals';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, DatabaseService],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
