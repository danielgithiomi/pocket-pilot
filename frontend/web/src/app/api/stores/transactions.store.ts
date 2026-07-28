import { getMonthValue } from '@libs/utils'
import { ToastService } from '@atoms/toast';
import { TransactionsService } from '@api/transactions.service';
import { DestroyRef, inject, Injectable, signal, computed } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TransactionsStore {
    private readonly MONTH_INDEX = new Date().getMonth();

    // SSE
    private eventSource?: EventSource;
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly transactionsService = inject(TransactionsService);

    // DATA
    private readonly currentMonthIndex = signal<number>(this.MONTH_INDEX);

    // COMPUTED
    readonly currentMonth = computed<string>(() => getMonthValue(this.currentMonthIndex()));

    // EXPOSED
    readonly actualMonth = getMonthValue(this.MONTH_INDEX);

    constructor() {
        this.connectToSSEStream();
        this.destroyRef.onDestroy(() => this.eventSource?.close());
    }

    // SETTERS
    setCurrentMonth(monthIndex: number){
        this.currentMonthIndex.set(monthIndex);
    }

    resetCurrentMonth(){
        this.currentMonthIndex.set(this.MONTH_INDEX);
    }

    private connectToSSEStream() {
        console.log('Connecting to SSE Stream from Transactions Store');
        if (this.eventSource) return;

        this.eventSource = this.transactionsService.configureTransactionsSSEStream<NegativeBalanceSSEPayload>(
            (payload: NegativeBalanceSSEPayload) => {
                const {
                    transaction: { amount },
                    account: { name, balance }
                } = payload;
                const difference: number = balance - amount;

                this.toastService.show({
                    variant: 'warning',
                    title: 'Negative Balance Alert!',
                    details: `You have a negative balance of ${difference} in your [${name}] account.`
                });
            },
            (event: Event) => console.error('Event Source Error', event)
        );
    }
}

interface NegativeBalanceSSEPayload {
    account: any;
    userId: string;
    transaction: any;
}
