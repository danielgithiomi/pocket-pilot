import { inject, Injectable } from '@angular/core';
import { BillsResource } from '@methods/resources';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private readonly resource = inject(BillsResource);

  getBillTypes = () => this.resource.getBillTypes;
}
