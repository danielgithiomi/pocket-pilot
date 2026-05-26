import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { DrawerService } from '@infrastructure/services';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';
import { ISplitrEvent } from '@pages/main/splitwise/events/events';
import { Component, computed, inject, input } from '@angular/core';
import { LucideAngularModule, CheckCheck, ReceiptText } from 'lucide-angular';

@Component({
    selector: 'splitr-details',
    templateUrl: './splitr-details.html',
    imports: [LucideAngularModule, NgClass, Button, Breadcrumbs],
})
export class SplitrDetails {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly SettledIcon = CheckCheck;
    protected readonly BreadcrumbIcon = ReceiptText;

    // INPUTS
    readonly splittable = input.required<ISplitrEvent>();
    
    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // COMPUTED
    protected readonly breadcrumbItems = computed(() => {
        return [
            { label: 'Accounts', route: '/accounts' },
            {
                label: this.splittable().eventName,
                route: `/splitwise/${this.splittable().id}`,
            },
        ];
    });

    // METHODS
    handleOnSplittableSettledClick() {
        //TODO: Implement settled click
    }

    handleOnSplittableDeleteClick() {
        // TODO: Implement delete click
    }
}