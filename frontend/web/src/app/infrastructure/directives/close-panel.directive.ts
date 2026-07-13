import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

export type ClosePanelReason = 'outside-click' | 'escape';

export interface ClosePanelEvent {
    reason: ClosePanelReason;
    sourceEvent: MouseEvent | KeyboardEvent;
}

@Directive({
    selector: '[closePanel]'
})
export class ClosePanelDirective {
    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

    readonly closePanelEnabled = input<boolean>(true);
    readonly closePanelOnEscape = input<boolean>(true);
    readonly closePanelOnOutsideClick = input<boolean>(true);

    readonly onPanelClose = output<ClosePanelEvent>();

    @HostListener('document:click', ['$event'])
    protected handleDocumentClick(event: Event): void {
        if (!this.closePanelEnabled() || !this.closePanelOnOutsideClick()) return;
        if (!(event instanceof MouseEvent)) return;

        const target = event.target;
        if (!(target instanceof Node)) return;

        if (!this.host.nativeElement.contains(target)) {
            this.onPanelClose.emit({ reason: 'outside-click', sourceEvent: event });
        }
    }

    @HostListener('document:keydown.escape', ['$event'])
    protected handleEscapeKey(event: Event): void {
        if (!this.closePanelEnabled() || !this.closePanelOnEscape()) return;
        if (!(event instanceof KeyboardEvent)) return;

        this.onPanelClose.emit({ reason: 'escape', sourceEvent: event });
    }
}
