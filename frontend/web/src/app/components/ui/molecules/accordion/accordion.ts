import { NgClass } from '@angular/common';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';
import { accordionContentAnimation } from './accordion.animations';
import { AccordionExpandMode, AccordionItem } from './accordion.types';
import { Component, computed, effect, input, signal } from '@angular/core';

@Component({
    styleUrl: './accordion.css',
    selector: 'molecule-accordion',
    templateUrl: './accordion.html',
    animations: [accordionContentAnimation],
    imports: [NgClass, LucideAngularModule],
})
export class Accordion {
    /* INPUTS */
    id = input.required<string>();
    showIndex = input<boolean>(true);
    wrapperClassName = input<string>('');
    items = input.required<AccordionItem[]>();
    defaultExpandedIndexes = input<number[]>([]);
    expandMode = input<AccordionExpandMode>('single');

    /* ICONS */
    protected readonly iconSize = 16;
    protected readonly ChevronDown = ChevronDown;

    /* STATE */
    private readonly expandedIndexes = signal<ReadonlySet<number>>(new Set());

    /* COMPUTED */
    accordionId = computed<string>(() => `accordion-${this.id()}`);
    allowMultiple = computed(() => this.expandMode() === 'multiple');

    private readonly initializeExpanded = effect(() => {
        const defaults = this.defaultExpandedIndexes();
        if (!defaults.length) return;

        this.expandedIndexes.set(new Set(defaults));
    });

    /* METHODS */
    isExpanded(index: number): boolean {
        return this.expandedIndexes().has(index);
    }

    trackItem(index: number, item: AccordionItem): string {
        return item.id ?? `accordion-item-${index}`;
    }

    formatIndex(index: number): string {
        return String(index + 1).padStart(2, '0');
    }

    toggleItem(index: number): void {
        this.expandedIndexes.update((current) => {
            const isOpen = current.has(index);

            if (isOpen) {
                const next = new Set(current);
                next.delete(index);
                return next;
            }

            if (!this.allowMultiple()) {
                return new Set([index]);
            }

            const next = new Set(current);
            next.add(index);
            return next;
        });
    }
}
