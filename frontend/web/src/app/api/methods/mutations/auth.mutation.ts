import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { LoginPayload, User } from '@shared/types';
import { API_ENDPOINTS as endpoints } from '@shared/constants';

@Injectable({
    providedIn: 'root'
})
export class AuthMutation {
    private readonly client = inject(ApiClient);

    login(request: LoginPayload) {
        return this.client.post<User, LoginPayload>(endpoints.login, request);
    }

    logout() {
        return this.client.post<{ message: string }, void>(endpoints.logout, undefined);
    }
}
