import { Injectable } from '@nestjs/common';
import { FeaturesRepository } from '../repositories/features.repository';

@Injectable()
export class FeaturesService {
    constructor(private readonly featuresRepository: FeaturesRepository) {}
}
