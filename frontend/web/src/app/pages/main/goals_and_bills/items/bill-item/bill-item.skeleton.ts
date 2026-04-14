import { Component } from '@angular/core';

@Component({
  selector: 'bill-item-skeleton',
  template: `
    <div class="flex flex-row items-center justify-between gap-4 p-4 my-2">
      <div class="skeleton size-13 rounded-full!"></div>

      <div class="flex flex-col flex-1 gap-4">
        <div class="skeleton w-1/4 h-3"></div>
        <div class="skeleton w-2/3 h-3"></div>
      </div>

      <div class="skeleton w-1/8 h-3"></div>
    </div>
  `,
})
export class BillItemSkeleton {}
