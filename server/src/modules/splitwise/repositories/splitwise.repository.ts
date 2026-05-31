import { Injectable } from '@nestjs/common';
import { SettleSplitrPayload, SplitwiseEventPayload } from '../dto/splitwise.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class SplitwiseRepository {
    constructor(private readonly db: DatabaseService) {}

    async createSplitwiseEvent(userId: string, payload: SplitwiseEventPayload) {
        const { billPayers, eventSplittables, ...rest } = payload;
        return await this.db.splitwiseEvent.create({
            data: {
                ...rest,
                creatorId: userId,
                billPayers: { create: billPayers },
                eventSplittables: {
                    create: eventSplittables.map(({ quantitySplits, ...splittable }) => ({
                        ...splittable,
                        quantitySplits: { create: quantitySplits },
                    })),
                },
            },
            include: {
                billPayers: true,
                eventSplittables: { include: { quantitySplits: true } },
            },
        });
    }

    getUserSplitwiseEvents(userId: string) {
        return this.db.splitwiseEvent.findMany({
            where: { creatorId: userId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } },
        });
    }

    getSplitwiseEventById(eventId: string) {
        return this.db.splitwiseEvent.findUnique({
            where: { id: eventId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } },
        });
    }

    markSplitwiseEventAsSettledOrPending(userId: string, eventId: string, payload: SettleSplitrPayload) {
        const { isSettled } = payload;
        return this.db.splitwiseEvent.update({
            where: { id: eventId, creatorId: userId },
            data: { isSettled },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } },
        });
    }

    deleteSplitwiseEvent(userId: string, eventId: string) {
        return this.db.splitwiseEvent.delete({
            where: { id: eventId, creatorId: userId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } },
        });
    }
}
