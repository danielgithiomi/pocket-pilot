import { ISplitrEvent } from '@global/types';
import { COLOR_PALETTE } from '@libs/constants';
import { formatCurrency, hashFromName } from '@libs/utils';
import { Avatar, Participant, Settlement } from './splitr-breakdown.types';

export function buildAvatarMap(name: string): Avatar {
    return COLOR_PALETTE[Math.abs(hashFromName(name)) % COLOR_PALETTE.length];
}

export function buildParticipantsMap(event: ISplitrEvent): Participant[] {
    const participantsMap = new Map<string, Participant>();
    const { eventMembers, billPayers, eventSplittables } = event;

    eventMembers.forEach((member, index) => {
        participantsMap.set(member, {
            id: String(index + 1),
            name: member,
            totalPaid: 0,
            totalOwed: 0
        });
    });

    billPayers.forEach(billPayer => {
        const participant = participantsMap.get(billPayer.payerName);
        if (participant) participant.totalPaid += billPayer.payerAmount;
    });

    eventSplittables.forEach(splittable => {
        const { quantitySplits, unitPrice } = splittable;

        quantitySplits.forEach(quantitySplit => {
            const { consumerName, consumerQuantity } = quantitySplit;
            const participant = participantsMap.get(consumerName);

            if (participant) participant.totalOwed += consumerQuantity * unitPrice;
        });
    });

    return Array.from(participantsMap.values());
}

const BALANCE_EPSILON = 0.01;

function isSettled(balance: number): boolean {
    return Math.abs(balance) < BALANCE_EPSILON;
}

export function calculateSettlments(participants: Participant[], currency: string): Settlement[] {
    const settlements: Settlement[] = [];

    const balances = participants.map(p => ({
        id: p.id,
        name: p.name,
        balance: p.totalPaid - p.totalOwed
    }));

    const workingBalances = balances.map(b => ({ ...b }));
    const creditors = workingBalances.filter(b => b.balance > BALANCE_EPSILON);
    const debtors = workingBalances.filter(b => b.balance < -BALANCE_EPSILON);

    let transferIndex = 0;
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

        settlements.push({
            id: `${debtor.id}-${creditor.id}-${transferIndex++}`,
            kind: 'pay',
            fromParticipant: debtor.name,
            toParticipant: creditor.name,
            fromParticipantAvatar: buildAvatarMap(debtor.name),
            toParticipantAvatar: buildAvatarMap(creditor.name),
            settlementAmount: formatCurrency(amount, currency, 2, true, true)
        });

        debtor.balance += amount;
        creditor.balance -= amount;

        if (isSettled(debtor.balance)) i++;
        if (isSettled(creditor.balance)) j++;
    }

    balances
        .filter(participant => participant.balance > BALANCE_EPSILON)
        .forEach(creditor => {
            settlements.push({
                id: `receive-${creditor.id}`,
                kind: 'receive',
                fromParticipant: creditor.name,
                toParticipant: '—',
                fromParticipantAvatar: buildAvatarMap(creditor.name),
                toParticipantAvatar: buildAvatarMap(creditor.name),
                settlementAmount: formatCurrency(creditor.balance, currency, 2, true, true)
            });
        });

    balances
        .filter(participant => isSettled(participant.balance))
        .forEach(participant => {
            settlements.push({
                id: participant.id,
                kind: 'settled',
                fromParticipant: participant.name,
                toParticipant: '—',
                fromParticipantAvatar: buildAvatarMap(participant.name),
                toParticipantAvatar: buildAvatarMap(participant.name),
                settlementAmount: formatCurrency(0, currency, 2, true, true)
            });
        });

    return settlements;
}
