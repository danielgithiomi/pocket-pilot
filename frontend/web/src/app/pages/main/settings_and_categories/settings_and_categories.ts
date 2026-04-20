import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { Categories } from './categories/categories';
import { normalizeCategoryName } from '@global/utils';
import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '@api/categories.service';
import { CategoryVariant, IVoidResourceResponse } from '@global/types';
import { ListFilterPlus, LucideAngularModule, X } from 'lucide-angular';
import { CategoriesForm } from './categories/categories-form/categories-form';

@Component({
  selector: 'settings_and_categories',
  styleUrl: './settings_and_categories.css',
  templateUrl: './settings_and_categories.html',
  imports: [Button, LucideAngularModule, CategoriesForm, Categories],
})
export class Settings {
  // Icons
  protected readonly X = X;
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;
  protected readonly animationDimension: string = '150px';
  // States
  protected isSubmitting = signal<boolean>(false);
  protected isCategoriesFormOpen = signal<boolean>(false);
  // Services
  private readonly toastService = inject(ToastService);
  private readonly categoriesService = inject(CategoriesService);
  // Data
  protected categories$ = this.categoriesService.getUserCategories();

  // Methods
  protected handleOpenForm() {
    this.isCategoriesFormOpen.set(true);
  }

  protected handleCloseForm() {
    this.isCategoriesFormOpen.set(false);
  }

  protected deleteCategory(deleteEvent: { category: string; type: CategoryVariant }) {
    const { category, type } = deleteEvent;
    const formattedCategoryName = normalizeCategoryName(category);

    this.categoriesService.deleteCategoryByName(formattedCategoryName, type).subscribe({
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
}
