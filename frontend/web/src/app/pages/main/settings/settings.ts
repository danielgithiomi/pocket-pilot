import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { CategoryTypeEnum } from '@global/enums';
import { NoData } from '@structural/main/no-data/no-data';
import { CategoriesService } from '@api/categories.service';
import { CategoriesForm } from './categories/categories-form';
import { Component, computed, inject, signal } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { CategoryLength, FormattedCategories } from './settings.types';
import { CategoryVariant, IVoidResourceResponse } from '@global/types';
import { ListFilterPlus, LucideAngularModule, X } from 'lucide-angular';
import { denormalizeCategoryName, normalizeCategoryName } from '@global/utils';

@Component({
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
  imports: [NgClass, FetchError, NoData, Button, LucideAngularModule, CategoriesForm],
})
export class Settings {
  // Icons
  protected readonly X = X;
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);
  private readonly categoriesService = inject(CategoriesService);

  // States
  protected isSubmitting = signal<boolean>(false);
  protected isCategoriesFormOpen = signal<boolean>(false);

  // Data
  protected readonly categoryLength = CategoryLength;
  protected readonly CategoryTypeEnum = CategoryTypeEnum;
  protected categories$ = this.categoriesService.getUserCategories();

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

  // Methods
  protected handleOpenForm() {
    this.isCategoriesFormOpen.set(true);
  }

  protected handleCloseForm() {
    this.isCategoriesFormOpen.set(false);
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

  // Helper Functions
  private denormalizeCategoryNames(categoryNames: string[]): string[] {
    return categoryNames.map((name) => denormalizeCategoryName(name));
  }
}
