import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserWithPreferencesDto } from '../dto/user.dto';
import { OnboardingPayload } from '../dto/onboarding.dto';
import { OnboardingRepository } from '../repositories/onboarding.repository';

@Injectable()
export class OnboardingService {
    constructor(private readonly onboardingRepository: OnboardingRepository) {}

    async onboardUser(userId: string, payload: OnboardingPayload) {
        const onboardedUser = await this.onboardingRepository.onboardUser(userId, payload);
        return plainToInstance(UserWithPreferencesDto, onboardedUser, { excludeExtraneousValues: true });
    }
}
