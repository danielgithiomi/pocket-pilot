import { formatToReadable } from '@libs/utils';
import { CategoriesMutation } from '@methods/mutations';
import { CategoriesResource } from '@methods/resources';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { ToastService } from '@components/ui/atoms/toast';
import { computed, inject, Injectable } from '@angular/core';
import {
  Categories,
  IEnumResponse,
  IStandardError,
  CategoryVariant,
  IStandardResponse,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  IVoidResourceResponse,
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

  getTransactionCategories = computed<IEnumResponse[]>(() => {
    const data = this.resource.getUserCategories.value()?.data;

    if (!data) return [];

    const { incomes, expenses } = data;
    const allCategories = [
      '---Internal---',
      'Account Transfers',
      '---Incomes---',
      ...incomes,
      '---Expenses---',
      ...expenses,
    ];

    return allCategories.map((category) => ({
      value: category,
      disabled: category.startsWith('---'),
      label: category.startsWith('---') ? category : formatToReadable(category),
    }));
  });

  deleteCategoryByName(
    categoryName: string,
    categoryType: CategoryVariant,
  ): Observable<IVoidResourceResponse> {
    const payload: DeleteCategoryRequest = { categoryName, categoryType };
    return this.mutation.deleteCategory(payload).pipe(
      map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      variant: 'error',
      details: details as string,
    });
  };
}
