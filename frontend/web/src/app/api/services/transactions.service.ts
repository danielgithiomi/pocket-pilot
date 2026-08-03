import { SSEService } from '@api/sse.service';
import { catchError, EMPTY, map } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { TransactionsResource } from '@methods/resources';
import { ToastService } from '@components/ui/atoms/toast';
import { TransactionsMutation } from '@methods/mutations';
import {
    CreateTransactionRequest,
    IStandardError,
    IStandardResponse,
    IVoidResourceResponse,
    SSE_EVENT_NAME as SSE_EVENT
} from '@shared/types';

@Injectable({
    providedIn: 'root'
})
export class TransactionsService {
    private readonly sseService = inject(SSEService);
    private readonly toastService = inject(ToastService);
    private readonly transactionsMutation = inject(TransactionsMutation);
    private readonly transactionsResource = inject(TransactionsResource);

    getAllTransactions() {
        return this.transactionsResource.allTransactions;
    }

    getUserTransactions() {
        return this.transactionsResource.userTransactions;
    }

    getTransactionTypes() {
        return this.transactionsResource.transactionTypes;
    }

    getAllTransactionsRelatedToAccountId = (accountId: string) =>
        this.transactionsResource.allTransactionsRelatedToAccountId(accountId);

    createTransaction(accountId: string, payload: CreateTransactionRequest) {
        const type = payload.type;

        if (type === 'TRANSFER') {
            return this.transactionsMutation.createTransferTransaction(accountId, payload).pipe(
                catchError((error: IStandardError) => {
                    this.renderToast(error);
                    return EMPTY;
                })
            );
        }

        return this.transactionsMutation.createTransaction(accountId, payload).pipe(
            catchError((error: IStandardError) => {
                this.renderToast(error);
                return EMPTY;
            })
        );
    }

    deleteTransaction(accountId: string, transactionId: string) {
        return this.transactionsMutation.deleteTransaction(accountId, transactionId).pipe(
            map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
            catchError((error: IStandardError) => {
                this.renderToast(error);
                return EMPTY;
            })
        );
    }

    // SSE
    configureTransactionsSSEStream<T>(onEvent: (payload: T) => void, onError?: (event: Event) => void): EventSource {
        const events: SSE_EVENT[] = [SSE_EVENT.NEGATIVE_BALANCE];

        return this.sseService.configureSSEConnection<T>(events, onEvent, onError);
    }

    // HELPER FUNCTIONS
    private renderToast = (error: IStandardError) => {
        const { title, details } = error;
        this.toastService.show({
            title,
            details: details as string,
            variant: 'error'
        });
    };

    isNegativeBalance(availableBalance: number, payload: CreateTransactionRequest) {
        return availableBalance >= 0 && payload.amount! > availableBalance && payload.type === 'EXPENSE';
    }
}
