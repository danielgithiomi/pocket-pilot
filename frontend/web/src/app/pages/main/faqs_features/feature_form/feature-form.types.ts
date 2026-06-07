import { FeaturePayload } from '@global/types';
import { FeatureCategoryEnum } from '@global/enums';
import { required, schema } from '@angular/forms/signals';

export type FeatureSchema = Omit<FeaturePayload, 'featureCategory'> & {
    featureCategory: FeatureCategoryEnum | '';
};

export const INITAL_FEATURE_STATE: FeatureSchema = {
    featureTitle: '',
    featureContent: '',
    featureCategory: '',
};

export const suggestFeatureSchema = schema<FeatureSchema>((root) => {
    // FEATURE TITLE
    required(root.featureTitle, { message: 'The feature title is required field!' });

    // FEATURE CONTENT
    required(root.featureContent, { message: 'The feature content is required field!' });

    // FEATURE CATEGORY
    required(root.featureCategory, { message: 'The feature category is required field!' });
});
