import { Injectable } from '@nestjs/common';
import { UpdatePreferencesPayload } from '../dto/preferences.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class PreferencesRepository {
    constructor(private readonly db: DatabaseService) {}

    async updateUserPreferences(userId: string, payload: UpdatePreferencesPayload) {
        const { preferredTheme, defaultCurrency, monthlySpendingLimit, preferredLanguage } = payload;

        await this.db.userPreferences.update({
            where: { userId },
            data: {
                preferredTheme,
                defaultCurrency,
                preferredLanguage,
                monthlySpendingLimit,
            },
        });
    }
}
