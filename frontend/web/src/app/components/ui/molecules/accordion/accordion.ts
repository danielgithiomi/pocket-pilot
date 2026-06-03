import { NgClass } from '@angular/common';
import { AccordionExpandMode, AccordionItem } from './accordion.types';
import { accordionContentAnimation } from './accordion.animations';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';
import { Component, computed, effect, input, signal } from '@angular/core';

@Component({
    selector: 'molecule-accordion',
    styleUrl: './accordion.css',
    templateUrl: './accordion.html',
    animations: [accordionContentAnimation],
    imports: [NgClass, LucideAngularModule],
})
export class Accordion {
    /* INPUTS */
    items = input.required<AccordionItem[]>();
    expandMode = input<AccordionExpandMode>('single');
    defaultExpandedIndexes = input<number[]>([]);
    showIndex = input<boolean>(true);
    wrapperClassName = input<string>('');

    /* ICONS */
    readonly ChevronDown = ChevronDown;
    readonly iconSize = 16;

    /* STATE */
    private readonly expandedIndexes = signal<ReadonlySet<number>>(new Set());

    /* COMPUTED */
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
