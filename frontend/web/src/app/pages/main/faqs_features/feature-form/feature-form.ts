import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { FeatureCategoryEnum } from '@shared/enums';
import { LucideAngularModule } from 'lucide-angular';
import { Select, SelectOption } from '@atoms/select';
import { Form, FormCloseEvent } from '@organisms/form';
import { Feature, FeaturePayload } from '@shared/types';
import { FeaturesService } from '@api/features.service';
import { TextArea } from '@components/ui/atoms/text-area';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FeatureSchema, INITIAL_FEATURE_FORM_STATE, suggestFeatureSchema } from './feature-form.types';

@Component({
    selector: 'suggest-feature-form',
    templateUrl: 'feature-form.html',
    imports: [LucideAngularModule, Form, Input, Select, TextArea, Button]
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

    // COMPUTED
    protected readonly formattedFeatureCategories = computed<SelectOption[]>(() => {
        const hasError = this.featuresService.hasError();
        if (hasError()) {
            this.toastService.show({
                variant: 'warning',
                title: 'Error Fetching Feature Categories!',
                details: 'There was an error fetching feature categories. Please try again later.'
            });
            return [];
        }

        const categories = this.featuresService.getFeatureCategories();
        return categories().map((category) => {
            const { value, label } = category;

            return {
                value: value,
                label: label === 'Ui Ux' ? 'UI/UX' : label
            };
        });
    });

    // FORM
    protected readonly featureFormModel = signal<FeatureSchema>(INITIAL_FEATURE_FORM_STATE);
    protected readonly featureForm = form(this.featureFormModel, suggestFeatureSchema);

    // METHODS
    handleCloseFeatureForm(source: FormCloseEvent) {
        if (source === 'icon') this.featureForm().reset();
        this.featureFormClosedEvent.emit(false);
    }

    resetFeatureForm() {
        this.featureForm().reset(INITIAL_FEATURE_FORM_STATE);
    }

    // SUBMISSIONS
    handleSuggestFeatureFormSubmit(event: Event) {
        event.preventDefault();

        this.isSubmittingFeatureForm.set(true);

        const payload: FeaturePayload = {
            featureTitle: this.featureForm.featureTitle().value(),
            featureContent: this.featureForm.featureContent().value(),
            featureCategory: this.featureForm.featureCategory().value() as FeatureCategoryEnum
        };

        this.featuresService.createNewFeature(payload).subscribe({
            next: (feature: Feature) => {
                this.toastService.show({
                    variant: 'success',
                    title: 'Feature Suggested Logged!',
                    details: `Your [${feature.featureCategory}] feature has been logged successfully.`
                });

                this.resetFeatureForm();
                this.featureFormClosedEvent.emit(true);
            },
            complete: () => this.isSubmittingFeatureForm.set(false)
        });
    }
}
