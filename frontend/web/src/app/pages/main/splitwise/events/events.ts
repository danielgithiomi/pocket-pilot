import { Component, signal } from '@angular/core';
import { SplitrEvent } from '@structural/main/splitr-event/splitr-event';

@Component({
    selector: 'splitwise-events',
    templateUrl: './events.html',
    imports: [SplitrEvent],
})
export class SplitwiseEvents {
    // SIGNAL STATES
    protected readonly splitrEvents = signal<ISplitrEvent[]>([
        {
            id: 'f1955813-0dd0-4183-aada-1d29e99e6bb2',
            creatorId: '59e98059-87a5-48e1-9441-a0e9f7f9d149',
            eventName: 'Dinner',
            eventDate: '2026-05-24T20:26:37.162Z',
            squadName: 'CUSTOM',
            eventMembers: ['Joshua', 'Michelle', 'Julie', 'Naomi'],
            verificationTotal: 3460,
            billingCurrency: 'MUR',
            billPaymentStrategy: 'ONE',
            settledAt: null,
            updatedAt: '2026-05-24T20:28:47.473Z',
            createdAt: '2026-05-24T20:28:47.473Z',
            billPayers: [
                {
                    id: 'bc4ee535-2e5d-487d-8746-95be2e2b6c61',
                    payerName: 'Joshua',
                    payerAmount: 3460,
                    createdAt: '2026-05-24T20:28:47.473Z',
                    updatedAt: '2026-05-24T20:28:47.473Z',
                    splitwiseEventId: 'f1955813-0dd0-4183-aada-1d29e99e6bb2',
                },
            ],
            eventSplittables: [
                {
                    id: '43dfd574-c7be-45ac-bbe4-7f2f567b70d2',
                    name: 'Beers',
                    quantity: 4,
                    unitPrice: 280,
                    total: 1120,
                    settled: false,
                    splitStrategy: 'EQUAL',
                    updatedAt: '2026-05-24T20:28:47.473Z',
                    createdAt: '2026-05-24T20:28:47.473Z',
                    splitEventId: 'f1955813-0dd0-4183-aada-1d29e99e6bb2',
                    quantitySplits: [
                        {
                            id: '123',
                            consumerName: 'Joshua',
                            consumerQuantity: 1,
                        },
                        {
                            id: '123',
                            consumerName: 'Michelle',
                            consumerQuantity: 1,
                        },
                        {
                            id: '123',
                            consumerName: 'Julie',
                            consumerQuantity: 1,
                        },
                    ],
                },
                {
                    id: '8f90f736-73d8-428c-b4f4-539f12afee5e',
                    name: 'Pizza',
                    quantity: 3,
                    unitPrice: 780,
                    total: 2340,
                    settled: false,
                    splitStrategy: 'EQUAL',
                    updatedAt: '2026-05-24T20:28:47.473Z',
                    createdAt: '2026-05-24T20:28:47.473Z',
                    splitEventId: 'f1955813-0dd0-4183-aada-1d29e99e6bb2',
                    quantitySplits: [
                        {
                            id: '123',
                            consumerName: 'Joshua',
                            consumerQuantity: 1,
                        },
                    ],
                },
            ],
        },
    ]);
}

export interface ISplitrEvent {
    id: string;
    creatorId: string;
    eventName: string;
    eventDate: string;
    squadName: string;
    eventMembers: string[];
    verificationTotal: number;
    billingCurrency: string;
    billPaymentStrategy: string;
    settledAt: string | null;
    updatedAt: string;
    createdAt: string;
    billPayers: {
        id: string;
        payerName: string;
        payerAmount: number;
        createdAt: string;
        updatedAt: string;
        splitwiseEventId: string;
    }[];
    eventSplittables: {
        id: string;
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
        settled: boolean;
        splitStrategy: string;
        updatedAt: string;
        createdAt: string;
        splitEventId: string;
        quantitySplits: {
            id: string;
            consumerName: string;
            consumerQuantity: number;
        }[];
    }[];
}
