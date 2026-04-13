import { Injectable, NotFoundException } from '@nestjs/common';
import { OnboardingPayload } from '../dto/onboarding.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class OnboardingRepository {
    constructor(private readonly db: DatabaseService) {}

    async onboardUser(userId: string, payload: OnboardingPayload) {
        return this.db.$transaction(async prisma => {
            // Fetch new registered user
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user)
                throw new NotFoundException({
                    name: 'USER_NOT_FOUND',
                    title: 'Registered user not found!',
                    details: 'No user found for this ID in the database.',
                });
                
            const { id } = user;   
            const { phoneNumber, defaultCurrency, preferredLanguage, monthlySpendingLimit } = payload;

            // Update user with onboarding data
            await prisma.userPreferences.create({
                data: {
                    userId: id,
                    phoneNumber,
                    defaultCurrency,
                    preferredLanguage,
                    monthlySpendingLimit,
                },
            });

            return user;
        });
    }
}
