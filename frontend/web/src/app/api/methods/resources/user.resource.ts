import { inject } from "@angular/core";
import { ApiClient } from "../api-client";
import { httpResource } from "@angular/common/http";

const apiClient = inject(ApiClient);

export const UserResource = {
    
    me() {
        return apiClient.get('/user/me');
    },

    root() {
        return httpResource(() => ({
            url: '',
            method: 'GET',
        }));
    }
};
