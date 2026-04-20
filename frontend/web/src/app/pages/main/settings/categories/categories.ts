import { NgClass } from '@angular/common';
import { CategoryTypeEnum } from '@global/enums';
import { denormalizeCategoryName } from '@libs/utils';
import { LucideAngularModule, X } from 'lucide-angular';
import { CategoriesService } from '@api/categories.service';
import { Component, computed, inject, output } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';
import { CategoryLength, FormattedCategories } from '../settings.types';
import { FetchError } from '@components/structural/main/fetch-error/fetch-error';

@Component({
  selector: 'categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
  imports: [FetchError, NoData, NgClass, LucideAngularModule],
})
export class Categories {
  // Outputs
  onCategoryDelete = output<{ category: string; type: CategoryTypeEnum }>();
  // Icons
  protected readonly X = X;
  protected readonly animationDimension: string = '150px';
  // Data
  protected readonly categoryLength = CategoryLength;
  protected readonly CategoryTypeEnum = CategoryTypeEnum;
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
  // Services
  private readonly categoriesService = inject(CategoriesService);
  protected readonly categories$ = this.categoriesService.getUserCategories();

  // Helper Functions
  private denormalizeCategoryNames(categoryNames: string[]): string[] {
    return categoryNames.map((name) => denormalizeCategoryName(name));
  }
}
