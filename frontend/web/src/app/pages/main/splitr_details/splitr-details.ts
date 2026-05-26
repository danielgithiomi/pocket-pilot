import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ISplitrEvent } from '@global/types';
import { ActivatedRoute } from '@angular/router';
import { DrawerService } from '@infrastructure/services';
import { SplitwiseService } from '@api/splitwise.service';
import { Breadcrumbs } from '@components/ui/atoms/breadcrumbs';
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
    private readonly route = inject(ActivatedRoute);
    protected readonly drawerService = inject(DrawerService);
    private readonly splitwiseService = inject(SplitwiseService);

    // DATA
    protected readonly eventId = this.route.snapshot.paramMap.get('eventId') ?? '';

    // REACTIVE
    protected readonly hasError = computed<boolean>(() => false);
    protected readonly isFetchingDetails = computed<boolean>(() => false);

    // COMPUTED
    protected readonly breadcrumbItems = computed(() => {
        return [
            { label: 'Events', route: '/splitwise' },
            {
                label: this.eventId,
                route: `/splitwise/${this.eventId}`,
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
