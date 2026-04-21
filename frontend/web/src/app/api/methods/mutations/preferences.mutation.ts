import { ApiClient } from '../api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IVoidResourceResponse, UpdateUserPreferencesPayload } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class PreferencesMutation {
  private readonly client = inject(ApiClient);

  updateUserPreferences(payload: UpdateUserPreferencesPayload) {
    return this.client.put<IVoidResourceResponse, UpdateUserPreferencesPayload>(
      endpoints.preferences,
      payload,
    );
  }
}
