import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { GoalsService } from '@api/goals.service';
import { RadioOption, Radio } from '@atoms/radio';
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { Component, computed, inject, signal } from '@angular/core';
import {
  NewGoalSchema,
  initalNewGoalFormState,
  newGoalFormValidationSchema,
  TargetCompletionStrategies,
  TargetCompletionStrategy,
} from './goals.types';

@Component({
  selector: 'app-goals',
  styleUrl: './goals.css',
  templateUrl: './goals.html',
  imports: [NgClass, Button, LucideAngularModule, Radio],
})
export class Goals {
  // [ngClass]="{ 'grid place-items-center': count === 0 || transactions.error() }"

  // Icons
  protected readonly iconSize = 16;
  protected readonly PlusIcon = Plus;

  // Services
  protected readonly toastService = inject(ToastService);
  protected readonly goalsService = inject(GoalsService);
  protected readonly drawerService = inject(DrawerService);

  // Signals
  protected readonly selectedCategory = signal<TargetCompletionStrategy | null>(null);

  // Data
  protected readonly goalCategories$ = this.goalsService.getGoalCategories();

  // Computed
  protected readonly goalCreationStrategies = computed<RadioOption[]>(() =>
    TargetCompletionStrategies.map((strategy) => ({
      value: strategy,
      label: `By ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}`,
    })),
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
        value: value,
        label: label,
        disabled: false,
      };
    });
  });

  // Form
  protected readonly newGoalFormModel = signal<NewGoalSchema>(initalNewGoalFormState);
  protected readonly newGoalForm = form(this.newGoalFormModel, newGoalFormValidationSchema);

  // Methods
  protected onCategoryChange(category: string) {
    if (!category || !TargetCompletionStrategies.includes(category as TargetCompletionStrategy)) {
      this.selectedCategory.set(null);
      console.log('Invalid category');
      return;
    }
    const strategy = category as TargetCompletionStrategy;
    this.selectedCategory.set(strategy);
  }
}
