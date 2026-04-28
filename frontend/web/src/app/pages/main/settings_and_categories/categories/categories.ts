import { NgClass } from '@angular/common';
import { CategoryTypeEnum } from '@global/enums';
import { formatToReadable } from '@libs/utils';
import { LucideAngularModule, X } from 'lucide-angular';
import { DrawerService } from '@infrastructure/services';
import { CategoriesService } from '@api/categories.service';
import { Component, computed, inject, output } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';
import { FetchError } from '@components/structural/main/fetch-error/fetch-error';
import { CategoryLength, FormattedCategories } from '../settings-and-categories.types';

@Component({
  selector: 'categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
  imports: [FetchError, NoData, NgClass, LucideAngularModule],
})
export class Categories {
  // OUTPUTS
  onCategoryDelete = output<{ category: string; type: CategoryTypeEnum }>();

  // ICONS
  protected readonly X = X;
  protected readonly animationDimension: string = '150px';

  // DATA
  protected readonly categoryLength = CategoryLength;
  protected readonly CategoryTypeEnum = CategoryTypeEnum;

  // SERVICES
  protected readonly drawerService = inject(DrawerService);
  private readonly categoriesService = inject(CategoriesService);
  protected readonly categories$ = this.categoriesService.getUserCategories();

  // COMPUTED
  protected readonly isFetchingCategories = computed(() => this.categories$.isLoading());

  // HELPER FUNCTIONS
  protected formatCategoryName(categoryName: string): string {
    return formatToReadable(categoryName);
  }
}
