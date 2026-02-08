import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return successful root api hit', () => {
            expect(appController.getRoot()).toBe('You have successfully called the Pocket Pilot API!');
        });
    });
});
