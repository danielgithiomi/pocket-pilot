import { Injectable } from '@nestjs/common';
import { OnboardingPayload } from '../dto/onboarding.dto';
import { OnboardingRepository } from '../repositories/onboarding.repository';

@Injectable()
export class OnboardingService {
    constructor(
        private readonly onboardingRepository: OnboardingRepository
    ) {}

    onboardUser(userId: string, payload: OnboardingPayload) {
        return this.onboardingRepository.onboardUser(userId, payload);
    }
}
