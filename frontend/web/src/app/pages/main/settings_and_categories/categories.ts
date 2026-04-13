import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { TabList } from '@atoms/tab-list';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { CategoryTypeEnum } from '@global/enums';
import { NoData } from '@structural/main/no-data/no-data';
import { CategoriesService } from '@api/categories.service';
import { Component, computed, inject, signal } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { CategoryVariant, IVoidResourceResponse } from '@global/types';
import { LucideAngularModule, ListFilterPlus, X } from 'lucide-angular';
import { denormalizeCategoryName, normalizeCategoryName } from '@global/utils';
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
  protected readonly CategoryTypeEnum = CategoryTypeEnum;
  protected readonly categoryTabItems = categoryTabItems;
  protected categories$ = this.categoriesService.getUserCategories();
  protected readonly categoryLength = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Computed
  protected readonly isFetchingCategories = computed(() => this.categories$.isLoading());
  protected readonly formattedCategories = computed<FormattedCategories>(() => {
    const response = this.categories$;
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

  protected deleteCategory(categoryName: string, categoryType: CategoryVariant) {
    const formattedCategoryName = normalizeCategoryName(categoryName);

    this.categoriesService.deleteCategoryByName(formattedCategoryName, categoryType).subscribe({
      next: (response: IVoidResourceResponse) => {
        const { message, details } = response;
        this.toastService.show({
          details,
          title: message,
          variant: 'success',
        });
        this.categories$.reload();
      },
    });
  }

  protected handleCategoryTypeSelected(index: number) {
    this.categoryForm
      .categoryType()
      .controlValue.set(this.categoryTabItems[index].value as CategoryVariant);
  }

  protected resetCategoryForm() {
    this.categoryForm().reset(initialCategoryFormState);
    this.categoryFormModel.set(initialCategoryFormState);
  }

  protected submitCategory(event: Event) {
    event.preventDefault();

    this.isSubmitting.set(true);

    const { categoryName, categoryType } = this.categoryFormModel();

    this.categoriesService.createNewCategory({ categoryName, categoryType }).subscribe({
      next: () => {
        this.toastService.show({
          variant: 'success',
          title: 'Category created!',
          details: `Your [${categoryType}] category has been created successfully.`,
        });

        this.resetCategoryForm();
        this.isFormOpen.set(false);
        this.categories$.reload();
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  // Helper Functions
  private denormalizeCategoryNames(categoryNames: string[]): string[] {
    return categoryNames.map((name) => denormalizeCategoryName(name));
  }
}
