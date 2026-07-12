import { ToastService } from '@atoms/toast';
import { TransactionsService } from '@root/app/api';
import { DestroyRef, inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TransactionsStore {
    // SSE
    private eventSource?: EventSource;
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    private readonly toastService = inject(ToastService);
    private readonly transactionsService = inject(TransactionsService);

    constructor() {
        this.connectToSSEStream();
        this.destroyRef.onDestroy(() => this.eventSource?.close());
    }

    private connectToSSEStream() {
        console.log('Connecting to SSE Stream from Transactions Store');
        if (this.eventSource) return;

        this.eventSource = this.transactionsService.configureTransactionsSSEStream<NegativeBalanceSSEPayload>(
            (payload: NegativeBalanceSSEPayload) => {
                const {
                    account: { name, balance },
                    transaction: { amount }
                } = payload;
                const difference: number = balance - amount;

                console.log(payload);
                this.toastService.show({
                    variant: 'warning',
                    title: 'Negative Balance Alert',
                    details: `You have a negative balance of ${difference} in ${name}`
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
