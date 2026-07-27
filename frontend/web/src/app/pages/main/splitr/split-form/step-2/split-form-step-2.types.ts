import { LocalQuantitySplit } from '@global/types';
import { SplitStrategyVariant } from '@global/types';
import { required, schema, min } from '@angular/forms/signals';

export interface NewSplittableSchema {
    name: string;
    quantity: string;
    unitPrice: number | null;
    splitStrategy: SplitStrategyVariant;
    quantitySplits: LocalQuantitySplit[];
}

export const InitialNewSplittableData: NewSplittableSchema = {
    name: '',
    quantity: '1',
    unitPrice: null,
    quantitySplits: [],
    splitStrategy: 'SOLE' as SplitStrategyVariant
};

export const NewSplittableFormValidation = schema<NewSplittableSchema>((root) => {
    // Name
    required(root.name, { message: 'The name is required field!' });

    // Quantity
    required(root.quantity, { message: 'The quantity is required field!' });
    min(root.quantity, 1, { message: 'The quantity must be at least 1 per item' });

    // Consumers
    required(root.quantitySplits, { message: 'The consumers are required field!' });

    // Unit Price
    required(root.unitPrice, { message: 'The unit price is required field!' });
    min(root.unitPrice, 1.0, { message: 'The unit price must be at least 1.00' });
});
