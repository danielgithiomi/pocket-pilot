import { SplitStrategyVariant } from '@global/types';

export const PlaceholderSplittableFormState = {
  name: '',
  quantity: '1',
  settled: false,
  unitPrice: null,
  categoryTag: '',
  quantitySplits: [],
  splitStrategy: 'sole' as SplitStrategyVariant,
};
