import { Injectable } from '@nestjs/common';
import { ExposeEnumDto } from '@common/types';
import { ApplicationTheme } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';

@Injectable()
export class PreferencesService {
    async getApplicationThemes(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(ApplicationTheme).map(formatEnumForFrontend));
    }
}
