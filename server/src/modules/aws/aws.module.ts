import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { Module, forwardRef } from '@nestjs/common';
import { S3ClientService } from '@infrastructure/config';
import { IdentityModule } from '@modules/identity/identity.module';

@Module({
    exports: [AwsService],
    controllers: [AwsController],
    providers: [AwsService, S3ClientService],
    imports: [forwardRef(() => IdentityModule)],
})
export class AwsModule {}
