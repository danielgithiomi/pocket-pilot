import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { TabList } from '@atoms/tab-list';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { CategoryVariant } from '@global/types';
import { CategoriesService } from '@api/categories.service';
import { Component, computed, inject, signal } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';
import { LucideAngularModule, ListFilterPlus, X } from 'lucide-angular';
import { denormalizeCategoryName, normalizeCategoryName } from '@global/utils';
import { FetchError } from '@components/structural/main/fetch-error/fetch-error';
import {
  CategorySchema,
  categoryTabItems,
  FormattedCategories,
  initialCategoryFormState,
  categoryFormValidationSchema,
} from './categories.types';

@Component({
  selector: 'app-categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
  imports: [NgClass, Button, LucideAngularModule, Form, Input, TabList, FetchError, NoData],
})
export class Categories {
  // Icons
  protected readonly X = X;
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);
  private readonly categoriesService = inject(CategoriesService);

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  // Data
  protected readonly categoryTabItems = categoryTabItems;
  protected categories$ = this.categoriesService.getUserCategories();

  // Computed
  protected readonly isFetchingCategories = computed(() => this.categories$.isLoading());
  protected readonly formattedCategories = computed<FormattedCategories>(() => {
    const response = this.categoriesService.getUserCategories();
    const { incomes, expenses } = response.value()?.data!;
    return {
      incomes: this.denormalizeCategoryNames(incomes),
      expenses: this.denormalizeCategoryNames(expenses),
    };
  });

  // Form
  protected categoryFormModel = signal<CategorySchema>(initialCategoryFormState);
  protected categoryForm = form(this.categoryFormModel, categoryFormValidationSchema);

  // Constructor
  constructor() {
    const defaultCategoryType = this.categoryTabItems[0].value as CategoryVariant;
    this.categoryFormModel.update((state) => ({
      ...state,
      categoryType: defaultCategoryType,
    }));
  }

  // Methods
  protected handleOpenForm() {
    this.isFormOpen.set(true);
  }

  protected handleCloseForm() {
    this.isFormOpen.set(false);
  }

  protected deleteCategory(categoryName: string) {
    const formattedCategoryName = normalizeCategoryName(categoryName);
    console.log('Deleting category:', formattedCategoryName);
  }

  protected handleCategoryTypeSelected(index: number) {
    this.categoryFormModel.update((state) => ({
      ...state,
      categoryType: this.categoryTabItems[index].value as CategoryVariant,
    }));
  }

  protected resetCategoryForm() {
    this.categoryForm().reset();
    this.categoryFormModel.set(initialCategoryFormState);
  }

  protected submitCategory(event: Event) {
    event.preventDefault();

    this.isSubmitting.set(true);

    const { categoryName, categoryType } = this.categoryFormModel();

    setTimeout(() => {
      this.categoriesService.createNewCategory({ categoryName, categoryType }).subscribe({
        next: () => {
          this.toastService.show({
            variant: 'success',
            title: 'Category created!',
            details: `Your [${categoryType.toUpperCase()}] category has been created successfully.`,
          });

          this.resetCategoryForm();
          this.isFormOpen.set(false);
          this.categories$.reload();
        },
        complete: () => this.isSubmitting.set(false),
      });
    }, 2000);
  }

  // Helper Functions
  private denormalizeCategoryNames(categoryNames: string[]): string[] {
    return categoryNames.map((name) => denormalizeCategoryName(name));
  }
}
