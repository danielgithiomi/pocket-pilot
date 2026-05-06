import { Module } from '@nestjs/common';
import { SplitwiseService } from './splitwise.service';
import { SplitwiseController } from './splitwise.controller';

@Module({
  controllers: [SplitwiseController],
  providers: [SplitwiseService],
})
export class SplitwiseModule {}
