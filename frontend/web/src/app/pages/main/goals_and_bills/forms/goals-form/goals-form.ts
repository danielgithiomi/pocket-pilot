import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { Form } from '@organisms/form';
import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { GoalCategoryEnum } from '@global/enums';
import { CreateGoalRequest } from '@global/types';
import { GoalsService } from '@api/goals.service';
import { Radio, RadioOption } from '@atoms/radio';
import { DatePicker } from '@organisms/date-picker';
import { AccountsService } from '@api/accounts.service';
import { LucideAngularModule, ChevronsRight, ChevronsLeft } from 'lucide-angular';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { addOneMonthFromDate, getMonthDifference, addMonths, formatCurrency } from '@libs/utils';
import {
  NewGoalSchema,
  EffectResponse,
  TargetCompletionStrategy,
  TargetCompletionStrategies,
  newGoalFormValidationSchema,
} from './goals-form.types';
import { CURRENCIES } from '@global/constants';

@Component({
  selector: 'goals-form',
  templateUrl: './goals-form.html',
  imports: [DatePicker, Input, Radio, Form, Select, Button, LucideAngularModule],
})
export class GoalsForm {
  // Icons
  protected readonly iconSize = 16;
  protected readonly NextIcon = ChevronsRight;
  protected readonly PreviousIcon = ChevronsLeft;

  // Inputs
  isGoalsFormOpen = input.required<boolean>();

  // Outputs
  onGoalsFormClose = output<void>();

  // Signals
  protected readonly goalFormStep = signal<1 | 2>(1);
  protected readonly summary = signal<EffectResponse | null>(null);
  protected readonly isSubmittingGoalsForm = signal<boolean>(false);
  protected readonly selectedCategory = signal<TargetCompletionStrategy | null>(null);

  // Calendar
  protected readonly minStartDate = signal<Date>(new Date());
  protected readonly minEndDate = signal<Date>(addOneMonthFromDate(new Date()));

  // Services
  protected readonly goalsService = inject(GoalsService);
  protected readonly toastService = inject(ToastService);
  protected readonly accountsService = inject(AccountsService);

  // Data
  protected readonly currencies = CURRENCIES;
  protected readonly goals$ = this.goalsService.getUserGoals();
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly goalCategories$ = this.goalsService.getGoalCategories();

  // Form
  private readonly INITIAL_FORM_STATE: NewGoalSchema = {
    // Step 1
    startDate: new Date(),
    targetCompletionStrategy: null,

    // Step 2
    name: '',
    category: '',
    description: '',
    targetAmount: null,
    currency: this.currency,
    monthlyContribution: null,
    endDate: addOneMonthFromDate(new Date()),
  };
  protected readonly newGoalFormModel = signal<NewGoalSchema>(this.INITIAL_FORM_STATE);
  protected readonly newGoalForm = form(this.newGoalFormModel, newGoalFormValidationSchema);

  // Constructor & Effects
  constructor() {
    effect(() => {
      const endDate = this.newGoalForm.endDate().value();
      const startDate = this.newGoalForm.startDate().value();
      const targetAmount = this.newGoalForm.targetAmount().value();
      const monthlyContribution = this.newGoalForm.monthlyContribution().value();

      if (!targetAmount) {
        this.summary.set(null);
        return;
      }

      const category = this.selectedCategory();
      switch (category) {
        // Strategy: BY DATE -> Calculate monthly contribution
        case 'date': {
          if (!endDate) return;

          const monthDifference = getMonthDifference(startDate, endDate);

          const calculatedMonthlyContribution = targetAmount / monthDifference;
          const ceiledValue = Math.ceil(calculatedMonthlyContribution);

          this.newGoalForm.monthlyContribution().controlValue.set(ceiledValue);

          this.summary.set({
            ceiledValue,
            rawValue: calculatedMonthlyContribution,
          });

          return;
        }
        // Strategy: BY AMOUNT -> Calculate how many months to save
        case 'amount': {
          if (!monthlyContribution || monthlyContribution <= 0) return;

          const monthsToSave = targetAmount / monthlyContribution;
          const ceiledValue = Math.ceil(monthsToSave);

          const calculatedEndDate = addMonths(startDate, ceiledValue);

          if (calculatedEndDate.getTime() !== endDate.getTime())
            this.newGoalForm.endDate().controlValue.set(calculatedEndDate);

          this.summary.set({
            rawValue: monthsToSave,
            ceiledValue,
          });

          return;
        }
        default:
          return null;
      }
    });
  }

  // Computed
  protected readonly formattedGoalSummaryValue = computed<string | null>(() => {
    const summary = this.summary();
    const strategy = this.selectedCategory();
    if (!summary) return 'N/A';

    const { rawValue, ceiledValue } = summary;
    switch (strategy) {
      case 'date': {
        const formattedRawValue = formatCurrency(rawValue, this.currency, 2, false);
        const formattedCeiledValue = formatCurrency(ceiledValue, this.currency, 0, true);

        if (rawValue !== ceiledValue) return `≈${formattedCeiledValue} (${formattedRawValue})`;
        return formattedCeiledValue;
      }
      case 'amount': {
        return ``;
      }
      default:
        return null;
    }
  });

  protected readonly goalCreationStrategies = computed<RadioOption[]>(() =>
    TargetCompletionStrategies.map((strategy) => {
      let label: string = '';
      switch (strategy) {
        case 'date':
          label = 'By Completion Date';
          break;
        case 'amount':
          label = 'By Monthly Contribution';
          break;
      }

      return {
        label,
        value: strategy,
      };
    }),
  );

  protected readonly formattedGoalCategories = computed<RadioOption[]>(() => {
    if (!!this.goalCategories$.error()) {
      this.toastService.show({
        variant: 'warning',
        title: 'Error Fetching Goal Categories!',
        details: 'There was an error fetching goal categories. Please try again later.',
      });
      return [];
    }

    const categories = this.goalCategories$.value()?.data;
    if (!categories) return [];

    return categories.map((category) => {
      const { value, label } = category;

      return {
        value,
        label,
        disabled: false,
      };
    });
  });

  // Methods
  protected resetGoalForm() {
    this.summary.set(null);
    this.goalFormStep.set(1);
    this.newGoalForm().reset();
    this.selectedCategory.set(null);
    this.newGoalFormModel.set(this.INITIAL_FORM_STATE);
  }

  protected resetCalculatedFields() {
    const today = new Date();
    const endDate = this.newGoalForm.endDate();
    const targetAmount = this.newGoalForm.targetAmount();
    const monthlyContribution = this.newGoalForm.monthlyContribution();

    targetAmount.reset();
    targetAmount.controlValue.set(null);

    monthlyContribution.reset();
    monthlyContribution.controlValue.set(null);

    endDate.reset();
    endDate.controlValue.set(addOneMonthFromDate(today));
  }

  protected onNextStep() {
    this.goalFormStep.set(2);
  }

  protected onPreviousStep() {
    this.summary.set(null);
    this.goalFormStep.set(1);
    this.resetCalculatedFields();
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetGoalForm();
    this.onGoalsFormClose.emit();
  }

  protected onCategoryChange(category: string) {
    const strategy = category as TargetCompletionStrategy;
    this.selectedCategory.set(strategy);
    this.newGoalForm.targetCompletionStrategy().controlValue.set(strategy);
  }

  // Submissions
  protected submitGoalForm(event: Event) {
    event.preventDefault();

    this.isSubmittingGoalsForm.set(true);

    const { targetCompletionStrategy, ...formData } = this.newGoalFormModel();

    const payload: CreateGoalRequest = {
      ...formData,
      targetAmount: formData.targetAmount!,
      category: formData.category as GoalCategoryEnum,
      monthlyContribution: formData.monthlyContribution!,
    };

    setTimeout(() => {
      this.goalsService.createNewGoal(payload).subscribe({
        next: () => {
          this.toastService.show({
            variant: 'success',
            title: 'Goal created!',
            details: 'Your financial goal has been created successfully.',
          });

          this.goals$.reload();
          this.resetGoalForm();
          this.onGoalsFormClose.emit();
        },
        complete: () => {
          this.resetGoalForm();
          this.isSubmittingGoalsForm.set(false);
        },
      });
    }, 1000);
  }
}
