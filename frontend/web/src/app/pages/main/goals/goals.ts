import { Input } from '@atoms/input';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { GoalsService } from '@api/goals.service';
import { RadioOption, Radio } from '@atoms/radio';
import { DatePicker } from '@organisms/date-picker';
import { DrawerService } from '@infrastructure/services';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { addMonths, addOneMonthFromDate, formatCurrency, getMonthDifference } from '@libs/utils';
import { LucideAngularModule, Plus, ChevronsRight, ChevronsLeft } from 'lucide-angular';
import {
  NewGoalSchema,
  EffectResponse,
  initalNewGoalFormState,
  TargetCompletionStrategy,
  TargetCompletionStrategies,
  newGoalFormValidationSchema,
} from './goals.types';
import { AccountsService } from '@api/accounts.service';

@Component({
  selector: 'app-goals',
  styleUrl: './goals.css',
  templateUrl: './goals.html',
  imports: [
    Form,
    Radio,
    Input,
    Select,
    Button,
    NgClass,
    DatePicker,
    CalendarModule,
    LucideAngularModule,
  ],
})
export class Goals {
  constructor() {
    effect(() => {
      const endDate = this.newGoalForm.endDate().value();
      const startDate = this.newGoalForm.startDate().value();
      const totalAmount = this.newGoalForm.targetAmount().value();
      const monthlyContribution = this.newGoalForm.monthlyContribution().value();

      if (!totalAmount) return;

      const category = this.selectedCategory();
      switch (category) {
        case 'date': {
          // Strategy: BY DATE -> Calculate monthly contribution
          if (!endDate) {
            console.log('No end date');
            return;
          }

          const monthDifference = getMonthDifference(startDate, endDate);

          const calculatedMonthlyContribution = totalAmount / monthDifference;
          const ceiledValue = Math.ceil(calculatedMonthlyContribution);

          // Update form with calculated value
          this.newGoalForm.monthlyContribution().controlValue.set(ceiledValue);
          this.showSummary.set(true);

          this.summary.set({
            ceiledValue,
            rawValue: calculatedMonthlyContribution,
          });
          return;
        }
        case 'amount': {
          // Strategy: BY AMOUNT -> Calculate how many months to save
          if (!monthlyContribution || monthlyContribution <= 0) {
            console.log('No monthly contribution or invalid value');
            return;
          }

          const monthsToSave = totalAmount / monthlyContribution;
          const ceiledValue = Math.ceil(monthsToSave);

          console.log('monthsToSave', monthsToSave);
          console.log('ceiledValue', ceiledValue);

          const calculatedEndDate = addMonths(startDate, ceiledValue);
          console.log('calculatedEndDate', calculatedEndDate);

          // Update form with calculated value
          // this.newGoalForm.endDate().controlValue.set(calculatedEndDate);

          this.showSummary.set(true);
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
  // Icons
  protected readonly iconSize = 16;
  protected readonly PlusIcon = Plus;
  protected readonly NextIcon = ChevronsRight;
  protected readonly PreviousIcon = ChevronsLeft;

  // Services
  protected readonly toastService = inject(ToastService);
  protected readonly goalsService = inject(GoalsService);
  protected readonly drawerService = inject(DrawerService);
  protected readonly accountsService = inject(AccountsService);

  // Signals
  protected readonly goalFormStep = signal<1 | 2>(1);
  protected readonly showSummary = signal<boolean>(false);
  protected readonly isGoalsFormOpen = signal<boolean>(false);
  protected readonly isBillsFormOpen = signal<boolean>(false);
  protected readonly summary = signal<EffectResponse | null>(null);
  protected readonly isSubmittingGoalsForm = signal<boolean>(false);
  protected readonly selectedCategory = signal<TargetCompletionStrategy | null>(null);

  // Data
  protected readonly initialNewGoalFormState = initalNewGoalFormState;
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly goalCategories$ = this.goalsService.getGoalCategories();

  // Computed
  protected readonly formattedGoalSummaryValue = computed<string | null>(() => {
    const summary = this.summary();
    const strategy = this.selectedCategory();
    if (!summary) return null;

    const { rawValue, ceiledValue } = summary;
    switch (strategy) {
      case 'date': {
        const formattedCeiledValue = formatCurrency(ceiledValue, this.currency, 0, true);
        const formattedRawValue = formatCurrency(rawValue, this.currency, 2, false);

        if (rawValue !== ceiledValue) {
          return `≈${formattedCeiledValue} (${formattedRawValue})`;
        }
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
    if (this.goalCategories$.error()) {
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

  // Calendar
  protected readonly minStartDate = signal<Date>(new Date());
  protected readonly minEndDate = signal<Date>(addOneMonthFromDate(new Date()));

  // Form
  protected readonly newGoalFormModel = signal<NewGoalSchema>(initalNewGoalFormState);
  protected readonly newGoalForm = form(this.newGoalFormModel, newGoalFormValidationSchema);

  // Methods
  protected resetGoalForm() {
    this.goalFormStep.set(1);
    this.selectedCategory.set(null);
    this.newGoalForm().reset(this.newGoalFormModel());
    this.newGoalFormModel.set(initalNewGoalFormState);
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
    this.goalFormStep.set(1);
    this.showSummary.set(false);
    this.resetCalculatedFields();
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetGoalForm();
    this.isGoalsFormOpen.set(false);
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

    setTimeout(() => {
      this.isSubmittingGoalsForm.set(false);
    }, 1000);
  }
}
