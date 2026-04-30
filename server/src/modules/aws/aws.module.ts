import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { S3ClientService } from '@infrastructure/config';

@Module({
    controllers: [AwsController],
    providers: [AwsService, S3ClientService],
})
export class AwsModule {}
