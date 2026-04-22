import { Input } from '@atoms/input';
import { Form } from '@organisms/form';
import { Button } from '@atoms/button';
import { TabList } from '@atoms/tab-list';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { CategoriesService } from '@api/categories.service';
import { Component, inject, input, output, signal } from '@angular/core';
import {
  categoryFormValidationSchema,
  CategorySchema,
  categoryTabItems,
  initialCategoryFormState,
} from './categories-form.types';
import { CategoryVariant } from '@global/types';

@Component({
  selector: 'categories-form',
  templateUrl: './categories-form.html',
  imports: [Form, Input, Button, TabList],
})
export class CategoriesForm {
  // INPUTS
  isCategoriesFormOpen = input.required<boolean>();

  // OUTPUTS
  categoriesFormClosed = output<'icon' | 'overlay'>();

  // SIGNALS
  protected isSubmittingCategoriesForm = signal<boolean>(false);
  // DATA
  protected readonly categoryTabItems = categoryTabItems;
  // FORM
  protected categoryFormModel = signal<CategorySchema>(initialCategoryFormState);
  protected categoryForm = form(this.categoryFormModel, categoryFormValidationSchema);
  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly categories$ = this.categoriesService.getUserCategories();

  // METHODS
  handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetCategoryForm();
    this.categoriesFormClosed.emit(source);
  }

  handleCategoryTypeSelected(index: number) {
    const categoryType = this.categoryTabItems[index].value as CategoryVariant;
    this.categoryForm.categoryType().controlValue.set(categoryType);
  }

  protected resetCategoryForm() {
    this.categoryForm().reset(initialCategoryFormState);
    this.categoryFormModel.set(initialCategoryFormState);
  }

  // SUBMISSIONS
  protected submitCategory(event: Event) {
    event.preventDefault();

    this.isSubmittingCategoriesForm.set(true);

    const { categoryName, categoryType } = this.categoryFormModel();

    this.categoriesService.createNewCategory({ categoryName, categoryType }).subscribe({
      next: () => {
        this.toastService.show({
          variant: 'success',
          title: 'Category created!',
          details: `Your [${categoryType}] category has been created successfully.`,
        });

        this.resetCategoryForm();
        this.categories$.reload();
        this.categoriesFormClosed.emit('icon');
      },
      complete: () => this.isSubmittingCategoriesForm.set(false),
    });
  }
}
