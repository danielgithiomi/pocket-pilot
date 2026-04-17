import { Component } from '@angular/core';

@Component({
  selector: 'goal-item-skeleton',
  template: `
    <div class="flex flex-row gap-4 items-center my-6 pb-2">
      <div class="skeleton size-14 rounded-lg"></div>

      <div class="flex flex-col gap-2 w-full">
        <div class="flex flex-row items-center justify-between">
          <div class="skeleton h-4 w-32"></div>
          <div class="skeleton h-4 w-12"></div>
        </div>

        <div class="flex flex-row items-center justify-between">
          <div class="skeleton h-3 w-1/2"></div>
          <div class="skeleton h-3 w-1/3"></div>
        </div>

        <div class="skeleton h-6 w-full bg-base-300 rounded-full"></div>

        <div class="flex flex-row items-center justify-between">
          <div class="skeleton h-3 w-1/3"></div>
        </div>
      </div>
    </div>
  `,
})
export class GoalItemSkeleton {}
