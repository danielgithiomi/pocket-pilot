import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { User, OnboardingPayload } from '@global/types';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class OnboardingMutation {
  private readonly client = inject(ApiClient);

  onboardUser(payload: OnboardingPayload) {
    return this.client.post<User, OnboardingPayload>(endpoints.onboarding, payload);
  }
}
