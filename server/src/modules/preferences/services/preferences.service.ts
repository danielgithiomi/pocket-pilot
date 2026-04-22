import { ExposeEnumDto } from '@common/types';
import { ApplicationTheme } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { UpdatePreferencesPayload } from '../dto/preferences.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PreferencesRepository } from '../repositories/preferences.repository';

@Injectable()
export class PreferencesService {
    constructor(private readonly preferencesRepository: PreferencesRepository) {}

    async getApplicationThemes(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(ApplicationTheme).map(formatEnumForFrontend));
    }

    updateUserPreferences(userId: string, payload: UpdatePreferencesPayload) {
        const modifiedPayload: UpdatePreferencesPayload = {
            ...payload,
            defaultCurrency: payload.defaultCurrency.toUpperCase(),
            preferredLanguage: payload.preferredLanguage.toLowerCase(),
        };

        try {
            return this.preferencesRepository.updateUserPreferences(userId, modifiedPayload);
        } catch (error: unknown) {
            throw new InternalServerErrorException({
                name: 'USER_PREFERENCES_UPDATE_ERROR',
                title: 'Failed to update user preferences!',
                message: `Failed to update user preferences with error: ${error}`,
                details: 'There was an error updating your preferences. Please try again later.',
            });
        }
    }
}
