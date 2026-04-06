import { inject, Injectable } from '@angular/core';
import { GoalsResource } from '@methods/resources';

@Injectable({
    providedIn: 'root'
})
export class GoalsService {

    private readonly goalsResource = inject(GoalsResource);
    
    getGoalCategories = () => this.goalsResource.getGoalCategories;
    
}