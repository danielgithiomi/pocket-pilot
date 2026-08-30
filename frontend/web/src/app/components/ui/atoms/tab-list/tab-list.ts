import { NgClass } from '@angular/common';
import { TabChangeEventOutput, TabListItem, TabSize } from './tab-list.types';
import { Component, computed, effect, input, output, signal } from '@angular/core';

@Component({
    imports: [NgClass],
    selector: 'atom-tab-list',
    styleUrl: './tab-list.css',
    templateUrl: './tab-list.html'
})
export class TabList {
    /* INPUTS */
    size = input<TabSize>('md');
    className = input<string>('');
    activeItem = input<number>(0);
    disabled = input<boolean>(false);
    items = input.required<TabListItem[]>();
    wrapperClassName = input<string>('');

    /* OUTPUTS */
    selectedValue = output<string>();
    selectedIndex = output<number>();
    selectedIndexValue = output<TabChangeEventOutput>();

    /* STATE */
    protected activeTab = signal<string>('');

    /* COMPUTED */
    protected activeTabItem = computed(() => {
        const index = this.activeItem();
        const items = this.items();

        // Get the item at the specified index, fall back to first item if invalid
        return items[index] || items[0] || null;
    });

    /* EFFECTS */
    constructor() {
        effect(() => {
            const activeItem = this.activeTabItem();
            if (activeItem && this.activeTab() !== activeItem.value) {
                this.activeTab.set(activeItem.value);
            }
        });
    }

    /* METHODS */
    selectTab({ value }: TabListItem, index: number) {
        if (this.disabled()) return;

        this.activeTab.set(value);
        this.selectedIndex.emit(index);
        this.selectedValue.emit(value);
        this.selectedIndexValue.emit({ index, value });
    }

    isActive(item: TabListItem): boolean {
        return this.activeTab() === item.value;
    }

    getTabClasses(item: TabListItem): string {
        const baseClasses = 'tab-item cursor-pointer transition-all duration-200';
        const sizeClasses = this.getSizeClasses();
        const stateClasses = this.getStateClasses(item);

        return [baseClasses, sizeClasses, stateClasses, this.className()].filter(Boolean).join(' ');
    }

    private getSizeClasses(): string {
        switch (this.size()) {
            case 'sm':
                return 'px-3 py-1 text-xs';
            case 'lg':
                return 'px-5 py-3 text-base';
            default:
                return 'px-4 py-2 text-sm';
        }
    }

    private getStateClasses(item: TabListItem): string {
        if (this.disabled()) {
            return 'opacity-50 cursor-not-allowed!';
        }

        if (this.isActive(item)) {
            return 'bg-(--primary)/75 text-white!';
        }

        return 'hover:bg-(--muted-text)/25';
    }
}
