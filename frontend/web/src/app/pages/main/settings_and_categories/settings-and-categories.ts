import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { Settings } from './settings/settings';
import { Categories } from './categories/categories';
import { normalizeCategoryName } from '@global/utils';
import { DrawerService } from '@infrastructure/services';
import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '@api/categories.service';
import { CategoryVariant, IVoidResourceResponse } from '@global/types';
import { ListFilterPlus, LucideAngularModule, X } from 'lucide-angular';
import { CategoriesForm } from './categories/categories-form/categories-form';

@Component({
  selector: 'settings_and_categories',
  styleUrl: './settings-and-categories.css',
  templateUrl: './settings-and-categories.html',
  imports: [LucideAngularModule, Settings, Button, Categories, CategoriesForm, NgClass],
})
export class SettingsAndCategories {
  // ICONS
  protected readonly X = X;
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // STATES
  protected isCategoriesFormOpen = signal<boolean>(false);
  protected readonly drawerService = inject(DrawerService);
  private readonly categoriesService = inject(CategoriesService);

  // DATA
  protected categories$ = this.categoriesService.getUserCategories();

  // SERVICES
  private readonly toastService = inject(ToastService);

  // METHODS
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
