import { Badge } from '@atoms/badge';
import { Overlapper } from '@atoms/overlapper';
import { AccountsService } from '@api/accounts.service';
import { formatFullDate, formatCurrency } from '@libs/utils';
import { Component, inject, input, output, signal } from '@angular/core';
import { LucideAngularModule, ChevronRight } from 'lucide-angular';
import { ISplitrEvent } from '@pages/main/splitwise/events/events';

@Component({
    selector: 'splitr-event',
    styleUrl: './splitr-event.css',
    templateUrl: './splitr-event.html',
    imports: [LucideAngularModule, Badge, Overlapper],
})
export class SplitrEvent {
    // ICONS
    protected readonly ArrowRght = ChevronRight;

    // INPUTS
    readonly splitrEvent = input.required<ISplitrEvent>();

    // OUTPUTS
    readonly onSplitrEventClickEvent = output<string>();

    // SERVICES
    private readonly accountsService = inject(AccountsService);

    // DATA
    protected readonly currency = this.accountsService.getDefaultCurrency();

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
