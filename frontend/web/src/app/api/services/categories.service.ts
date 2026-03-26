import { computed, inject, Injectable } from '@angular/core';
import { denormalizeCategoryName } from '@libs/utils';
import { CategoriesMutation } from '@methods/mutations';
import { CategoriesResource } from '@methods/resources';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { ToastService } from '@components/ui/atoms/toast';
import {
  Categories,
  IEnumResponse,
  IStandardError,
  IStandardResponse,
  CreateCategoryRequest,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly toastService = inject(ToastService);
  private readonly resource = inject(CategoriesResource);
  private readonly mutation = inject(CategoriesMutation);

  getUserCategories = () => this.resource.getUserCategories;

  createNewCategory(payload: CreateCategoryRequest): Observable<Categories> {
    return this.mutation.createNewCategory(payload).pipe(
      map((response: IStandardResponse<Categories>) => response.data),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  getTransactionCategories(): IEnumResponse[] {
    const incomeCategories = computed(() => this.resource.getUserCategories.value()?.data.incomes || []);
    const expenseCategories = computed(() => this.resource.getUserCategories.value()?.data.expenses || []);

    const allCategories = [...incomeCategories(), ...expenseCategories()];
    const formattedCategories = allCategories.map((category) => ({
      value: category,
      label: denormalizeCategoryName(category),
    }));

    console.log('formattedCategories', formattedCategories);
    return formattedCategories;
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      details: details as string,
      variant: 'error',
    });
  };
}
