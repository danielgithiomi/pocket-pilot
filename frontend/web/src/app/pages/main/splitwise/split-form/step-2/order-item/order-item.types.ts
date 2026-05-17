import { SplitStrategyVariant } from '../split-form-step-2.types';

export const PlaceholderSplittableFormState = {
  name: '',
  quantity: '1',
  unitPrice: null,
  categoryTag: '',
  quantitySplits: [],
  splitStrategy: 'sole' as SplitStrategyVariant,
};
