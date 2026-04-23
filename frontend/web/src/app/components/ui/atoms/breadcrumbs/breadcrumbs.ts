import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbInput } from './breadcrumb.types';
import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, ChevronRight, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'breadcrumbs',
  imports: [RouterLink, NgClass, LucideAngularModule],
  template: `
    <div aria-label="navigation-breadcrumb" class="flex my-2 flex-row items-center gap-1">
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
            class="text-sm italic text-muted-text"
            [ngClass]="{ 'text-primary underline underline-offset-1': isLast }"
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
    </div>
  `,
})
export class Breadcrumbs {
  // ICONS
  protected readonly breadcrumbArrow = ChevronRight;

  // INPUT
  readonly iconSide: number = 18;
  readonly icon = input.required<LucideIconData>();
  readonly breadcrumbItems = input.required<BreadcrumbInput[]>();

  // COMPUTED
  protected breadcrumbsItems = computed(() => {
    const items = this.breadcrumbItems();
    return items.map((item, index) => ({
      ...item,
      id: index,
      isLast: index === items.length - 1,
    }));
  });
}
