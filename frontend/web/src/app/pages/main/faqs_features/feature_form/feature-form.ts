import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { FeaturePayload } from '@global/types';
import { FeatureCategoryEnum } from '@global/enums';
import { LucideAngularModule } from 'lucide-angular';
import { Select, SelectOption } from "@atoms/select";
import { Form, FormCloseEvent } from '@organisms/form';
import { FeaturesService } from '@api/features.service';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FeatureSchema, INITAL_FEATURE_STATE, suggestFeatureSchema } from './feature-form.types';

@Component({
    selector: 'suggest-feature-form',
    templateUrl: 'feature-form.html',
    imports: [LucideAngularModule, Form, Input, Select],
})
export class SuggestFeatureForm {

    // INPUTS
    isFeatureFormOpen = input.required<boolean>();

    // OUTPUTS
    featureFormClosedEvent = output<boolean>();

    // SIGNAL STATES
    protected readonly isSubmittingFeatureForm = signal<boolean>(false);

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly featuresService = inject(FeaturesService);

    // DATA

    // COMPUTED
    protected readonly formattedFeatureCategories = computed<SelectOption[]>(() => {
        const hasError = this.featuresService.hasError();
        if (hasError()) {
            this.toastService.show({
                variant: 'warning',
                title: 'Error Fetching Feature Categories!',
                details: 'There was an error fetching feature categories. Please try again later.',
            });
            return [];
        }

        const categories = this.featuresService.getFeatureCategories();
        return categories().map((category) => ({
            value: category.value,
            label: category.label,
        }));
    });

    // FORM
    protected readonly featureFormModel = signal<FeatureSchema>(INITAL_FEATURE_STATE);
    protected readonly featureForm = form(this.featureFormModel, suggestFeatureSchema);

    // METHODS
    handleCloseFeatureForm(source: FormCloseEvent) {
        if (source === 'icon') this.featureForm().reset();
        this.featureFormClosedEvent.emit(true);
    }

    // SUBMISSIONS
    handleSuggestFeatureFormSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.isSubmittingFeatureForm.set(true);

        const payload: FeaturePayload = {
            featureTitle: this.featureForm.featureTitle().value(),
            featureContent: this.featureForm.featureContent().value(),
            featureCategory: this.featureForm.featureCategory().value() as FeatureCategoryEnum,
        };

    }
}
