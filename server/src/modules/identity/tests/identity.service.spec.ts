import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CookiesService } from '@modules/identity/services/cookies.service';
import { DatabaseService } from '@infrastructure/database/database.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, DatabaseService, CookiesService, JwtService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
