import { Modal } from '@atoms/modal';
import { LucideAngularModule, X } from 'lucide-angular';
import { DrawerService } from '@infrastructure/services';
import { Component, computed, inject, input, output } from '@angular/core';

@Component({
    selector: 'organism-form',
    styleUrl: './form.css',
    templateUrl: './form.html',
    imports: [LucideAngularModule, Modal]
})
export class Form {
    // ICONS
    protected readonly X = X;
    protected readonly iconSize = 18;

    // INPUTS
    id = input.required<string>();
    title = input.required<string>();
    description = input.required<string>();
    showCloseIcon = input<boolean>(true);
    onBackdropClickClose = input<boolean>(true);

    // OUTPUTS
    onFormCloseEvent = output<FormCloseEvent>();

    // COMPUTED
    protected readonly formId = computed<string>(() => `form-${this.id()}`);
    protected readonly modalId = computed<string>(() => 'form-modal-' + this.id());

    // SERVICES
    protected readonly drawerService: DrawerService = inject(DrawerService);
}

export type FormCloseEvent = 'icon' | 'backdrop';
