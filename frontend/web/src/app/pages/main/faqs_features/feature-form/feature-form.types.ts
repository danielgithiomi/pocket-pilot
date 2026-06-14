import { FeaturePayload } from '@global/types';
import { FeatureCategoryEnum } from '@global/enums';
import { minLength, required, schema } from '@angular/forms/signals';

export type FeatureSchema = Omit<FeaturePayload, 'featureCategory'> & {
    featureCategory: FeatureCategoryEnum | '';
};

export const INITAL_FEATURE_STATE: FeatureSchema = {
    featureTitle: '',
    featureContent: '',
    featureCategory: ''
};

export const suggestFeatureSchema = schema<FeatureSchema>(root => {
    // FEATURE TITLE
    required(root.featureTitle, { message: 'The feature title is required field!' });
    minLength(root.featureTitle, 10, {
        message: 'The feature title must be at least 10 characters long!'
    });

    // FEATURE CONTENT
    required(root.featureContent, { message: 'The feature content is required field!' });
    minLength(root.featureContent, 20, {
        message: 'The feature content must be at least 20 characters long!'
    });

    // FEATURE CATEGORY
    required(root.featureCategory, { message: 'The feature category is required field!' });
});
