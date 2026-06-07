import { NgClass } from '@angular/common';
import { LucideAngularModule, Plus, Minus } from 'lucide-angular';
import { Component, computed, input, output } from '@angular/core';

@Component({
    selector: 'member-quantifier',
    styleUrl: './member-quantifier.css',
    imports: [LucideAngularModule, NgClass],
    template: ` <div
        class="member-quantifier"
        [id]="memberQuantifierId()"
        (click)="$event.stopPropagation()"
    >
        <button
            type="button"
            class="group/decrease"
            [disabled]="isMinimumQuantity()"
            (click)="onQuantityChangeEvent.emit('decrease')"
        >
            <lucide-icon
                name="minus"
                [img]="Decrease"
                [size]="iconSize()"
                [ngClass]="{
                    'text-primary-text': inverted(),
                    'group-hover/decrease:text-primary': !isMinimumQuantity(),
                }"
            />
        </button>
        <p>{{ quantity() }}</p>
        <button
            type="button"
            class="group/increase"
            [disabled]="isMaximumQuantity()"
            (click)="onQuantityChangeEvent.emit('increase')"
        >
            <lucide-icon
                name="plus"
                [img]="Increase"
                [size]="iconSize()"
                [ngClass]="{
                    'text-primary-text': inverted(),
                    'group-hover/increase:text-primary': !isMaximumQuantity(),
                }"
            />
        </button>
    </div>`,
})
export class MemberQuantifier {
    // ICONS
    protected readonly Increase = Plus;
    protected readonly Decrease = Minus;

    // INPUTS
    readonly id = input.required<string>();
    readonly maxQuantity = input<number>(9);
    readonly iconSize = input.required<number>();
    readonly quantity = input.required<number>();
    readonly inverted = input.required<boolean>();
    readonly isMaximumQuantityReached = input<boolean>(false);

    // OUTPUTS
    readonly onQuantityChangeEvent = output<QuantityChangeVariant>();

    // COMPUTED
    protected readonly isMinimumQuantity = computed<boolean>(() => this.quantity() === 1);
    protected readonly memberQuantifierId = computed<string>(() => `${this.id()}-quantifier`);
    protected readonly isMaximumQuantity = computed<boolean>(
        () => this.quantity() === this.maxQuantity() || this.isMaximumQuantityReached(),
    );
}

export type QuantityChangeVariant = 'increase' | 'decrease';
