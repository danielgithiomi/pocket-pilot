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

const BALANCE_EPSILON = 0.01;

function isSettled(balance: number): boolean {
    return Math.abs(balance) < BALANCE_EPSILON;
}

export function calculateSettlments(participants: Participant[], currency: string): Settlement[] {
    const balances = participants.map((p) => ({
        id: p.id,
        name: p.name,
        balance: p.totalPaid - p.totalOwed,
    }));

    const workingBalances = balances.map((b) => ({ ...b }));
    const creditors = workingBalances.filter((b) => b.balance > BALANCE_EPSILON);
    const debtors = workingBalances.filter((b) => b.balance < -BALANCE_EPSILON);

    const payeesByDebtor = new Map<string, Set<string>>();

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

        const payees = payeesByDebtor.get(debtor.id) ?? new Set<string>();
        payees.add(creditor.name);
        payeesByDebtor.set(debtor.id, payees);

        debtor.balance += amount;
        creditor.balance -= amount;

        if (isSettled(debtor.balance)) i++;
        if (isSettled(creditor.balance)) j++;
    }

    return balances.map((participant) => {
        const avatar = buildAvatarMap(participant.name);

        if (participant.balance < -BALANCE_EPSILON) {
            const payees = payeesByDebtor.get(participant.id);
            const toParticipant = payees ? [...payees].join(', ') : '—';

            return {
                id: participant.id,
                kind: 'pay',
                fromParticipant: participant.name,
                toParticipant,
                fromParticipantAvatar: avatar,
                toParticipantAvatar: buildAvatarMap(toParticipant.split(', ')[0] ?? participant.name),
                settlementAmount: formatCurrency(
                    Math.abs(participant.balance),
                    currency,
                    2,
                    true,
                    true,
                ),
            };
        }

        if (participant.balance > BALANCE_EPSILON) {
            return {
                id: participant.id,
                kind: 'receive',
                fromParticipant: participant.name,
                toParticipant: '—',
                fromParticipantAvatar: avatar,
                toParticipantAvatar: avatar,
                settlementAmount: formatCurrency(participant.balance, currency, 2, true, true),
            };
        }

        return {
            id: participant.id,
            kind: 'settled',
            fromParticipant: participant.name,
            toParticipant: '—',
            fromParticipantAvatar: avatar,
            toParticipantAvatar: avatar,
            settlementAmount: formatCurrency(0, currency, 2, true, true),
        };
    });
}
