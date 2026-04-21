import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OnboardingPayload } from '../dto/onboarding.dto';
import { UserWithPreferencesDto } from '../../identity/dto/user.dto';
import { OnboardingRepository } from '../repositories/onboarding.repository';

@Injectable()
export class OnboardingService {
    constructor(private readonly onboardingRepository: OnboardingRepository) {}

    async onboardUser(userId: string, payload: OnboardingPayload) {
        const onboardedUser = await this.onboardingRepository.onboardUser(userId, payload);
        return plainToInstance(UserWithPreferencesDto, onboardedUser, { excludeExtraneousValues: true });
    }
}
