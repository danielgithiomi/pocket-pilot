import { Module } from '@nestjs/common';
import { AwsModule } from '@modules/aws/aws.module';
import { FeaturesService } from './services/features.service';
import { CommentsService } from './services/comments.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { FeaturesController } from './controllers/features.controller';
import { CommentsController } from './controllers/comments.controller';
import { FeaturesRepository } from './repositories/features.repository';
import { CommentsRepository } from './repositories/comments.repository';
import { FeatureCommentsCache, FeaturesCache } from './cache/features.cache';

@Module({
    imports: [IdentityModule, AwsModule],
    controllers: [FeaturesController, CommentsController],
    providers: [FeaturesService, CommentsService, FeaturesRepository, CommentsRepository, FeaturesCache, FeatureCommentsCache]
})
export class FeaturesModule {}
