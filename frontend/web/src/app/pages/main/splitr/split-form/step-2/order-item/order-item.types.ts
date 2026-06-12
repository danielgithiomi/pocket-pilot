import { SplitStrategyVariant } from '@global/types';

export const PlaceholderSplittableFormState = {
    name: '',
    quantity: '1',
    unitPrice: null,
    categoryTag: '',
    quantitySplits: [],
    splitStrategy: 'sole' as SplitStrategyVariant
};
