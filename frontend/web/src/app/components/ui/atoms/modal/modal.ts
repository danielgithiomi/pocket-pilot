import { NgClass } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { DrawerService } from '@infrastructure/services';
import { Component, computed, inject, input, output } from '@angular/core';

@Component({
    selector: 'atom-modal',
    styleUrl: './modal.css',
    templateUrl: './modal.html',
    imports: [NgClass, LucideAngularModule]
})
export class Modal {
    showCloseIcon = input<boolean>(true);
    // OUTPUTS
    onModalCloseEvent = output<ModalCloseEvent>();

    // INPUTS
    id = input.required<string>();
    // ICONS
    protected readonly X = X;
    showScrollBar = input<boolean>(false);
    closeModalOnBackdropClick = input.required<boolean>();
    protected readonly iconSize = 18;

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // COMPUTED
    protected readonly modalId = computed<string>(() => `modal-${this.id()}`);

    // METHODS
    protected handleCloseModal(source: ModalCloseEvent) {
        if (source === 'icon') this.onModalCloseEvent.emit(source);

        if (!this.closeModalOnBackdropClick()) return;
        this.onModalCloseEvent.emit(source);
    }
}

export type ModalCloseEvent = 'icon' | 'backdrop';
