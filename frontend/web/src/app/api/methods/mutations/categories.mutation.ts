import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
  Categories,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  IVoidResourceResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class CategoriesMutation {
  private readonly client = inject(ApiClient);

  createNewCategory(payload: CreateCategoryRequest) {
    return this.client.post<Categories, CreateCategoryRequest>(endpoints.categories, payload);
  }

  deleteCategory(payload: DeleteCategoryRequest) {
    return this.client.deleteWithBody<IVoidResourceResponse, DeleteCategoryRequest>(
      endpoints.categories,
      payload,
    );
  }
}
