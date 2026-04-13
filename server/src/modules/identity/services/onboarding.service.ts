import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OnboardingRepository } from '../repositories/onboarding.repository';
import { OnboardingPayload, UserWithPreferencesDto } from '../dto/onboarding.dto';

@Injectable()
export class OnboardingService {
    constructor(private readonly onboardingRepository: OnboardingRepository) {}

    async onboardUser(userId: string, payload: OnboardingPayload) {
        const onboardedUser = await this.onboardingRepository.onboardUser(userId, payload);
        return plainToInstance(UserWithPreferencesDto, onboardedUser, { excludeExtraneousValues: true });
    }
}
