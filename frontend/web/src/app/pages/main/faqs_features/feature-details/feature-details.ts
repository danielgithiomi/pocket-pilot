import { Modal } from '@atoms/modal';
import { Feature } from '@global/types';
import { Component, computed, input } from '@angular/core';

@Component({
    imports: [Modal],
    selector: 'feature-details',
    styleUrl: './feature-details.css',
    templateUrl: './feature-details.html'
})
export class FeatureDetails {
    // INPUT
    feature = input.required<Feature>();

    // COMPUTED
    featureId = computed<string>(() => `feature-${this.feature().id}`);
}
