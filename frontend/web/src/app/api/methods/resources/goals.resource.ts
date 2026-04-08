import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Goal, IEnumResponse, IStandardResponse } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class GoalsResource {

    getGoalCategories = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
        method: 'GET', 
        url: concatUrl(endpoints.goal_categories),
    }));

    getUserGoals = httpResource<IStandardResponse<Goal[]>>(() => ({
        method: 'GET', 
        url: concatUrl(endpoints.goals),
    }));
    
}