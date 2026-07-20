import { hashFromName } from '@libs/utils';
import { ColorPalette } from '@libs/types';
import { COLOR_PALETTE } from '@libs/constants';
import { Component, computed, input } from '@angular/core';
import { OverlapperSize, OVERLAPPER_SIZE_STYLES } from './overlapper.types';

interface OverlapperItem {
    name: string;
    initials: string;
    palette: ColorPalette;
}

@Component({
    selector: 'atom-overlapper',
    template: `
        <div [class]="containerClasses()">
            @for (item of visibleItems(); track item.name) {
                <span [class]="itemClasses(item.palette)" [title]="item.name">
                    {{ item.initials }}
                </span>
            }

            @if (overflowCount() > 0) {
                <span [class]="overflowClasses()" [title]="overflowTitle()"> +{{ overflowCount() }} </span>
            }
        </div>
    `
})
export class Overlapper {
    // INPUTS
    readonly maxVisible = input<number>(5);
    readonly className = input<string>('');
    readonly items = input.required<string[]>();
    readonly size = input<OverlapperSize>('md');

    // COMPUTED
    protected readonly visibleItems = computed<OverlapperItem[]>(() => {
        return this.items()
            .slice(0, this.maxVisible())
            .map(name => ({
                name,
                initials: this.getInitials(name),
                palette: COLOR_PALETTE[Math.abs(hashFromName(name)) % COLOR_PALETTE.length]
            }));
    });

    protected readonly overflowCount = computed<number>(() => Math.max(0, this.items().length - this.maxVisible()));

    protected readonly overflowTitle = computed<string>(() => this.items().slice(this.maxVisible()).join(', '));

    protected readonly containerClasses = computed<string>(() =>
        ['flex items-center', this.className()].filter(Boolean).join(' ')
    );

    private readonly sizeClasses = computed<string>(() => OVERLAPPER_SIZE_STYLES[this.size()]);

    private readonly baseItemClasses =
        'inline-flex items-center justify-center rounded-full font-semibold ring-1 first:ml-0';

    protected itemClasses(palette: ColorPalette): string {
        return [this.baseItemClasses, this.sizeClasses(), palette.bg, palette.fg].join(' ');
    }

    protected overflowClasses(): string {
        return [this.baseItemClasses, this.sizeClasses(), 'bg-(--gray1) text-white'].join(' ');
    }

    private getInitials(name: string): string {
        const trimmed = name.trim();
        if (!trimmed) return '?';

        const parts = trimmed.split(/\s+/);
        if (parts.length === 1) {
            return trimmed.slice(0, 2).replace(/^./, c => c.toUpperCase());
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
}
