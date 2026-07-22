import { NgClass } from '@angular/common';
import { formatToReadable } from '@libs/utils';
import { CategoryTypeEnum } from '@global/enums';
import { LucideAngularModule, X } from 'lucide-angular';
import { Component, computed, input, output, signal } from '@angular/core';
import { CategoryVariant } from '@global/types';

@Component({
    selector: 'category-item',
    styleUrl: 'category-item.css',
    imports: [LucideAngularModule, NgClass],
    template: `
        <div class="category-item group/item" [ngClass]="categoryVariantClasses()">
            <p>{{ formatCategoryName(categoryName()) }}</p>

            <button
                class="category-icon atom-icon"
                (click)="handleOnCategoryDelete()"
                [ngClass]="{ 'block! opacity-100!': isDeletingCategory() }">
                @if (isDeletingCategory()) {
                    <div class="delete-loader"></div>
                } @else {
                    <lucide-icon [img]="DeleteIcon" [size]="13" name="delete-category" />
                }
            </button>
        </div>
    `
})
export class CategoryItem {
    // ICONS
    protected readonly iconSize = 13;
    protected readonly DeleteIcon = X;

    // INPUTS
    categoryName = input.required<string>();
    variant = input.required<CategoryVariant>();

    // OUTPUTS
    onCategoryDelete = output<CategoryItemOutput>();

    // SIGNAL STATES
    isDeletingCategory = signal<boolean>(false);

    // DATA
    protected readonly CategoryTypeEnum = CategoryTypeEnum;

    // COMPUTED
    protected readonly categoryVariantClasses = computed<string>(() => {
        switch (this.variant()) {
            case 'EXPENSE':
                return 'expense';
            case 'INCOME':
                return 'income';
            default:
                return '';
        }
    });

    // METHODS
    protected handleOnCategoryDelete() {
        this.isDeletingCategory.set(true);

        this.onCategoryDelete.emit({
            categoryVariant: this.variant(),
            categoryName: this.categoryName()
        });
    }

    // FORMATTERS
    protected formatCategoryName(categoryName: string): string {
        return formatToReadable(categoryName);
    }
}

export interface CategoryItemOutput {
    categoryName: string;
    categoryVariant: CategoryVariant;
}
