import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { formatToReadable } from '@libs/utils';
import { BreadcrumbInput } from './breadcrumb.types';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, ChevronRight, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'breadcrumbs',
  imports: [RouterLink, NgClass, LucideAngularModule],
  template: `
    <div aria-label="navigation-breadcrumb" class="flex flex-row items-center gap-2">
      @if (isLoading()) {
        <div class="skeleton size-5 rounded-full"></div>
        <div class="skeleton w-2/5 md:w-1/5 h-4"></div>
      } @else {
        <lucide-angular
          [img]="icon()"
          [size]="iconSide"
          name="breadcrumb-icon"
          class="text-muted-text mr-1"
        />

        @for (breadcrumb of breadcrumbsItems(); track breadcrumb.label) {
          @let isLast = breadcrumb.isLast;
          <div>
            <a
              [routerLink]="breadcrumb.route"
              [ngClass]="{ 'text-primary': isLast }"
              class="text-sm italic text-muted-text hover:underline underline-offset-1"
            >
              {{ breadcrumb.label }}
            </a>
          </div>

          @if (!isLast) {
            <lucide-angular
              [size]="iconSide"
              class="text-muted-text"
              [img]="breadcrumbArrow"
              name="breadcrumb-arrow-next"
            />
          }
        }
      }
    </div>
  `,
})
export class Breadcrumbs {
  // ICONS
  protected readonly breadcrumbArrow = ChevronRight;

  // INPUT
  readonly iconSide: number = 17;
  readonly isLoading = input.required<boolean>();
  readonly icon = input.required<LucideIconData>();
  readonly breadcrumbItems = input.required<BreadcrumbInput[]>();

  // COMPUTED
  protected breadcrumbsItems = computed(() => {
    const items = this.breadcrumbItems();
    return items.map((item, index) => ({
      ...item,
      id: index,
      isLast: index === items.length - 1,
      label: formatToReadable(item.label),
    }));
  });
}
