import { Module } from '@nestjs/common';
import { FeaturesCache } from './cache/features.cache';
import { FeaturesService } from './services/features.service';
import { CommentsService } from './services/comments.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { FeaturesController } from './controllers/features.controller';
import { CommentsController } from './controllers/comments.controller';
import { FeaturesRepository } from './repositories/features.repository';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
    imports: [IdentityModule],
    controllers: [FeaturesController, CommentsController],
    providers: [FeaturesService, CommentsService, FeaturesRepository, CommentsRepository, FeaturesCache]
})
export class FeaturesModule {}
