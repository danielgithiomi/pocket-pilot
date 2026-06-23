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
    // INPUTS
    id = input.required<string>();
    inverted = input<boolean>(false);
    wrapperClasses = input<string>('');
    showCloseIcon = input<boolean>(true);
    showScrollBar = input<boolean>(false);
    closeModalOnBackdropClick = input.required<boolean>();

    // OUTPUTS
    onModalCloseEvent = output<ModalCloseEvent>();

    // ICONS
    protected readonly X = X;
    protected readonly iconSize = 16;

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // COMPUTED
    protected readonly modalId = computed<string>(() => `modal-${this.id()}`);
    protected readonly modalContentClasses = computed<string>(() => {
        const classes: string[] = [this.wrapperClasses()];

        if (!this.showScrollBar()) classes.push('no-scrollbar');
        if (!this.drawerService.isDrawerCollapsed()) classes.push('w-full! lg:w-3/4! xl:w-1/2!');

        return classes.filter(Boolean).join(' ');
    });

    // METHODS
    protected handleCloseModal(source: ModalCloseEvent) {
        if (source === 'icon') this.onModalCloseEvent.emit(source);

        if (!this.closeModalOnBackdropClick()) return;
        this.onModalCloseEvent.emit(source);
    }
}

export type ModalCloseEvent = 'icon' | 'backdrop';
