import { GoalCategoryEnum } from '@global/enums';
import { required, schema } from '@angular/forms/signals';

// TYPES
export const TargetCompletionStrategies = ['byDate', 'byAmount'] as const;
export type TargetCompletionStrategy = typeof TargetCompletionStrategies[number];

// FORM
export type NewGoalSchema = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: GoalCategoryEnum | null;
  monthlyContribution: number;
  targetAmount: number;
  targetCompletionStrategy: TargetCompletionStrategy;
};

export const initalNewGoalFormState: NewGoalSchema = {
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  category: null,
  monthlyContribution: 0,
  targetAmount: 0,
  targetCompletionStrategy: 'byDate',
};

export const newGoalFormValidationSchema = schema<NewGoalSchema>((root) => {
  // Name
  required(root.name, { message: 'The goal name is required field!' });

  // Description
  required(root.description, { message: 'The goal description is required field!' });

  // Start Date
  required(root.startDate, { message: 'The goal start date is required field!' });

  // End Date
  required(root.endDate, { message: 'The goal end date is required field!' });

  // Category
  required(root.category, { message: 'The goal category is required field!' });

  // Target Completion Strategy
  required(root.targetCompletionStrategy, {
    message: 'The goal target completion strategy is required field!',
  });

  //   validate(root.targetCompletionStrategy, (context) => {
  //     const strategy = context.value();
  //     if (strategy === 'byAmount') {
  //       if (root.targetAmount == 0) {
  //         return {
  //           kind: 'target-amount-required',
  //           message: 'The goal target amount is required field!',
  //         };
  //       }
  //     }
  //     return null;
  //   });
});
