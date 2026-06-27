import { Injectable } from '@nestjs/common';
import { FeatureCommentPayload } from '../dto/features.dto';

@Injectable()
export class CommentsService {
    addCommentToFeature(userId: string, featureId: string, payload: FeatureCommentPayload) {
        console.log(userId, featureId, payload);
    }
}
