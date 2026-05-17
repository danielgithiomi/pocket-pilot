import { required, schema, min } from '@angular/forms/signals';

export type SplitStrategyVariant = 'sole' | 'equal' | 'quantity';

export const SPLIT_STRATEGY_OPTIONS = ['equal', 'sole', 'quantity'] as const;
export type SplitStrategyOption = (typeof SPLIT_STRATEGY_OPTIONS)[number];

export const STRATEGY_MAP: Record<SplitStrategyOption, string> = {
  equal: 'Equal Split',
  sole: 'Consumed By One',
  quantity: 'Quantity Per Person',
};

export interface NewSplittableSchema {
  name: string;
  quantity: string;
  categoryTag: string;
  consumers: string[];
  unitPrice: number | null;
  splitStrategy: SplitStrategyVariant;
}

export const InitialNewSplittableData: NewSplittableSchema = {
  name: '',
  quantity: '1',
  consumers: [],
  categoryTag: '',
  unitPrice: null,
  splitStrategy: 'sole',
};

export const NewSplittableFormValidation = schema<NewSplittableSchema>((root) => {
  // Name
  required(root.name, { message: 'The name is required field!' });

  // Quantity
  required(root.quantity, { message: 'The quantity is required field!' });
  min(root.quantity, 1, { message: 'The quantity must be at least 1 per item' });

  // Category
  required(root.categoryTag, { message: 'The category tag is required field!' });

  // Consumers
  required(root.consumers, { message: 'The consumers are required field!' });

  // Unit Price
  required(root.unitPrice, { message: 'The unit price is required field!' });
  min(root.unitPrice, 1.0, { message: 'The unit price must be at least 1.00' });
});
