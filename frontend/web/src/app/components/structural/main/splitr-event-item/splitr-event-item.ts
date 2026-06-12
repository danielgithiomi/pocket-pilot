import { Badge } from '@atoms/badge';
import { ISplitrEvent } from '@global/types';
import { Overlapper } from '@atoms/overlapper';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { formatFullDate, formatCurrency } from '@libs/utils';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';
import { Component, computed, inject, input, output } from '@angular/core';

@Component({
    selector: 'splitr-event',
    styleUrl: './splitr-event-item.css',
    templateUrl: './splitr-event-item.html',
    imports: [LucideAngularModule, Badge, Overlapper]
})
export class SplitrEventItem {
    // ICONS
    protected readonly ArrowRght = ChevronRight;

    // INPUTS
    readonly splitrEvent = input.required<ISplitrEvent>();

    // OUTPUTS
    readonly onSplitrEventClickEvent = output<string>();

    // SERVICES
    protected readonly drawerService = inject(DrawerService);
    private readonly accountsService = inject(AccountsService);

    // DATA
    protected readonly currency = this.accountsService.getDefaultCurrency();

    // COMPUTED
    protected readonly payerCount = computed<string>(() => {
        return `${this.splitrEvent().billPayers.length} ${this.splitrEvent().billPayers.length === 1 ? 'Payer' : 'Payers'}`;
    });

    protected readonly settled = computed(() => {
        return this.splitrEvent().isSettled;
    });

    // UTILS
    protected formatFullDate(date: string): string {
        return formatFullDate(date);
    }

    protected formatCurrency(amount: number): string {
        return formatCurrency(amount, this.currency, 2, false, false);
    }

    // METHODS
    handleOnSplitrEventClick(event: Event) {
        event.stopPropagation();
        this.onSplitrEventClickEvent.emit(this.splitrEvent().id);
    }
}
