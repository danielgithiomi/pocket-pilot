import { NgClass } from '@angular/common';
import { BadgeVariant, BADGE_STYLES } from './badge.types';
import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'atom-badge',
    imports: [NgClass],
    template: `
        <span
            [ngClass]="badgeClasses()"
            class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset"
        >
            {{ label() }}
        </span>
    `,
})
export class Badge {
    // INPUTS
    readonly label = input.required<string>();
    readonly variant = input.required<BadgeVariant>();

    // COMPUTED
    protected readonly badgeClasses = computed<string>(() => {
        return BADGE_STYLES[this.variant()];
    });
}
