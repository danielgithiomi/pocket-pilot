import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { S3ClientService } from '@infrastructure/config';
import { IdentityModule } from '@modules/identity/identity.module';

@Module({
    imports: [IdentityModule],
    controllers: [AwsController],
    providers: [AwsService, S3ClientService],
})
export class AwsModule {}
