import { Injectable } from '@nestjs/common';
import { ExposeEnumDto } from '@common/types';
import { ApplicationTheme } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { UpdatePreferencesPayload } from '../dto/preferences.dto';

@Injectable()
export class PreferencesService {
    async getApplicationThemes(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(ApplicationTheme).map(formatEnumForFrontend));
    }

    updateApplicationPreferences(payload: UpdatePreferencesPayload) {
        // TODO: Implement update application preferences logic
        console.log(payload);
    }
}
