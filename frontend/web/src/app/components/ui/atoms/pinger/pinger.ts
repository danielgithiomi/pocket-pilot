import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
    imports: [NgClass],
    selector: 'atom-pinger',
    template: `
        <div class="relative">
            <span [ngClass]="pingerClasses().outer"></span>
            <span [ngClass]="pingerClasses().inner"></span>
        </div>
    `
})
export class Pinger {
    // INPUTS
    readonly className = input<string>('');
    readonly size = input<PingerSize>('sm', { alias: 'pingerSize' });

    // COMPUTEDs
    protected readonly pingerClasses = computed<PingerClasses>(() => {
        const pingerSize: string = PINGER_SIZE_MAP[this.size()];

        return {
            inner: `rounded-full bg-success block ${pingerSize}`,
            outer: `absolute inset-0 rounded-full bg-success animate-ping ${pingerSize}`
        };
    });
}

type PingerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const PINGER_SIZE_MAP: Record<PingerSize, string> = {
    xs: 'h-1 w-1',
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5'
};

interface PingerClasses {
    outer: string;
    inner: string;
}
