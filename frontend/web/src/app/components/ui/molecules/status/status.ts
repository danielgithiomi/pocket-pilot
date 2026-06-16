import { NgClass } from '@angular/common';
import { Check, LucideAngularModule, type LucideIconData } from 'lucide-angular';
import { Component, computed, input } from '@angular/core';
import { StatusStep, StatusStepState } from './status.types';

@Component({
    selector: 'molecule-status',
    styleUrl: './status.css',
    templateUrl: './status.html',
    imports: [NgClass, LucideAngularModule]
})
export class Status {
    readonly id = input.required<string>();
    readonly steps = input.required<StatusStep[]>();
    readonly activeIndex = input<number>(0);
    readonly label = input<string>('Status');
    readonly showLabel = input<boolean>(true);
    readonly iconSize = input<number>(16);

    protected readonly completedIcon = Check;

    protected readonly statusId = computed(() => `status-${this.id()}`);

    protected resolveStepState(index: number, step: StatusStep): StatusStepState {
        if (step.state) return step.state;

        const activeIndex = this.activeIndex();

        if (index < activeIndex) return 'completed';
        if (index === activeIndex) return 'active';

        return 'pending';
    }

    protected resolveStepIcon(index: number, step: StatusStep): LucideIconData {
        return this.resolveStepState(index, step) === 'completed' ? this.completedIcon : step.icon;
    }

    protected iconWrapClass(index: number, step: StatusStep): string {
        return `status-icon-wrap--${this.resolveStepState(index, step)}`;
    }

    protected isConnectorCompleted(index: number, step: StatusStep): boolean {
        return this.resolveStepState(index, step) === 'completed';
    }
}
