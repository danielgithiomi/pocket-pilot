import { User } from '@shared/types';
import { concatUrl } from '@core/http';
import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserResource {
    readonly rootResource = httpResource(() => ({
        method: 'GET',
        url: concatUrl()
    }));

    readonly me = httpResource<User>(() => ({
        method: 'GET',
        credentials: 'include',
        url: concatUrl('auth/me')
    }));
}
