import { Modal } from '@atoms/modal';
import { Feature } from '@global/types';
import { Component, computed, input, output } from '@angular/core';

@Component({
    imports: [Modal],
    selector: 'feature-details',
    styleUrl: './feature-details.css',
    templateUrl: './feature-details.html'
})
export class FeatureDetails {
    // INPUT
    feature = input.required<Feature>();
    onBackdropClickClose = input.required<boolean>();

    // OUTPUTS
    onFeatureModalCloseEvent = output<void>();

    // COMPUTED
    featureId = computed<string>(() => `feature-${this.feature().id}`);
}
