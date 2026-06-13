import { NgClass } from '@angular/common';
import { DrawerService } from '@infrastructure/services';
import { Component, computed, inject, input, output } from '@angular/core';

@Component({
    imports: [NgClass],
    selector: 'atom-modal',
    styleUrl: './modal.css',
    templateUrl: './modal.html'
})
export class Modal {
    // INPUTS
    id = input.required<string>();
    showScrollBar = input<boolean>(false);
    closeModalOnBackdropClick = input.required<boolean>();

    // OUTPUTS
    onModalBackdropClickEvent = output<void>();

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // COMPUTED
    protected readonly modalId = computed<string>(() => `modal-${this.id()}`);

    // METHODS
    protected handleCloseModal() {
        if (!this.closeModalOnBackdropClick()) return;
        this.onModalBackdropClickEvent.emit();
    }
}
