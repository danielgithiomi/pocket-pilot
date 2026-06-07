import { AuthService } from './auth.service';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ApiServiceError } from './api-error.service';
import { PreferencesMutation } from '@methods/mutations';
import {
    IStandardError,
    IStandardResponse,
    IVoidResourceResponse,
    UpdateUserPreferencesPayload,
} from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class PreferencesService {
    private readonly authService = inject(AuthService);
    private readonly mutation = inject(PreferencesMutation);
    private readonly errorService = inject(ApiServiceError);

    updateUserPreferences(payload: UpdateUserPreferencesPayload) {
        return this.mutation.updateUserPreferences(payload).pipe(
            tap(() => this.authService.patchUserPreferences(payload)),
            map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
            catchError((error: IStandardError) => {
                this.errorService.renderToast(error);
                return EMPTY;
            }),
        );
    }
}
