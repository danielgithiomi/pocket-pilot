import { formatCurrency, hashFromName } from '@libs/utils';
import { ISplitrEvent } from '@global/types';
import { COLOR_PALETTE } from '@libs/constants';
import { Avatar, Participant, Settlement } from './splitr-breakdown.types';

export function buildAvatarMap(name: string): Avatar {
    return COLOR_PALETTE[Math.abs(hashFromName(name)) % COLOR_PALETTE.length];
}

export function buildParticipantsMap(event: ISplitrEvent, selfName: string): Participant[] {
    const participantsMap = new Map<string, Participant>();
    const { eventMembers, billPayers, eventSplittables } = event;

    const concatedMembers = [...eventMembers, selfName];

    concatedMembers.forEach((member, index) => {
        participantsMap.set(member, {
            id: String(index + 1),
            name: member,
            totalPaid: 0,
            totalOwed: 0,
        });
    });

    console.log('participantsMap', participantsMap);

    // Get the amount each member paid
    billPayers.forEach((billPayer) => {
        const participant = participantsMap.get(billPayer.payerName);
        if (participant) participant.totalPaid += billPayer.payerAmount;
    });

    console.log('participantsMap', participantsMap);

    // Get amount owed by each participant
    eventSplittables.forEach((splittable) => {
        const { quantitySplits, unitPrice } = splittable;

        quantitySplits.forEach((quantitySplit) => {
            const { consumerName, consumerQuantity } = quantitySplit;
            const participant = participantsMap.get(consumerName);

            if (participant) participant.totalOwed += consumerQuantity * unitPrice;
        });
    });

    console.log('final participantsMap', Array.from(participantsMap.values()));

    return Array.from(participantsMap.values());
}

export function calculateSettlments(participants: Participant[], currency: string): Settlement[] {
    const settlements: Settlement[] = [];

    const balances = participants.map((p) => ({
        id: p.id,
        name: p.name,
        balance: p.totalPaid - p.totalOwed,
    }));

    console.log('balances', balances);

    const creditors = balances.filter((b) => b.balance > 0);
    const debtors = balances.filter((b) => b.balance < 0);

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

        settlements.push({
            id: debtor.id,
            toParticipant: creditor.name,
            fromParticipant: debtor.name,
            toParticipantAvatar: buildAvatarMap(creditor.name),
            fromParticipantAvatar: buildAvatarMap(debtor.name),
            settlementAmount: formatCurrency(amount, currency, 2, true, true),
        });

        debtor.balance += amount;
        creditor.balance -= amount;

        if (Math.abs(debtor.balance) < 0.01) i++;
        if (Math.abs(creditor.balance) < 0.01) j++;
    }

    console.log('settlements', settlements);
    return settlements;
}
