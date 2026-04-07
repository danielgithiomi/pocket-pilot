import { Input } from '@atoms/input';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { GoalsService } from '@api/goals.service';
import { RadioOption, Radio } from '@atoms/radio';
import { DrawerService } from '@infrastructure/services';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, Plus, ChevronsRight, ChevronsLeft } from 'lucide-angular';
import {
  NewGoalSchema,
  initalNewGoalFormState,
  TargetCompletionStrategy,
  TargetCompletionStrategies,
  newGoalFormValidationSchema,
} from './goals.types';
import { DatePicker } from '@components/ui/organisms/date-picker';

@Component({
  selector: 'app-goals',
  styleUrl: './goals.css',
  templateUrl: './goals.html',
  imports: [
    NgClass,
    CalendarModule,
    Button,
    LucideAngularModule,
    Radio,
    Form,
    Input,
    Select,
    DatePicker,
  ],
})
export class Goals {
  // Icons
  protected readonly iconSize = 16;
  protected readonly PlusIcon = Plus;
  protected readonly NextIcon = ChevronsRight;
  protected readonly PreviousIcon = ChevronsLeft;

  // Services
  protected readonly toastService = inject(ToastService);
  protected readonly goalsService = inject(GoalsService);
  protected readonly drawerService = inject(DrawerService);

  // Signals
  protected readonly goalFormStep = signal<1 | 2>(1);
  protected readonly isGoalsFormOpen = signal<boolean>(false);
  protected readonly isBillsFormOpen = signal<boolean>(false);
  protected readonly isSubmittingGoalsForm = signal<boolean>(false);
  protected readonly selectedCategory = signal<TargetCompletionStrategy | null>(null);

  // Data
  protected readonly initialNewGoalFormState = initalNewGoalFormState;
  protected readonly goalCategories$ = this.goalsService.getGoalCategories();

  // Computed
  protected readonly goalCreationStrategies = computed<RadioOption[]>(() =>
    TargetCompletionStrategies.map((strategy) => {
      let label: string = '';
      switch (strategy) {
        case 'date':
          label = 'By Completion Date';
          break;
        case 'amount':
          label = 'By Targeted Amount';
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
  protected readonly minDate = signal<Date | null>(new Date());

  // Form
  protected readonly newGoalFormModel = signal<NewGoalSchema>(initalNewGoalFormState);
  protected readonly newGoalForm = form(this.newGoalFormModel, newGoalFormValidationSchema);

  // Methods
  protected resetGoalForm() {
    this.goalFormStep.set(1);
    this.newGoalForm().reset();
    this.selectedCategory.set(null);
    this.newGoalFormModel.set(initalNewGoalFormState);
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
