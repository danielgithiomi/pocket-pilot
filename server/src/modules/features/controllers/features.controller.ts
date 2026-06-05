import { Controller } from '@nestjs/common';
import { FeaturesService } from '../services/features.service';

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}
}
