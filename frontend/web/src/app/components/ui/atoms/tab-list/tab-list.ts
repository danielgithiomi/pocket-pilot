import { TabListItem, TabSize } from './tab-list.types';
import { Component, input, output, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'atom-tab-list',
  styleUrl: './tab-list.css',
  templateUrl: './tab-list.html',
})
export class TabList {
  /* INPUTS */
  items = input.required<TabListItem[]>();
  size = input<TabSize>('md');
  disabled = input<boolean>(false);
  className = input<string>('');
  activeItem = input<number>(0);

  /* OUTPUTS */
  selectedValue = output<string>();
  selectedIndex = output<number>();

  /* STATE */
  protected activeTab = signal<string>('');

  /* COMPUTED */
  protected activeTabItem = computed(() => {
    const index = this.activeItem();
    const items = this.items();

    // Get the item at the specified index, fallback to first item if invalid
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
  selectTab(item: TabListItem, index: number) {
    if (this.disabled()) return;

    this.activeTab.set(item.value);
    this.selectedValue.emit(item.value);
    this.selectedIndex.emit(index);
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
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-5 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  }

  private getStateClasses(item: TabListItem): string {
    if (this.disabled()) {
      return 'opacity-50 cursor-not-allowed';
    }

    if (this.isActive(item)) {
      return 'bg-(--primary)/75 text-white';
    }

    return 'hover:bg-(--muted-text)/25';
  }
}
